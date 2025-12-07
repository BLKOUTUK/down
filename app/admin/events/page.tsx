'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ChevronLeft, Plus, Calendar, MapPin, Users, Trash2, Edit, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

const EVENT_TYPES = [
  { value: 'KICKOFF', label: 'Kick-Off Event' },
  { value: 'DATE_NIGHT', label: 'Date Night' },
  { value: 'GALA', label: 'Gala' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'SOCIAL', label: 'Social Event' },
  { value: 'WELLNESS', label: 'Wellness' },
  { value: 'CULTURAL', label: 'Cultural Outing' }
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'SOCIAL',
    event_date: '',
    location: '',
    address: '',
    max_capacity: '',
    price: '0'
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
    setLoading(false);
  };

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    const eventsWithRsvps = await Promise.all(
      (data || []).map(async (event) => {
        const { count } = await supabase
          .from('event_rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)
          .eq('status', 'going');
        return { ...event, rsvp_count: count || 0 };
      })
    );

    setEvents(eventsWithRsvps);
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) {
      alert('Please fill in title and date');
      return;
    }

    const { error } = await supabase
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
        is_public: true
      });

    if (error) {
      alert('Failed to create event');
      return;
    }

    setShowCreateModal(false);
    setNewEvent({
      title: '', description: '', event_type: 'SOCIAL',
      event_date: '', location: '', address: '', max_capacity: '', price: '0'
    });
    fetchEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    await supabase.from('events').delete().eq('id', eventId);
    fetchEvents();
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
          <h1 className="text-xl font-bold text-gold">Events</h1>
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
          {events.length === 0 ? (
            <div className="text-center py-20 bg-card/50 rounded-xl border border-gold/20">
              <Calendar className="h-16 w-16 text-gold/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gold mb-2">No Events Yet</h3>
              <p className="text-gray-400">Create your first community event.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full mb-2">
                        {EVENT_TYPES.find(t => t.value === event.event_type)?.label}
                      </span>
                      <h3 className="text-xl font-bold text-white">{event.title}</h3>
                      {event.description && (
                        <p className="text-gray-400 mt-1">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.event_date).toLocaleString('en-GB')}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.rsvp_count} RSVPs
                          {event.max_capacity && ` / ${event.max_capacity}`}
                        </span>
                      </div>
                      {event.price > 0 && (
                        <p className="mt-2 text-gold font-semibold">£{event.price.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
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
                    <option key={type.value} value={type.value}>{type.label}</option>
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
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(ev => ({ ...ev, location: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                  placeholder="Venue name"
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
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
