'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Plus, Loader2 } from 'lucide-react';

interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  _count?: { members: number };
}

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  });

  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      const res = await fetch('/api/admin/cohorts');
      const data = await res.json();
      setCohorts(data?.cohorts ?? []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to create cohort');

      setShowForm(false);
      setFormData({ name: '', startDate: '', endDate: '', isActive: false });
      await fetchCohorts();
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
              Cohort Management
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Cohort
            </button>
          </div>

          {/* Create Form */}
          {showForm && (
            <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-6">Create New Cohort</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cohort Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Cohort A"
                      className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-gray-300">Active Cohort</span>
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create Cohort
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

          {/* Cohorts List */}
          <div className="grid md:grid-cols-3 gap-6">
            {cohorts?.map((cohort) => (
              <div
                key={cohort.id}
                className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gold">{cohort.name}</h3>
                  {cohort.isActive && (
                    <span className="px-3 py-1 bg-gold/20 text-gold text-sm font-semibold rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-gray-300">
                  <div>
                    <p className="text-sm text-gray-500">Members</p>
                    <p className="text-2xl font-bold">{cohort._count?.members ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p>{new Date(cohort.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p>{new Date(cohort.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
