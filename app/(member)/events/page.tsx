'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Clock, Check, Loader2, List, Grid3X3 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import type { User, Event, EventRsvp } from '@/lib/types';

const EVENT_TYPE_LABELS: Record<string, string> = {
  KICKOFF: 'Kick-Off',
  DATE_NIGHT: 'Date Night',
  GALA: 'Gala',
  WORKSHOP: 'Workshop',
  SOCIAL: 'Social',
  WELLNESS: 'Wellness',
  CULTURAL: 'Cultural'
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  KICKOFF: 'bg-purple-500',
  DATE_NIGHT: 'bg-pink-500',
  GALA: 'bg-gold',
  WORKSHOP: 'bg-blue-500',
  SOCIAL: 'bg-green-500',
  WELLNESS: 'bg-teal-500',
  CULTURAL: 'bg-orange-500'
};

const EVENT_TYPE_EMOJIS: Record<string, string> = {
  KICKOFF: '🎉',
  DATE_NIGHT: '💕',
  GALA: '✨',
  WORKSHOP: '📚',
  SOCIAL: '🍸',
  WELLNESS: '🧘',
  CULTURAL: '🎭'
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function EventsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchEvents();
    }
  }, [currentUser, currentDate]);

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

    // Get events for the current month view (with buffer for adjacent months)
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);

    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', startOfMonth.toISOString())
      .lte('event_date', endOfMonth.toISOString())
      .order('event_date', { ascending: true });

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
      await supabase
        .from('event_rsvps')
        .update({ status })
        .eq('id', event.user_rsvp.id);
    } else {
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

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const days = [];

    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-black/20" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date(today.toDateString());

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 md:h-32 p-1 md:p-2 border border-gold/10 cursor-pointer transition-colors ${
            isToday ? 'bg-gold/10 border-gold/30' : 
            isSelected ? 'bg-purple/20 border-purple/30' :
            isPast ? 'bg-black/30 opacity-60' : 'bg-black/20 hover:bg-gold/5'
          }`}
        >
          <div className={`text-sm font-bold mb-1 ${
            isToday ? 'text-gold' : isPast ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {day}
          </div>
          <div className="space-y-1 overflow-hidden">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${
                  EVENT_TYPE_COLORS[event.event_type]
                } ${event.event_type === 'GALA' ? 'text-black' : 'text-white'}`}
              >
                {EVENT_TYPE_EMOJIS[event.event_type]} {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gold">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(e => new Date(e.event_date) >= today)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'calendar' ? 'bg-gold text-black' : 'text-gold hover:bg-gold/20'
              }`}
              title="Calendar View"
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-gold text-black' : 'text-gold hover:bg-gold/20'
              }`}
              title="List View"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {viewMode === 'calendar' ? (
            <>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevMonth}
                    className="p-2 text-gold hover:bg-gold/20 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <h2 className="text-2xl font-bold text-gold">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button
                    onClick={nextMonth}
                    className="p-2 text-gold hover:bg-gold/20 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
                <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors text-sm"
                >
                  Today
                </button>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-4">
                {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs">
                    <div className={`w-3 h-3 rounded ${EVENT_TYPE_COLORS[key]}`} />
                    <span className="text-gray-400">{EVENT_TYPE_EMOJIS[key]} {label}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-gold/10">
                  {DAYS.map(day => (
                    <div key={day} className="p-2 md:p-3 text-center text-sm font-bold text-gold border-b border-gold/20">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {renderCalendar()}
                </div>
              </div>

              {/* Selected Date Events */}
              {selectedDate && (
                <div className="mt-6 bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gold mb-4">
                    {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <p className="text-gray-400">No events on this day</p>
                  ) : (
                    <div className="space-y-3">
                      {getEventsForDate(selectedDate).map(event => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onRsvp={handleRsvp}
                          onViewDetails={() => setSelectedEvent(event)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Upcoming Events Sidebar */}
              <div className="mt-6 bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gold mb-4">📅 Coming Up</h3>
                {getUpcomingEvents().length === 0 ? (
                  <p className="text-gray-400">No upcoming events</p>
                ) : (
                  <div className="space-y-3">
                    {getUpcomingEvents().slice(0, 5).map(event => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="flex items-center gap-3 p-3 bg-background/30 rounded-lg cursor-pointer hover:bg-background/50 transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                          EVENT_TYPE_COLORS[event.event_type]
                        }`}>
                          {EVENT_TYPE_EMOJIS[event.event_type]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{event.title}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(event.event_date).toLocaleDateString('en-GB', { 
                              weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {event.user_rsvp?.status === 'going' && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Going</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* List View */
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gold mb-6">All Upcoming Events</h2>
              {getUpcomingEvents().length === 0 ? (
                <div className="text-center py-20 bg-card/50 rounded-xl border border-gold/20">
                  <Calendar className="h-16 w-16 text-gold/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gold mb-2">No Upcoming Events</h3>
                  <p className="text-gray-400">Check back soon for new events!</p>
                </div>
              ) : (
                getUpcomingEvents().map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRsvp={handleRsvp}
                    onViewDetails={() => setSelectedEvent(event)}
                    expanded
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-card border border-gold/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={`h-32 flex items-center justify-center text-6xl ${EVENT_TYPE_COLORS[selectedEvent.event_type]}`}>
              {EVENT_TYPE_EMOJIS[selectedEvent.event_type]}
            </div>
            <div className="p-6">
              <span className="inline-block px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full mb-2">
                {EVENT_TYPE_LABELS[selectedEvent.event_type]}
              </span>
              <h2 className="text-2xl font-bold text-gold mb-2">{selectedEvent.title}</h2>
              
              {selectedEvent.description && (
                <p className="text-gray-300 mb-4">{selectedEvent.description}</p>
              )}

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-5 w-5 text-gold" />
                  {new Date(selectedEvent.event_date).toLocaleDateString('en-GB', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-5 w-5 text-gold" />
                  {new Date(selectedEvent.event_date).toLocaleTimeString('en-GB', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="h-5 w-5 text-gold" />
                    {selectedEvent.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="h-5 w-5 text-gold" />
                  {selectedEvent.rsvp_count} going
                  {selectedEvent.max_capacity && ` / ${selectedEvent.max_capacity} spots`}
                </div>
              </div>

              {selectedEvent.price > 0 && (
                <p className="text-xl font-bold text-gold mb-4">£{selectedEvent.price.toFixed(2)}</p>
              )}

              {/* RSVP Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleRsvp(selectedEvent.id, 'going')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                    selectedEvent.user_rsvp?.status === 'going'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {selectedEvent.user_rsvp?.status === 'going' && <Check className="h-5 w-5" />}
                  Going
                </button>
                <button
                  onClick={() => handleRsvp(selectedEvent.id, 'maybe')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
                    selectedEvent.user_rsvp?.status === 'maybe'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  }`}
                >
                  Maybe
                </button>
                <button
                  onClick={() => handleRsvp(selectedEvent.id, 'not_going')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
                    selectedEvent.user_rsvp?.status === 'not_going'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  Can't Go
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-4 border-t border-gold/20 text-gold hover:bg-gold/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onRsvp, onViewDetails, expanded = false }: {
  event: Event;
  onRsvp: (eventId: string, status: 'going' | 'maybe' | 'not_going') => void;
  onViewDetails: () => void;
  expanded?: boolean;
}) {
  return (
    <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl overflow-hidden">
      <div className="flex">
        {/* Date Column */}
        <div className={`w-20 flex flex-col items-center justify-center py-4 border-r border-gold/20 ${EVENT_TYPE_COLORS[event.event_type]} ${event.event_type === 'GALA' ? 'text-black' : 'text-white'}`}>
          <span className="text-2xl">{EVENT_TYPE_EMOJIS[event.event_type]}</span>
          <span className="text-lg font-bold">{new Date(event.event_date).getDate()}</span>
          <span className="text-xs">{new Date(event.event_date).toLocaleDateString('en-GB', { month: 'short' })}</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-white">{event.title}</h3>
              {expanded && event.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{event.description}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(event.event_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                )}
                <span className="flex items-center gap-1 text-gold">
                  <Users className="h-3 w-3" />
                  {event.rsvp_count} going
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onRsvp(event.id, 'going')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  event.user_rsvp?.status === 'going'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                {event.user_rsvp?.status === 'going' && <Check className="h-4 w-4" />}
                Going
              </button>
              <button
                onClick={onViewDetails}
                className="px-3 py-1.5 bg-gold/20 text-gold rounded-lg text-sm hover:bg-gold/30 transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
