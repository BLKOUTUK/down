'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ChevronLeft, Plus, Calendar, MapPin, Users, Trash2, Edit, Loader2, Send, Eye, Copy, Share2, Bell, Mail, MessageSquare, Handshake, Building2, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

const EVENT_TYPES = [
  { value: 'KICKOFF', label: 'Kick-Off Event', emoji: '🎉' },
  { value: 'DATE_NIGHT', label: 'Date Night', emoji: '💕' },
  { value: 'GALA', label: 'Gala', emoji: '✨' },
  { value: 'WORKSHOP', label: 'Workshop', emoji: '📚' },
  { value: 'SOCIAL', label: 'Social Event', emoji: '🍸' },
  { value: 'WELLNESS', label: 'Wellness', emoji: '🧘' },
  { value: 'CULTURAL', label: 'Cultural Outing', emoji: '🎭' }
];

const PARTNER_TYPES = [
  { value: 'lifestyle', label: 'Lifestyle', color: 'bg-pink-500' },
  { value: 'voluntary', label: 'Voluntary Sector', color: 'bg-green-500' },
  { value: 'cultural', label: 'Cultural', color: 'bg-purple-500' },
  { value: 'health', label: 'Health & Wellbeing', color: 'bg-teal-500' },
  { value: 'advocacy', label: 'Advocacy', color: 'bg-orange-500' }
];

const PROMO_TEMPLATES = {
  KICKOFF: {
    subject: '🎉 Cohort Launch Party - You\'re Invited!',
    body: `Welcome to your cohort! Join us for the official kick-off where you'll meet your fellow community members. Dress code: Luxe casual. This is where connections begin.`
  },
  DATE_NIGHT: {
    subject: '💕 Date Night - Find Your Match',
    body: `An intimate evening designed for meaningful connections. Speed dating, conversation starters, and the chance to meet someone special. Limited spots available.`
  },
  GALA: {
    subject: '✨ DOWN Gala - A Night of Elegance',
    body: `Our signature event celebrating Black queer excellence. Red carpet, live entertainment, and an unforgettable evening with the community. Black tie optional.`
  },
  WORKSHOP: {
    subject: '📚 Workshop - Grow Together',
    body: `Invest in yourself and your relationships. This workshop focuses on personal development, communication skills, and building lasting connections.`
  },
  SOCIAL: {
    subject: '🍸 Social Mixer - Casual Connections',
    body: `Relaxed vibes, great company. Come as you are and enjoy an evening of conversation, drinks, and community. New members especially welcome!`
  },
  WELLNESS: {
    subject: '🧘 Wellness Session - Mind, Body, Soul',
    body: `Take care of yourself with the community. Whether it's yoga, meditation, or a spa day - we're prioritizing wellbeing together.`
  },
  CULTURAL: {
    subject: '🎭 Cultural Outing - Experience Together',
    body: `Explore art, music, theatre, and culture with fellow members. These shared experiences create deeper bonds and lasting memories.`
  }
};

interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
  description?: string;
  partner_type: string;
  instagram?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState<any>(null);
  const [showRsvpList, setShowRsvpList] = useState<any>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [rsvpUsers, setRsvpUsers] = useState<any[]>([]);
  const [promoMessage, setPromoMessage] = useState({ subject: '', body: '' });
  const [sendingPromo, setSendingPromo] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    logo_url: '',
    website: '',
    description: '',
    partner_type: 'lifestyle',
    instagram: ''
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'SOCIAL',
    event_date: '',
    location: '',
    address: '',
    max_capacity: '',
    price: '0',
    is_partnership: false,
    partner_id: '',
    partner_name: '',
    partner_logo_url: '',
    partner_website: '',
    partner_type: ''
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

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

    if (!data || data.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    await fetchEvents();
    await fetchPartners();
    setLoading(false);
  };

  const fetchPartners = async () => {
    const { data } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('name');
    setPartners(data || []);
  };

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    const eventsWithRsvps = await Promise.all(
      (data || []).map(async (event) => {
        const { count: goingCount } = await supabase
          .from('event_rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)
          .eq('status', 'going');
        
        const { count: maybeCount } = await supabase
          .from('event_rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)
          .eq('status', 'maybe');
          
        return { 
          ...event, 
          going_count: goingCount || 0,
          maybe_count: maybeCount || 0
        };
      })
    );

    setEvents(eventsWithRsvps);
  };

  const handleCreatePartner = async () => {
    if (!newPartner.name || !newPartner.partner_type) {
      alert('Please fill in partner name and type');
      return;
    }

    const { error } = await supabase
      .from('partners')
      .insert({
        name: newPartner.name,
        logo_url: newPartner.logo_url || null,
        website: newPartner.website || null,
        description: newPartner.description || null,
        partner_type: newPartner.partner_type,
        instagram: newPartner.instagram || null
      });

    if (error) {
      alert('Failed to add partner');
      return;
    }

    setNewPartner({ name: '', logo_url: '', website: '', description: '', partner_type: 'lifestyle', instagram: '' });
    setShowPartnerModal(false);
    fetchPartners();
  };

  const handleSelectPartner = (partner: Partner) => {
    setNewEvent(ev => ({
      ...ev,
      is_partnership: true,
      partner_id: partner.id,
      partner_name: partner.name,
      partner_logo_url: partner.logo_url || '',
      partner_website: partner.website || '',
      partner_type: partner.partner_type
    }));
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) {
      alert('Please fill in title and date');
      return;
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title: newEvent.title,
        description: newEvent.description,
        event_type: newEvent.event_type,
        event_date: newEvent.event_date,
        location: newEvent.location,
        address: newEvent.address,
        max_capacity: newEvent.max_capacity ? parseInt(newEvent.max_capacity) : null,
        price: parseFloat(newEvent.price) || 0,
        is_partnership: newEvent.is_partnership,
        partner_name: newEvent.is_partnership ? newEvent.partner_name : null,
        partner_logo_url: newEvent.is_partnership ? newEvent.partner_logo_url : null,
        partner_website: newEvent.is_partnership ? newEvent.partner_website : null,
        partner_type: newEvent.is_partnership ? newEvent.partner_type : null,
        is_public: true
      })
      .select()
      .single();

    if (error) {
      alert('Failed to create event');
      return;
    }

    // Auto-populate promo message
    const template = PROMO_TEMPLATES[newEvent.event_type as keyof typeof PROMO_TEMPLATES];
    if (template) {
      setPromoMessage({
        subject: template.subject.replace('Event', newEvent.title),
        body: `${template.body}\n\n📅 ${new Date(newEvent.event_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n📍 ${newEvent.location || 'TBA'}\n💷 ${parseFloat(newEvent.price) > 0 ? `£${newEvent.price}` : 'Free'}`
      });
      setShowPromoModal(data);
    }

    setShowCreateModal(false);
    setNewEvent({
      title: '', description: '', event_type: 'SOCIAL',
      event_date: '', location: '', address: '', max_capacity: '', price: '0',
      early_bird_price: '', early_bird_deadline: '', promo_image_url: '', is_featured: false
    });
    fetchEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await supabase.from('events').delete().eq('id', eventId);
    fetchEvents();
  };

  const openPromoModal = (event: any) => {
    const template = PROMO_TEMPLATES[event.event_type as keyof typeof PROMO_TEMPLATES];
    setPromoMessage({
      subject: `${EVENT_TYPES.find(t => t.value === event.event_type)?.emoji || ''} ${event.title}`,
      body: `${template?.body || event.description || ''}\n\n📅 ${new Date(event.event_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at ${new Date(event.event_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}\n📍 ${event.location || 'TBA'}\n💷 ${event.price > 0 ? `£${event.price}` : 'Free'}\n\nRSVP now in the DOWN app!`
    });
    setShowPromoModal(event);
  };

  const sendPromoToAllMembers = async () => {
    setSendingPromo(true);
    
    // In production, this would send emails/push notifications
    // For now, we'll create in-app notifications
    const { data: members } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('application_status', 'APPROVED');

    // Simulate sending (in production, integrate with SendGrid/Twilio)
    console.log(`Sending promo to ${members?.length || 0} members:`, promoMessage);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`✅ Promotion sent to ${members?.length || 0} members!\n\nSubject: ${promoMessage.subject}`);
    setSendingPromo(false);
    setShowPromoModal(null);
  };

  const copyPromoText = () => {
    const text = `${promoMessage.subject}\n\n${promoMessage.body}`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const generateShareLinks = (event: any) => {
    const eventUrl = `https://down.community/events/${event.id}`;
    const text = encodeURIComponent(`${promoMessage.subject}\n\n${promoMessage.body}`);
    
    return {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent(promoMessage.subject)}&body=${text}`
    };
  };

  const viewRsvpList = async (event: any) => {
    const { data } = await supabase
      .from('event_rsvps')
      .select(`
        *,
        user:users(id, name, display_name, email, avatar_url)
      `)
      .eq('event_id', event.id)
      .order('created_at', { ascending: false });
    
    setRsvpUsers(data || []);
    setShowRsvpList(event);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxe-gradient afro-pattern flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxe-gradient afro-pattern">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-gold">
            <ChevronLeft className="h-5 w-5" />
            <Crown className="h-6 w-6" />
            <span className="font-bold">Admin</span>
          </Link>
          <h1 className="text-xl font-bold text-gold">Events & Promotions</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold-gradient text-black font-semibold rounded-lg"
          >
            <Plus className="h-4 w-4" />
            New Event
          </button>
        </div>
      </header>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Pipeline Overview */}
          <div className="mb-8 bg-card/50 border border-gold/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gold mb-4">📊 Event Pipeline</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-purple/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-purple-light">{events.filter(e => new Date(e.event_date) > new Date()).length}</p>
                <p className="text-sm text-gray-400">Upcoming</p>
              </div>
              <div className="bg-gold/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-gold">{events.reduce((acc, e) => acc + (e.going_count || 0), 0)}</p>
                <p className="text-sm text-gray-400">Total RSVPs</p>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-green-400">{events.filter(e => (e.going_count || 0) >= (e.max_capacity || 999) * 0.8).length}</p>
                <p className="text-sm text-gray-400">Nearly Full</p>
              </div>
              <div className="bg-pink-500/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-pink-400">{events.filter(e => e.event_type === 'DATE_NIGHT').length}</p>
                <p className="text-sm text-gray-400">Date Nights</p>
              </div>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-20 bg-card/50 rounded-xl border border-gold/20">
              <Calendar className="h-16 w-16 text-gold/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gold mb-2">No Events Yet</h3>
              <p className="text-gray-400">Create your first community event.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const isPast = new Date(event.event_date) < new Date();
                const isSoldOut = event.max_capacity && event.going_count >= event.max_capacity;
                
                return (
                  <div
                    key={event.id}
                    className={`bg-card/80 backdrop-blur-sm border rounded-xl p-6 ${
                      isPast ? 'border-gray-700 opacity-60' : 'border-gold/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">
                            {EVENT_TYPES.find(t => t.value === event.event_type)?.emoji}
                          </span>
                          <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full">
                            {EVENT_TYPES.find(t => t.value === event.event_type)?.label}
                          </span>
                          {isSoldOut && (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                              SOLD OUT
                            </span>
                          )}
                          {isPast && (
                            <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                              PAST
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                        {event.description && (
                          <p className="text-gray-400 mt-1 line-clamp-2">{event.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.event_date).toLocaleString('en-GB', { 
                              weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-gold">
                            <Users className="h-4 w-4" />
                            {event.going_count} going
                            {event.maybe_count > 0 && ` · ${event.maybe_count} maybe`}
                            {event.max_capacity && ` / ${event.max_capacity}`}
                          </span>
                        </div>
                        {event.price > 0 && (
                          <p className="mt-2 text-gold font-semibold">£{event.price.toFixed(2)}</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => openPromoModal(event)}
                          className="px-4 py-2 bg-purple/20 text-purple-light rounded-lg hover:bg-purple/30 transition-colors flex items-center gap-2 text-sm"
                          title="Promote Event"
                        >
                          <Send className="h-4 w-4" />
                          Promote
                        </button>
                        <button
                          onClick={() => viewRsvpList(event)}
                          className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors flex items-center gap-2 text-sm"
                          title="View RSVPs"
                        >
                          <Eye className="h-4 w-4" />
                          RSVPs
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-gold/20 rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gold mb-6">Create New Event</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(ev => ({ ...ev, title: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g. Summer Date Night"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Event Type</label>
                <select
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent(ev => ({ ...ev, event_type: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.emoji} {type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent(ev => ({ ...ev, event_date: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(ev => ({ ...ev, description: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white h-20 resize-none"
                  placeholder="What's this event about?"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location / Venue</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(ev => ({ ...ev, location: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g. The Glory, Haggerston"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newEvent.max_capacity}
                    onChange={(e) => setNewEvent(ev => ({ ...ev, max_capacity: e.target.value }))}
                    className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent(ev => ({ ...ev, price: e.target.value }))}
                    className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/10"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex-1 py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90"
              >
                Create & Promote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-gold/20 rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple/20 rounded-full flex items-center justify-center">
                <Send className="h-6 w-6 text-purple-light" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gold">Promote Event</h2>
                <p className="text-gray-400 text-sm">{showPromoModal.title}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={promoMessage.subject}
                  onChange={(e) => setPromoMessage(p => ({ ...p, subject: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Message Body</label>
                <textarea
                  value={promoMessage.body}
                  onChange={(e) => setPromoMessage(p => ({ ...p, body: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-3 text-white h-40 resize-none"
                />
              </div>

              {/* Preview */}
              <div className="bg-background/50 rounded-lg p-4 border border-gold/10">
                <p className="text-xs text-gray-500 mb-2">PREVIEW</p>
                <p className="text-gold font-semibold">{promoMessage.subject}</p>
                <p className="text-gray-300 text-sm whitespace-pre-line mt-2">{promoMessage.body}</p>
              </div>

              {/* Distribution Options */}
              <div className="pt-4 border-t border-gold/20">
                <p className="text-sm text-gray-400 mb-3">Distribution Channels</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={sendPromoToAllMembers}
                    disabled={sendingPromo}
                    className="py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sendingPromo ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Bell className="h-5 w-5" />
                        Notify All Members
                      </>
                    )}
                  </button>
                  <button
                    onClick={copyPromoText}
                    className="py-3 bg-purple/20 text-purple-light font-bold rounded-lg hover:bg-purple/30 flex items-center justify-center gap-2"
                  >
                    <Copy className="h-5 w-5" />
                    Copy Text
                  </button>
                </div>
                
                {/* Social Share */}
                <div className="flex gap-2 mt-3">
                  <a
                    href={generateShareLinks(showPromoModal).whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={generateShareLinks(showPromoModal).twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 flex items-center justify-center gap-2 text-sm"
                  >
                    <Share2 className="h-4 w-4" />
                    Twitter
                  </a>
                  <a
                    href={generateShareLinks(showPromoModal).email}
                    className="flex-1 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 flex items-center justify-center gap-2 text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPromoModal(null)}
              className="w-full mt-6 py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* RSVP List Modal */}
      {showRsvpList && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-gold/20 rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gold mb-2">RSVPs</h2>
            <p className="text-gray-400 text-sm mb-6">{showRsvpList.title}</p>
            
            {rsvpUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No RSVPs yet</p>
            ) : (
              <div className="space-y-3">
                {rsvpUsers.map((rsvp) => (
                  <div key={rsvp.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                      {rsvp.user?.avatar_url ? (
                        <img src={rsvp.user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Crown className="h-5 w-5 text-gold/50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{rsvp.user?.display_name || rsvp.user?.name}</p>
                      <p className="text-xs text-gray-500">{rsvp.user?.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      rsvp.status === 'going' ? 'bg-green-500/20 text-green-400' :
                      rsvp.status === 'maybe' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {rsvp.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowRsvpList(null)}
              className="w-full mt-6 py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
