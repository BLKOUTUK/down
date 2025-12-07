import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import AdminDashboardClient from './admin-dashboard-client';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user as any;

  if (user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return <AdminDashboardClient />;
}
