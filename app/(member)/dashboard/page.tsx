'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, Users, MessageCircle, Calendar, User, Heart, Clock, MapPin, Settings, LogOut, Bell, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import type { User as UserType, TimeWindowStatus } from '@/lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [windowStatus, setWindowStatus] = useState<TimeWindowStatus | null>(null);
  const [stats, setStats] = useState({ likes: 0, matches: 0, messages: 0 });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    checkTimeWindow();
  }, []);

  const checkAuth = async () => {
    const stored = localStorage.getItem('down_user');
    if (!stored) {
      router.push('/login');
      return;
    }

    const sessionUser = JSON.parse(stored);
    
    // Fetch full user data
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        cohort:cohorts(*),
        media(*)
      `)
      .eq('id', sessionUser.id)
      .single();

    if (error || !data) {
      localStorage.removeItem('down_user');
      router.push('/login');
      return;
    }

    if (data.application_status !== 'APPROVED' && data.role !== 'ADMIN') {
      router.push('/pending');
      return;
    }

    setUser(data);
    fetchStats(data.id);
    setLoading(false);
  };

  const fetchStats = async (userId: string) => {
    // Fetch likes received
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('liked_id', userId);

    // Fetch mutual likes (matches)
    const { data: myLikes } = await supabase
      .from('likes')
      .select('liked_id')
      .eq('user_id', userId);

    const likedIds = myLikes?.map(l => l.liked_id) || [];
    
    const { count: matchesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('liked_id', userId)
      .in('user_id', likedIds.length > 0 ? likedIds : ['']);

    // Fetch unread messages
    const { count: messagesCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .is('read_at', null);

    setStats({
      likes: likesCount || 0,
      matches: matchesCount || 0,
      messages: messagesCount || 0
    });
  };

  const checkTimeWindow = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    // Check for admin override
    const override = localStorage.getItem('down_window_override');

    // If override is set, use that
    if (override === 'force_open') {
      setWindowStatus({
        isWithinWindow: true,
        isOverridden: true
      });
      return;
    }

    if (override === 'force_closed') {
      const nextWindowStart = new Date(now);
      const daysUntilThursday = (4 - day + 7) % 7 || 7;
      if (day === 4 && hour < 16) {
        nextWindowStart.setHours(16, 0, 0, 0);
      } else {
        nextWindowStart.setDate(now.getDate() + daysUntilThursday);
        nextWindowStart.setHours(16, 0, 0, 0);
      }
      setWindowStatus({
        isWithinWindow: false,
        nextWindowStart,
        timeUntilNext: nextWindowStart.getTime() - now.getTime(),
        isOverridden: true
      });
      return;
    }

    // Thursday 4pm to Friday midnight
    const isWithinWindow =
      (day === 4 && hour >= 16) ||
      (day === 5 && hour < 24);

    let nextWindowStart: Date | undefined;
    let timeUntilNext: number | undefined;

    if (!isWithinWindow) {
      nextWindowStart = new Date(now);
      const daysUntilThursday = (4 - day + 7) % 7 || 7;

      if (day === 4 && hour < 16) {
        // Today is Thursday, window starts later today
        nextWindowStart.setHours(16, 0, 0, 0);
      } else {
        nextWindowStart.setDate(now.getDate() + daysUntilThursday);
        nextWindowStart.setHours(16, 0, 0, 0);
      }

      timeUntilNext = nextWindowStart.getTime() - now.getTime();
    }

    setWindowStatus({
      isWithinWindow,
      nextWindowStart,
      timeUntilNext
    });
  };

  const formatTimeUntil = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const handleLogout = () => {
    localStorage.removeItem('down_user');
    router.push('/');
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
      <header className="fixed top-10 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-gold" />
              <span className="text-2xl font-bold text-gold">DOWN</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink href="/dashboard" icon={<Crown />} label="Home" />
              <NavLink href="/browse" icon={<Users />} label="Browse" />
              <NavLink href="/messages" icon={<MessageCircle />} label="Messages" badge={stats.messages} />
              <NavLink href="/events" icon={<Calendar />} label="Events" />
              <NavLink href="/profile" icon={<User />} label="Profile" />
            </nav>

            <div className="flex items-center gap-2">
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 bg-purple/20 text-purple-light border border-purple/30 rounded-lg text-sm hover:bg-purple/30 transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gold transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-24 md:pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Time Window Banner */}
          {windowStatus && (
            <div className={`mb-6 p-4 rounded-xl border ${
              windowStatus.isWithinWindow
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-purple-dark/30 border-purple/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className={`h-6 w-6 ${windowStatus.isWithinWindow ? 'text-green-400' : 'text-purple-light'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${windowStatus.isWithinWindow ? 'text-green-400' : 'text-purple-light'}`}>
                        {windowStatus.isWithinWindow ? 'Access Window Open!' : 'Access Window Closed'}
                      </p>
                      {windowStatus.isOverridden && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Override
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {windowStatus.isWithinWindow
                        ? 'Connect with the community now'
                        : `Opens in ${formatTimeUntil(windowStatus.timeUntilNext!)}`}
                    </p>
                  </div>
                </div>
                {!windowStatus.isWithinWindow && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Next window</p>
                    <p className="text-sm text-gold">Thursday 4pm</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gold mb-2">
              Welcome back, {user?.display_name || user?.name}!
            </h1>
            <p className="text-gray-400">
              {user?.cohort ? `${user.cohort.name} • ` : ''}
              Member since {new Date(user?.created_at || '').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Heart />} label="Likes Received" value={stats.likes} color="text-pink-400" />
            <StatCard icon={<Users />} label="Matches" value={stats.matches} color="text-gold" />
            <StatCard icon={<MessageCircle />} label="New Messages" value={stats.messages} color="text-blue-400" />
            <StatCard icon={<Calendar />} label="Upcoming Events" value={3} color="text-purple-light" />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              href="/browse"
              icon={<Users className="h-10 w-10 text-gold" />}
              title="Browse Members"
              description="Discover and connect with community members nearby"
              disabled={!windowStatus?.isWithinWindow}
            />
            <ActionCard
              href="/messages"
              icon={<MessageCircle className="h-10 w-10 text-gold" />}
              title="Messages"
              description="Chat with your connections"
              badge={stats.messages}
              disabled={!windowStatus?.isWithinWindow}
            />
            <ActionCard
              href="/events"
              icon={<Calendar className="h-10 w-10 text-gold" />}
              title="Events"
              description="Discover community gatherings and date nights"
            />
            <ActionCard
              href="/profile"
              icon={<User className="h-10 w-10 text-gold" />}
              title="My Profile"
              description="Update your profile and photos"
            />
            <ActionCard
              href="/profile/settings"
              icon={<Settings className="h-10 w-10 text-gold" />}
              title="Settings"
              description="Manage your preferences and privacy"
            />
            <ActionCard
              href="/community"
              icon={<Crown className="h-10 w-10 text-gold" />}
              title="Community"
              description="Learn about DOWN and community guidelines"
            />
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gold/20 px-4 py-2">
        <div className="flex justify-around">
          <MobileNavLink href="/dashboard" icon={<Crown />} label="Home" />
          <MobileNavLink href="/browse" icon={<Users />} label="Browse" />
          <MobileNavLink href="/messages" icon={<MessageCircle />} label="Chat" badge={stats.messages} />
          <MobileNavLink href="/events" icon={<Calendar />} label="Events" />
          <MobileNavLink href="/profile" icon={<User />} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function NavLink({ href, icon, label, badge }: { href: string; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <Link
      href={href}
      className="relative px-3 py-2 text-gray-400 hover:text-gold transition-colors flex items-center gap-2"
    >
      {icon}
      <span className="text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
}

function MobileNavLink({ href, icon, label, badge }: { href: string; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <Link href={href} className="relative flex flex-col items-center gap-1 text-gray-400 hover:text-gold transition-colors p-2">
      {icon}
      <span className="text-xs">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-4">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

function ActionCard({ href, icon, title, description, badge, disabled }: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: number;
  disabled?: boolean;
}) {
  const content = (
    <div className={`relative bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6 transition-all ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10 cursor-pointer'
    }`}>
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-4 right-4 w-6 h-6 bg-gold text-black text-sm font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
      {disabled && (
        <p className="text-xs text-purple-light mt-2">Available during access window</p>
      )}
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
