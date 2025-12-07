import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalMembers, pendingApplications, cohorts] = await Promise.all([
      prisma.user.count({ where: { applicationStatus: 'APPROVED' } }),
      prisma.user.count({ where: { applicationStatus: 'PENDING' } }),
      prisma.cohort.findMany({
        include: {
          _count: { select: { members: true } }
        }
      })
    ]);

    const analytics = {
      totalMembers,
      pendingApplications,
      cohorts: cohorts.map(c => ({
        name: c.name,
        memberCount: c._count?.members ?? 0,
        isActive: c.isActive
      }))
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
