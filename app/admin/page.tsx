'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, Users, Clock, FileText, Calendar, LogOut, BarChart3, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

type WindowOverride = 'none' | 'force_open' | 'force_closed';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [windowOverride, setWindowOverride] = useState<WindowOverride>('none');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    // Load window override from localStorage
    const stored = localStorage.getItem('down_window_override');
    if (stored === 'force_open' || stored === 'force_closed') {
      setWindowOverride(stored);
    }
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

    setUser(data);
    await fetchAnalytics();
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    // Total members
    const { count: totalMembers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('application_status', 'APPROVED');

    // Pending applications
    const { count: pendingApplications } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('application_status', 'PENDING');

    // Cohorts
    const { data: cohorts } = await supabase
      .from('cohorts')
      .select('*');

    // Get member counts per cohort
    const cohortsWithCounts = await Promise.all(
      (cohorts || []).map(async (cohort) => {
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('cohort_id', cohort.id);
        return { ...cohort, member_count: count || 0 };
      })
    );

    setAnalytics({
      totalMembers: totalMembers || 0,
      pendingApplications: pendingApplications || 0,
      cohorts: cohortsWithCounts
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('down_user');
    router.push('/');
  };

  const handleWindowOverride = (override: WindowOverride) => {
    setWindowOverride(override);
    if (override === 'none') {
      localStorage.removeItem('down_window_override');
    } else {
      localStorage.setItem('down_window_override', override);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxe-gradient afro-pattern flex items-center justify-center">
        <div className="text-gold text-xl">Loading...</div>
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
                href="/admin/applications"
                className="px-4 py-2 text-gold hover:text-gold-light transition-colors flex items-center"
              >
                <FileText className="mr-2 h-5 w-5" />
                Applications
              </Link>
              <Link
                href="/admin/cohorts"
                className="px-4 py-2 text-gold hover:text-gold-light transition-colors flex items-center"
              >
                <Clock className="mr-2 h-5 w-5" />
                Cohorts
              </Link>
              <Link
                href="/admin/members"
                className="px-4 py-2 text-gold hover:text-gold-light transition-colors flex items-center"
              >
                <Users className="mr-2 h-5 w-5" />
                Members
              </Link>
              <Link
                href="/admin/events"
                className="px-4 py-2 text-gold hover:text-gold-light transition-colors flex items-center"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Events
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gold/20 text-gold hover:bg-gold/30 rounded-lg transition-colors flex items-center border border-gold/30"
              >
                <Users className="mr-2 h-5 w-5" />
                View as Member
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gold hover:text-gold-light transition-colors flex items-center"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gold mb-8">
            Admin Dashboard
          </h1>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={<Users className="h-8 w-8 text-gold" />}
              label="Total Members"
              value={analytics?.totalMembers ?? 0}
            />
            <StatCard
              icon={<FileText className="h-8 w-8 text-gold" />}
              label="Pending Applications"
              value={analytics?.pendingApplications ?? 0}
            />
            <StatCard
              icon={<Clock className="h-8 w-8 text-gold" />}
              label="Active Cohorts"
              value={analytics?.cohorts?.filter((c: any) => c.is_active)?.length ?? 0}
            />
            <StatCard
              icon={<BarChart3 className="h-8 w-8 text-gold" />}
              label="Total Cohorts"
              value={analytics?.cohorts?.length ?? 0}
            />
          </div>

          {/* Time Window Override (Testing) */}
          <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-6 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-bold text-gold">Time Window Override (Testing)</h2>
              {windowOverride !== 'none' && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Override Active
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Override the time window to test open/closed behavior. This affects the dashboard and browse pages.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleWindowOverride('none')}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  windowOverride === 'none'
                    ? 'bg-gold text-black border-gold font-bold'
                    : 'bg-transparent text-gray-300 border-gray-600 hover:border-gold/50'
                }`}
              >
                Normal (Thu 4pm - Fri midnight)
              </button>
              <button
                onClick={() => handleWindowOverride('force_open')}
                className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                  windowOverride === 'force_open'
                    ? 'bg-green-500 text-black border-green-500 font-bold'
                    : 'bg-transparent text-green-400 border-green-500/50 hover:bg-green-500/10'
                }`}
              >
                <ToggleRight className="h-4 w-4" />
                Force OPEN
              </button>
              <button
                onClick={() => handleWindowOverride('force_closed')}
                className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                  windowOverride === 'force_closed'
                    ? 'bg-red-500 text-black border-red-500 font-bold'
                    : 'bg-transparent text-red-400 border-red-500/50 hover:bg-red-500/10'
                }`}
              >
                <ToggleLeft className="h-4 w-4" />
                Force CLOSED
              </button>
            </div>
            {windowOverride !== 'none' && (
              <p className="text-xs text-yellow-400 mt-3">
                Override is stored in browser. Visit /dashboard to see the effect.
              </p>
            )}
          </div>

          {/* Cohort Stats */}
          {analytics?.cohorts && analytics.cohorts.length > 0 && (
            <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold text-gold mb-6">Cohort Overview</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {analytics.cohorts.map((cohort: any) => (
                  <div
                    key={cohort.name}
                    className="bg-background/50 rounded-lg p-4 border border-gold/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gold">{cohort.name}</h3>
                      {cohort.is_active && (
                        <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-300">
                      {cohort.member_count} / {cohort.max_members} members
                    </p>
                    <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gold-gradient"
                        style={{ width: `${(cohort.member_count / cohort.max_members) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <ActionCard
              title="Review Applications"
              description="Approve or reject pending membership applications"
              href="/admin/applications"
              icon={<FileText className="h-12 w-12 text-gold" />}
              count={analytics?.pendingApplications}
            />
            <ActionCard
              title="Manage Cohorts"
              description="View and manage rotating cohorts and member assignments"
              href="/admin/cohorts"
              icon={<Clock className="h-12 w-12 text-gold" />}
            />
            <ActionCard
              title="Manage Members"
              description="View all members, edit profiles, and manage access"
              href="/admin/members"
              icon={<Users className="h-12 w-12 text-gold" />}
            />
            <ActionCard
              title="Manage Events"
              description="Create and manage community events and galas"
              href="/admin/events"
              icon={<Calendar className="h-12 w-12 text-gold" />}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-3xl font-bold text-gold">{value}</span>
      </div>
      <p className="text-gray-300">{label}</p>
    </div>
  );
}

function ActionCard({ title, description, href, icon, count }: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-8 hover:border-gold/40 transition-all hover:shadow-xl hover:shadow-gold/10 group relative"
    >
      {count !== undefined && count > 0 && (
        <span className="absolute top-4 right-4 w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold">
          {count}
        </span>
      )}
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-2xl font-bold text-gold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </Link>
  );
}
