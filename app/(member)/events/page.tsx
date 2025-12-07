'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ChevronLeft, Calendar, MapPin, Users, Clock, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import type { User, Event, EventRsvp } from '@/lib/types';

const EVENT_TYPE_LABELS: Record<string, string> = {
  KICKOFF: 'Kick-Off Event',
  DATE_NIGHT: 'Date Night',
  GALA: 'Gala',
  WORKSHOP: 'Workshop',
  SOCIAL: 'Social Event',
  WELLNESS: 'Wellness',
  CULTURAL: 'Cultural Outing'
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  KICKOFF: 'bg-purple/20 text-purple-light',
  DATE_NIGHT: 'bg-pink-500/20 text-pink-400',
  GALA: 'bg-gold/20 text-gold',
  WORKSHOP: 'bg-blue-500/20 text-blue-400',
  SOCIAL: 'bg-green-500/20 text-green-400',
  WELLNESS: 'bg-teal-500/20 text-teal-400',
  CULTURAL: 'bg-orange-500/20 text-orange-400'
};

export default function EventsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchEvents();
    }
  }, [currentUser, filter]);

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

  const fetchEvents = async () => {
    if (!currentUser) return;

    let query = supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (filter !== 'all') {
      query = query.eq('event_type', filter);
    }

    const { data: eventsData } = await query;

    // Get RSVPs for each event
    const eventsWithRsvps = await Promise.all(
      (eventsData || []).map(async (event) => {
        const { count } = await supabase
          .from('event_rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)
          .eq('status', 'going');

        const { data: userRsvp } = await supabase
          .from('event_rsvps')
          .select('*')
          .eq('event_id', event.id)
          .eq('user_id', currentUser.id)
          .single();

        return {
          ...event,
          rsvp_count: count || 0,
          user_rsvp: userRsvp
        };
      })
    );

    setEvents(eventsWithRsvps);
  };

  const handleRsvp = async (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    if (!currentUser) return;

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (event.user_rsvp) {
      // Update existing RSVP
      await supabase
        .from('event_rsvps')
        .update({ status })
        .eq('id', event.user_rsvp.id);
    } else {
      // Create new RSVP
      await supabase
        .from('event_rsvps')
        .insert({
          event_id: eventId,
          user_id: currentUser.id,
          status
        });
    }

    fetchEvents();
  };

  const formatEventDate = (date: string) => {
    const d = new Date(date);
    return {
      day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-GB', { month: 'short' }),
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gold">
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-bold text-gold">Events</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              <FilterButton
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All Events
              </FilterButton>
              {Object.keys(EVENT_TYPE_LABELS).map((type) => (
                <FilterButton
                  key={type}
                  active={filter === type}
                  onClick={() => setFilter(type)}
                >
                  {EVENT_TYPE_LABELS[type]}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Events List */}
          {events.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="h-16 w-16 text-gold/30 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gold mb-2">No Upcoming Events</h2>
              <p className="text-gray-400">Check back soon for new events!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const dateInfo = formatEventDate(event.event_date);
                return (
                  <div
                    key={event.id}
                    className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl overflow-hidden hover:border-gold/40 transition-colors"
                  >
                    <div className="flex">
                      {/* Date Column */}
                      <div className="w-24 bg-gold/10 flex flex-col items-center justify-center py-4 border-r border-gold/20">
                        <span className="text-gold text-sm">{dateInfo.day}</span>
                        <span className="text-3xl font-bold text-gold">{dateInfo.date}</span>
                        <span className="text-gold text-sm">{dateInfo.month}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${EVENT_TYPE_COLORS[event.event_type]}`}>
                              {EVENT_TYPE_LABELS[event.event_type]}
                            </span>
                            <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                            {event.description && (
                              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{event.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {dateInfo.time}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {event.rsvp_count} going
                                {event.max_capacity && ` / ${event.max_capacity}`}
                              </span>
                            </div>

                            {event.price > 0 && (
                              <p className="mt-2 text-gold font-semibold">
                                £{event.price.toFixed(2)}
                              </p>
                            )}
                          </div>

                          {/* RSVP Buttons */}
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleRsvp(event.id, 'going')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                                event.user_rsvp?.status === 'going'
                                  ? 'bg-gold text-black'
                                  : 'bg-gold/20 text-gold hover:bg-gold/30'
                              }`}
                            >
                              {event.user_rsvp?.status === 'going' && <Check className="h-4 w-4" />}
                              Going
                            </button>
                            <button
                              onClick={() => handleRsvp(event.id, 'maybe')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                event.user_rsvp?.status === 'maybe'
                                  ? 'bg-purple text-white'
                                  : 'bg-purple/20 text-purple-light hover:bg-purple/30'
                              }`}
                            >
                              Maybe
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FilterButton({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-gold text-black'
          : 'bg-card border border-gold/20 text-gray-400 hover:text-gold hover:border-gold/40'
      }`}
    >
      {children}
    </button>
  );
}
