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

    const members = await prisma.user.findMany({
      where: { applicationStatus: 'APPROVED' },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        role: true,
        cohortId: true,
        cohort: {
          select: {
            id: true,
            name: true
          }
        },
        isVisitor: true,
        visitorPassExpiry: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Members fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
