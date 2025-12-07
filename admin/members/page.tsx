'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Loader2, Search, Edit2, Trash2, UserPlus, X, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Member {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  cohortId: string | null;
  cohort?: { id: string; name: string };
  isVisitor: boolean;
  visitorPassExpiry: string | null;
  createdAt: string;
}

interface Cohort {
  id: string;
  name: string;
  isActive: boolean;
}

interface EditFormData {
  name: string;
  email: string;
  age: number;
  cohortId: string;
  isVisitor: boolean;
  visitorPassExpiry: string;
}

export default function MembersPage() {
  const { data: session } = useSession() || {};
  const [members, setMembers] = useState<Member[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({
    name: '',
    email: '',
    age: 18,
    cohortId: '',
    isVisitor: false,
    visitorPassExpiry: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchCohorts();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredMembers(members);
      return;
    }

    const filtered = members?.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/members');
      const data = await res.json();
      setMembers(data?.members ?? []);
      setFilteredMembers(data?.members ?? []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCohorts = async () => {
    try {
      const res = await fetch('/api/admin/cohorts');
      const data = await res.json();
      setCohorts(data?.cohorts ?? []);
    } catch (error) {
      console.error('Cohorts fetch error:', error);
    }
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      email: member.email,
      age: member.age,
      cohortId: member.cohortId || '',
      isVisitor: member.isVisitor,
      visitorPassExpiry: member.visitorPassExpiry 
        ? new Date(member.visitorPassExpiry).toISOString().split('T')[0]
        : ''
    });
  };

  const closeEditDialog = () => {
    setEditingMember(null);
    setEditForm({
      name: '',
      email: '',
      age: 18,
      cohortId: '',
      isVisitor: false,
      visitorPassExpiry: ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;
    
    setSaving(true);
    try {
      const updateData: any = {
        name: editForm.name,
        email: editForm.email,
        age: parseInt(String(editForm.age)),
        cohortId: editForm.cohortId || null,
        isVisitor: editForm.isVisitor
      };

      if (editForm.isVisitor && editForm.visitorPassExpiry) {
        updateData.visitorPassExpiry = new Date(editForm.visitorPassExpiry).toISOString();
      } else {
        updateData.visitorPassExpiry = null;
      }

      const res = await fetch(`/api/admin/members/${editingMember.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        await fetchMembers();
        closeEditDialog();
        
        // If admin updated their own cohort, refresh the page to update session
        if (editingMember.id === (session?.user as any)?.id) {
          window.location.reload();
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update member');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update member');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchMembers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete member');
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gold mb-6">
              Member Management
            </h1>
            
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
              />
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background/50 border-b border-gold/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Age</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Cohort</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gold">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredMembers?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                        No members found
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-background/30 transition-colors">
                        <td className="px-6 py-4 text-foreground font-medium">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 text-gray-400">{member.email}</td>
                        <td className="px-6 py-4 text-gray-400">{member.age}</td>
                        <td className="px-6 py-4">
                          {member.role === 'ADMIN' ? (
                            <span className="px-3 py-1 bg-purple/20 text-purple text-sm rounded-full">
                              Admin
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full">
                              User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {member.cohort ? (
                            <span className="px-3 py-1 bg-gold/20 text-gold text-sm rounded-full">
                              {member.cohort.name}
                            </span>
                          ) : (
                            <span className="text-gray-500">No Cohort</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {member.isVisitor ? (
                            <span className="px-3 py-1 bg-purple/20 text-purple text-sm rounded-full">
                              Visitor
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full">
                              Member
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center space-x-2">
                            <button
                              onClick={() => openEditDialog(member)}
                              className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
                              title="Edit member"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id)}
                              className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Delete member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-2">Total Members</p>
              <p className="text-3xl font-bold text-gold">{members?.length ?? 0}</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-2">Regular Members</p>
              <p className="text-3xl font-bold text-gold">
                {members?.filter(m => !m.isVisitor)?.length ?? 0}
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-2">Visitors</p>
              <p className="text-3xl font-bold text-gold">
                {members?.filter(m => m.isVisitor)?.length ?? 0}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-gold/20 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gold/20">
              <h2 className="text-2xl font-bold text-gold">Edit Member</h2>
              <button
                onClick={closeEditDialog}
                className="p-2 hover:bg-gold/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  min="18"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || 18 })}
                  className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                />
              </div>

              {/* Cohort */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cohort
                </label>
                <select
                  value={editForm.cohortId}
                  onChange={(e) => setEditForm({ ...editForm, cohortId: e.target.value })}
                  className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                >
                  <option value="">No Cohort</option>
                  {cohorts.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name} {cohort.isActive ? '(Active)' : '(Inactive)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visitor Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isVisitor"
                  checked={editForm.isVisitor}
                  onChange={(e) => setEditForm({ ...editForm, isVisitor: e.target.checked })}
                  className="h-5 w-5 rounded border-gold/20 bg-background/50 text-gold focus:ring-2 focus:ring-gold"
                />
                <label htmlFor="isVisitor" className="text-sm font-medium text-gray-300">
                  Visitor Pass (temporary access)
                </label>
              </div>

              {/* Visitor Pass Expiry */}
              {editForm.isVisitor && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Visitor Pass Expiry
                  </label>
                  <input
                    type="date"
                    value={editForm.visitorPassExpiry}
                    onChange={(e) => setEditForm({ ...editForm, visitorPassExpiry: e.target.value })}
                    className="w-full px-4 py-3 bg-background/50 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-foreground"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center space-x-4 p-6 border-t border-gold/20">
              <button
                onClick={closeEditDialog}
                disabled={saving}
                className="px-6 py-3 bg-background/50 border border-gold/20 text-gray-300 rounded-lg hover:bg-background/70 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-6 py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
