'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ChevronLeft, Search, Trash2, Eye, Shield, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
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

    await fetchMembers();
    setLoading(false);
  };

  const fetchMembers = async () => {
    const { data } = await supabase
      .from('users')
      .select(`
        *,
        cohort:cohorts(name)
      `)
      .eq('application_status', 'APPROVED')
      .order('created_at', { ascending: false });

    setMembers(data || []);
  };

  const handleVerify = async (memberId: string) => {
    await supabase
      .from('users')
      .update({ is_verified: true, verified_at: new Date().toISOString() })
      .eq('id', memberId);
    fetchMembers();
    setSelectedMember(null);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    await supabase.from('users').delete().eq('id', memberId);
    fetchMembers();
    setSelectedMember(null);
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-xl font-bold text-gold">Members ({members.length})</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="w-full bg-card border border-gold/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Crown className="h-7 w-7 text-gold/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white truncate">{member.display_name || member.name}</h3>
                      {member.is_verified && <Shield className="h-4 w-4 text-gold" />}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {member.age && <span className="text-xs text-gold">{member.age} yo</span>}
                      {member.cohort && (
                        <span className="text-xs text-purple-light">{member.cohort.name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="flex-1 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  {!member.is_verified && (
                    <button
                      onClick={() => handleVerify(member.id)}
                      className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <Shield className="h-4 w-4" />
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-gold/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gold/20">
              <h2 className="text-2xl font-bold text-gold">Member Details</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                  {selectedMember.avatar_url ? (
                    <img src={selectedMember.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Crown className="h-10 w-10 text-gold/50" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{selectedMember.name}</h3>
                    {selectedMember.is_verified && <Shield className="h-5 w-5 text-gold" />}
                  </div>
                  <p className="text-gray-400">{selectedMember.email}</p>
                  {selectedMember.cohort && (
                    <p className="text-sm text-purple-light">{selectedMember.cohort.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-white">{selectedMember.age || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pronouns</p>
                  <p className="text-white">{selectedMember.pronouns || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gold">{selectedMember.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-white">
                    {selectedMember.member_since 
                      ? new Date(selectedMember.member_since).toLocaleDateString('en-GB')
                      : new Date(selectedMember.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>

              {selectedMember.bio && (
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-gray-300">{selectedMember.bio}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gold/20 flex gap-3">
              {!selectedMember.is_verified && (
                <button
                  onClick={() => handleVerify(selectedMember.id)}
                  className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                >
                  Verify Member
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedMember.id)}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove Member
              </button>
              <button
                onClick={() => setSelectedMember(null)}
                className="flex-1 py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
