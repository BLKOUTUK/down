'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ChevronLeft, Plus, Calendar, Users, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCohort, setNewCohort] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    max_members: 500
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

    await fetchCohorts();
    setLoading(false);
  };

  const fetchCohorts = async () => {
    const { data } = await supabase
      .from('cohorts')
      .select('*')
      .order('start_date', { ascending: true });

    const cohortsWithCounts = await Promise.all(
      (data || []).map(async (cohort) => {
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('cohort_id', cohort.id);
        return { ...cohort, member_count: count || 0 };
      })
    );

    setCohorts(cohortsWithCounts);
  };

  const handleCreateCohort = async () => {
    if (!newCohort.name || !newCohort.start_date || !newCohort.end_date) {
      alert('Please fill in all required fields');
      return;
    }

    const { error } = await supabase
      .from('cohorts')
      .insert({
        name: newCohort.name,
        description: newCohort.description,
        start_date: newCohort.start_date,
        end_date: newCohort.end_date,
        max_members: newCohort.max_members,
        status: 'UPCOMING',
        is_active: false
      });

    if (error) {
      alert('Failed to create cohort');
      return;
    }

    setShowCreateModal(false);
    setNewCohort({ name: '', description: '', start_date: '', end_date: '', max_members: 500 });
    fetchCohorts();
  };

  const toggleCohortActive = async (cohortId: string, isActive: boolean) => {
    await supabase
      .from('cohorts')
      .update({ is_active: !isActive, status: !isActive ? 'ACTIVE' : 'FALLOW' })
      .eq('id', cohortId);
    fetchCohorts();
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
          <h1 className="text-xl font-bold text-gold">Cohorts</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold-gradient text-black font-semibold rounded-lg"
          >
            <Plus className="h-4 w-4" />
            New Cohort
          </button>
        </div>
      </header>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cohorts.map((cohort) => (
              <div
                key={cohort.id}
                className={`bg-card/80 backdrop-blur-sm border rounded-xl p-6 ${
                  cohort.is_active ? 'border-gold/50' : 'border-gold/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gold">{cohort.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cohort.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                    cohort.status === 'FALLOW' ? 'bg-purple/20 text-purple-light' :
                    'bg-gold/20 text-gold'
                  }`}>
                    {cohort.status}
                  </span>
                </div>

                {cohort.description && (
                  <p className="text-gray-400 text-sm mb-4">{cohort.description}</p>
                )}

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-4 w-4 text-gold" />
                    {new Date(cohort.start_date).toLocaleDateString('en-GB')} - {new Date(cohort.end_date).toLocaleDateString('en-GB')}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="h-4 w-4 text-gold" />
                    {cohort.member_count} / {cohort.max_members} members
                  </div>
                </div>

                <div className="h-2 bg-background rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gold-gradient"
                    style={{ width: `${(cohort.member_count / cohort.max_members) * 100}%` }}
                  />
                </div>

                <button
                  onClick={() => toggleCohortActive(cohort.id, cohort.is_active)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    cohort.is_active
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {cohort.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-gold/20 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gold mb-6">Create New Cohort</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <input
                  type="text"
                  value={newCohort.name}
                  onChange={(e) => setNewCohort(c => ({ ...c, name: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g. Cohort Delta"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={newCohort.description}
                  onChange={(e) => setNewCohort(c => ({ ...c, description: e.target.value }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white h-20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={newCohort.start_date}
                    onChange={(e) => setNewCohort(c => ({ ...c, start_date: e.target.value }))}
                    className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={newCohort.end_date}
                    onChange={(e) => setNewCohort(c => ({ ...c, end_date: e.target.value }))}
                    className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Members</label>
                <input
                  type="number"
                  value={newCohort.max_members}
                  onChange={(e) => setNewCohort(c => ({ ...c, max_members: parseInt(e.target.value) }))}
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-2 text-white"
                />
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
                onClick={handleCreateCohort}
                className="flex-1 py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90"
              >
                Create Cohort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
