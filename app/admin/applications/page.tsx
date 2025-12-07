'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Check, X, Loader2 } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, cohortsRes] = await Promise.all([
        fetch('/api/admin/applications'),
        fetch('/api/admin/cohorts')
      ]);

      const [appsData, cohortsData] = await Promise.all([
        appsRes.json(),
        cohortsRes.json()
      ]);

      setApplications(appsData?.applications ?? []);
      setCohorts(cohortsData?.cohorts ?? []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplication = async (id: string, status: string, cohortId?: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, cohortId })
      });

      if (!res.ok) throw new Error('Failed to update application');

      await fetchData();
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setProcessing(null);
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
            <h1 className="text-4xl font-bold text-gold mb-2">
              Pending Applications
            </h1>
            <p className="text-xl text-gray-300">
              {applications?.length ?? 0} applications awaiting review
            </p>
          </div>

          {applications?.length === 0 ? (
            <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-12 text-center">
              <p className="text-2xl text-gray-300">
                No pending applications
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gold mb-2">
                        {app.name}, {app.age}
                      </h3>
                      <p className="text-gray-400 mb-4">{app.email}</p>
                      <p className="text-sm text-gray-500">
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Assign to Cohort:
                        </label>
                        <select
                          id={`cohort-${app.id}`}
                          className="px-4 py-2 bg-background/50 border border-gold/20 rounded-lg text-foreground"
                        >
                          <option value="">Select cohort...</option>
                          {cohorts?.map((cohort) => (
                            <option key={cohort.id} value={cohort.id}>
                              {cohort.name} ({cohort._count?.members ?? 0} members)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const select = document.getElementById(`cohort-${app.id}`) as HTMLSelectElement;
                            const cohortId = select?.value;
                            if (!cohortId) {
                              alert('Please select a cohort');
                              return;
                            }
                            handleApplication(app.id, 'APPROVED', cohortId);
                          }}
                          disabled={processing === app.id}
                          className="px-6 py-2 bg-gold-gradient text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
                        >
                          {processing === app.id ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-5 w-5" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleApplication(app.id, 'REJECTED')}
                          disabled={processing === app.id}
                          className="px-6 py-2 bg-destructive/20 border border-destructive text-destructive font-semibold rounded-lg hover:bg-destructive/30 transition-colors disabled:opacity-50 flex items-center"
                        >
                          <X className="mr-2 h-5 w-5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
