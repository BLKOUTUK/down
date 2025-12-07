'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Crown, Users, Clock, FileText, Calendar, LogOut, BarChart3 } from 'lucide-react';

export default function AdminDashboardClient() {
  const { data: session } = useSession() || {};
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

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
                onClick={handleSignOut}
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
              value={analytics?.cohorts?.filter((c: any) => c.isActive)?.length ?? 0}
            />
            <StatCard
              icon={<BarChart3 className="h-8 w-8 text-gold" />}
              label="Total Cohorts"
              value={analytics?.cohorts?.length ?? 0}
            />
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
                      {cohort.isActive && (
                        <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-300">
                      {cohort.memberCount} members
                    </p>
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

function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
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

function ActionCard({
  title,
  description,
  href,
  icon,
  count
}: {
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
