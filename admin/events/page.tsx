'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Plus, Loader2, Calendar } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location?: string;
  eventType: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    eventType: 'kick-off'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      setEvents(data?.events ?? []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to create event');

      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        eventDate: '',
        location: '',
        eventType: 'kick-off'
      });
      await fetchEvents();
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxe-gradient afro-pattern flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxe-gradient afro-pattern">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-gold" />
              <span className="text-2xl font-bold text-gold">DOWN Admin</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-gold hover:text-gold-light transition-colors"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gold/20 text-gold hover:bg-gold/30 rounded-lg transition-colors flex items-center border border-gold/30"
              >
                View as Member
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gold">
              Event Management
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </button>
          </div>

          {/* Create Form */}
          {showForm && (
            <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-6">Create New Event</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Wednesday Night Kick-off"
                    className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Join us for the weekly kick-off event..."
                    className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Type
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                    >
                      <option value="kick-off">Kick-off</option>
                      <option value="discussion">Discussion</option>
                      <option value="date-night">Date Night</option>
                      <option value="sex-party">Sex Party</option>
                      <option value="gala">Gala</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Date
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="London, UK"
                    className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-6">
            {events?.length === 0 ? (
              <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-12 text-center">
                <p className="text-2xl text-gray-300">
                  No events scheduled
                </p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="h-6 w-6 text-gold" />
                        <h3 className="text-2xl font-bold text-gold">{event.title}</h3>
                      </div>
                      <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-sm font-semibold rounded-full mb-3">
                        {event.eventType}
                      </span>
                      <p className="text-gray-300 mb-4">{event.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div>
                          <span className="font-semibold">Date:</span>{' '}
                          {new Date(event.eventDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div>
                          <span className="font-semibold">Time:</span>{' '}
                          {new Date(event.eventDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {event.location && (
                          <div>
                            <span className="font-semibold">Location:</span> {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
