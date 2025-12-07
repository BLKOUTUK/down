'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Crown, ChevronLeft, Send, Image, Smile, Check, CheckCheck, MoreVertical, Phone, Video, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import type { User, Conversation, Message } from '@/lib/types';

interface ConversationWithDetails {
  id: string;
  created_at?: string;
  other_user?: any;
  last_msg?: any;
  unread_count: number;
}

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      setupRealtime();
    }
  }, [currentUser]);

  useEffect(() => {
    // Check if we should start a new conversation
    const userId = searchParams.get('user');
    if (userId && currentUser) {
      startOrOpenConversation(userId);
    }
  }, [searchParams, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAuth = async () => {
    const stored = localStorage.getItem('down_user');
    if (!stored) {
      router.push('/login');
      return;
    }

    const sessionUser = JSON.parse(stored);
    
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionUser.id)
      .single();

    if (!data || data.application_status !== 'APPROVED') {
      router.push('/login');
      return;
    }

    setCurrentUser(data);
    setLoading(false);
  };

  const fetchConversations = async () => {
    if (!currentUser) return;

    // Get all conversations the user is part of
    const { data: participations } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations (
          id,
          last_message,
          created_at
        )
      `)
      .eq('user_id', currentUser.id);

    if (!participations) return;

    // Get other participants and last messages for each conversation
    const conversationsWithDetails = await Promise.all(
      participations.map(async (p) => {
        const convId = p.conversation_id;

        // Get other participant
        const { data: otherParticipant } = await supabase
          .from('conversation_participants')
          .select(`
            user:users (
              id,
              name,
              display_name,
              avatar_url
            )
          `)
          .eq('conversation_id', convId)
          .neq('user_id', currentUser.id)
          .single();

        // Get last message
        const { data: lastMsg } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', convId)
          .eq('receiver_id', currentUser.id)
          .is('read_at', null);

        const conv = p.conversations as any;
        return {
          id: convId,
          created_at: conv?.created_at,
          other_user: otherParticipant?.user,
          last_msg: lastMsg,
          unread_count: unreadCount || 0
        } as ConversationWithDetails;
      })
    );

    // Sort by last message
    conversationsWithDetails.sort((a, b) => {
      const dateA = a.last_msg?.created_at || a.created_at || '';
      const dateB = b.last_msg?.created_at || b.created_at || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    setConversations(conversationsWithDetails);
  };

  const setupRealtime = () => {
    if (!currentUser) return;

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (selectedConversation && newMsg.conversation_id === selectedConversation.id) {
            setMessages(prev => [...prev, newMsg]);
            // Mark as read
            markMessageAsRead(newMsg.id);
          }
          fetchConversations(); // Refresh list
        }
      )
      .subscribe();

    // Subscribe to typing indicators
    const typingSubscription = supabase
      .channel('typing')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversation_participants'
        },
        (payload) => {
          const updated = payload.new as any;
          if (
            selectedConversation &&
            updated.conversation_id === selectedConversation.id &&
            updated.user_id !== currentUser.id
          ) {
            setOtherUserTyping(updated.is_typing);
          }
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      typingSubscription.unsubscribe();
    };
  };

  const startOrOpenConversation = async (userId: string) => {
    if (!currentUser) return;

    // Check if conversation exists
    const { data: existingConvs } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', currentUser.id);

    const existingConvIds = existingConvs?.map(c => c.conversation_id) || [];

    if (existingConvIds.length > 0) {
      const { data: otherParticipant } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId)
        .in('conversation_id', existingConvIds)
        .single();

      if (otherParticipant) {
        // Open existing conversation
        const conv = conversations.find(c => c.id === otherParticipant.conversation_id);
        if (conv) {
          selectConversation(conv);
          return;
        }
      }
    }

    // Create new conversation
    const { data: newConv } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (newConv) {
      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: currentUser.id },
        { conversation_id: newConv.id, user_id: userId }
      ]);

      // Get other user
      const { data: otherUser } = await supabase
        .from('users')
        .select('id, name, display_name, avatar_url')
        .eq('id', userId)
        .single();

      const convWithDetails: ConversationWithDetails = {
        id: newConv.id,
        created_at: newConv.created_at,
        other_user: otherUser,
        unread_count: 0
      };

      setConversations(prev => [convWithDetails, ...prev]);
      selectConversation(convWithDetails);
    }
  };

  const selectConversation = async (conversation: ConversationWithDetails) => {
    setSelectedConversation(conversation);
    
    // Fetch messages
    const { data: msgs } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!sender_id (
          id,
          name,
          display_name,
          avatar_url
        )
      `)
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });

    setMessages(msgs || []);

    // Mark messages as read
    if (currentUser) {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString(), status: 'READ' })
        .eq('conversation_id', conversation.id)
        .eq('receiver_id', currentUser.id)
        .is('read_at', null);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString(), status: 'READ' })
      .eq('id', messageId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    setSending(true);
    const messageContent = newMessage;
    setNewMessage('');

    // Get receiver ID
    const receiverId = selectedConversation.other_user?.id;
    if (!receiverId) return;

    const { data: sentMsg, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation.id,
        sender_id: currentUser.id,
        receiver_id: receiverId,
        content: messageContent,
        status: 'SENT'
      })
      .select(`
        *,
        sender:users!sender_id (
          id,
          name,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (sentMsg) {
      setMessages(prev => [...prev, sentMsg]);
      
      // Update conversation last message
      await supabase
        .from('conversations')
        .update({ last_message: new Date().toISOString() })
        .eq('id', selectedConversation.id);
    }

    // Clear typing indicator
    updateTypingIndicator(false);
    setSending(false);
  };

  const updateTypingIndicator = async (typing: boolean) => {
    if (!selectedConversation || !currentUser) return;

    await supabase
      .from('conversation_participants')
      .update({ 
        is_typing: typing,
        typing_at: typing ? new Date().toISOString() : null
      })
      .eq('conversation_id', selectedConversation.id)
      .eq('user_id', currentUser.id);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Update typing indicator
    if (!isTyping) {
      setIsTyping(true);
      updateTypingIndicator(true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to clear typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingIndicator(false);
    }, 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxe-gradient afro-pattern flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxe-gradient afro-pattern flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {selectedConversation ? (
            <>
              <button
                onClick={() => setSelectedConversation(null)}
                className="flex items-center gap-2 text-gold md:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                  {selectedConversation.other_user?.avatar_url ? (
                    <img
                      src={selectedConversation.other_user.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Crown className="h-5 w-5 text-gold" />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-white">
                    {selectedConversation.other_user?.display_name || selectedConversation.other_user?.name}
                  </h2>
                  {otherUserTyping && (
                    <p className="text-xs text-gold">typing...</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gold transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gold transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gold transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-gold">
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
              <h1 className="text-xl font-bold text-gold">Messages</h1>
              <div className="w-20" />
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 pt-16 flex">
        {/* Conversations List */}
        <div className={`w-full md:w-80 border-r border-gold/20 bg-black/30 ${
          selectedConversation ? 'hidden md:block' : 'block'
        }`}>
          <div className="p-4 border-b border-gold/20">
            <h2 className="text-lg font-bold text-gold">Conversations</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-8rem)]">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <Crown className="h-12 w-12 text-gold/30 mx-auto mb-4" />
                <p className="text-gray-400">No conversations yet</p>
                <p className="text-sm text-gray-500 mt-2">Start matching to begin chatting!</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gold/5 transition-colors border-b border-gold/10 ${
                    selectedConversation?.id === conv.id ? 'bg-gold/10' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                      {conv.other_user?.avatar_url ? (
                        <img
                          src={conv.other_user.avatar_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Crown className="h-6 w-6 text-gold" />
                      )}
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-white">
                      {conv.other_user?.display_name || conv.other_user?.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {conv.last_msg?.content || 'Start chatting...'}
                    </p>
                  </div>
                  {conv.last_msg && (
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(conv.last_msg.created_at)}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${
          selectedConversation ? 'block' : 'hidden md:flex'
        }`}>
          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        isOwn 
                          ? 'bg-gold text-black rounded-l-2xl rounded-tr-2xl' 
                          : 'bg-card border border-gold/20 text-white rounded-r-2xl rounded-tl-2xl'
                      } px-4 py-2`}>
                        <p>{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                          <span className={`text-xs ${isOwn ? 'text-black/60' : 'text-gray-500'}`}>
                            {formatMessageTime(msg.created_at)}
                          </span>
                          {isOwn && (
                            msg.status === 'READ' ? (
                              <CheckCheck className="h-4 w-4 text-black/60" />
                            ) : msg.status === 'DELIVERED' ? (
                              <CheckCheck className="h-4 w-4 text-black/40" />
                            ) : (
                              <Check className="h-4 w-4 text-black/40" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {otherUserTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-gold/20 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gold/20 bg-black/30">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gold transition-colors">
                    <Image className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gold transition-colors">
                    <Smile className="h-6 w-6" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-card border border-gold/20 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
                    data-testid="message-input"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="p-3 bg-gold-gradient rounded-full text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                    data-testid="send-button"
                  >
                    {sending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Crown className="h-16 w-16 text-gold/30 mx-auto mb-4" />
                <p className="text-gray-400">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
