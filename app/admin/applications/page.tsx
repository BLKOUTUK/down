'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ChevronLeft, Check, X, Eye, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
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

    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    // Fetch pending applications
    const { data: apps } = await supabase
      .from('users')
      .select('*')
      .eq('application_status', 'PENDING')
      .order('created_at', { ascending: true });

    // Fetch active cohorts
    const { data: cohortsData } = await supabase
      .from('cohorts')
      .select('*')
      .eq('is_active', true);

    setApplications(apps || []);
    setCohorts(cohortsData || []);
  };

  const handleApprove = async (userId: string, cohortId: string) => {
    await supabase
      .from('users')
      .update({
        application_status: 'APPROVED',
        cohort_id: cohortId,
        member_since: new Date().toISOString()
      })
      .eq('id', userId);

    setSelectedApp(null);
    fetchData();
  };

  const handleReject = async (userId: string) => {
    await supabase
      .from('users')
      .update({ application_status: 'REJECTED' })
      .eq('id', userId);

    setSelectedApp(null);
    fetchData();
  };

  const handleWaitlist = async (userId: string) => {
    await supabase
      .from('users')
      .update({ application_status: 'WAITLISTED' })
      .eq('id', userId);

    setSelectedApp(null);
    fetchData();
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
          <Link href="/admin" className="flex items-center gap-2 text-gold">
            <ChevronLeft className="h-5 w-5" />
            <Crown className="h-6 w-6" />
            <span className="font-bold">Admin</span>
          </Link>
          <h1 className="text-xl font-bold text-gold">Applications</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gold">
              Pending Applications ({applications.length})
            </h2>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-20 bg-card/50 rounded-xl border border-gold/20">
              <Check className="h-16 w-16 text-green-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gold mb-2">All Caught Up!</h3>
              <p className="text-gray-400">No pending applications to review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                        {app.avatar_url ? (
                          <img src={app.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Crown className="h-8 w-8 text-gold/50" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{app.name}</h3>
                        <p className="text-gray-400">{app.email}</p>
                        <p className="text-sm text-gray-500">
                          Applied {new Date(app.created_at).toLocaleDateString('en-GB')}
                        </p>
                        {app.age && <p className="text-sm text-gold">Age: {app.age}</p>}
                        {app.referred_by && (
                          <p className="text-sm text-purple-light">Referred by: {app.referred_by}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Review
                      </button>
                    </div>
                  </div>

                  {app.application_note && (
                    <div className="mt-4 p-3 bg-background/30 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Application Note:</p>
                      <p className="text-gray-300">{app.application_note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-gold/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gold/20">
              <h2 className="text-2xl font-bold text-gold">Review Application</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                  {selectedApp.avatar_url ? (
                    <img src={selectedApp.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Crown className="h-10 w-10 text-gold/50" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedApp.name}</h3>
                  <p className="text-gray-400">{selectedApp.email}</p>
                  {selectedApp.age && <p className="text-gold">Age: {selectedApp.age}</p>}
                </div>
              </div>

              {selectedApp.headline && (
                <div>
                  <p className="text-sm text-gray-500">Headline</p>
                  <p className="text-white">{selectedApp.headline}</p>
                </div>
              )}

              {selectedApp.bio && (
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-gray-300">{selectedApp.bio}</p>
                </div>
              )}

              {selectedApp.referred_by && (
                <div>
                  <p className="text-sm text-gray-500">Referred By</p>
                  <p className="text-purple-light">{selectedApp.referred_by}</p>
                </div>
              )}

              {selectedApp.application_note && (
                <div>
                  <p className="text-sm text-gray-500">Why they want to join</p>
                  <p className="text-gray-300">{selectedApp.application_note}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">Assign to Cohort</p>
                <select
                  id="cohort-select"
                  className="w-full bg-background border border-gold/20 rounded-lg px-4 py-3 text-white"
                  defaultValue={cohorts[0]?.id || ''}
                >
                  {cohorts.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gold/20 flex gap-3">
              <button
                onClick={() => {
                  const select = document.getElementById('cohort-select') as HTMLSelectElement;
                  handleApprove(selectedApp.id, select.value);
                }}
                className="flex-1 px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="h-5 w-5" />
                Approve
              </button>
              <button
                onClick={() => handleWaitlist(selectedApp.id)}
                className="flex-1 px-4 py-3 bg-purple text-white font-bold rounded-lg hover:bg-purple-dark transition-colors"
              >
                Waitlist
              </button>
              <button
                onClick={() => handleReject(selectedApp.id)}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                Reject
              </button>
            </div>

            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
