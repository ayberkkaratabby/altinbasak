import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// GET /api/admin/services - List all services
export async function GET() {
  try {
    await requireAdminSession();
    
    const services = await prisma.service.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(services);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/services - Create new service
export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    
    const data = await request.json();
    const { translations, ...serviceData } = data;
    
    const service = await prisma.service.create({
      data: {
        ...serviceData,
        translations: {
          create: translations || [],
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL adresi zaten kullanılıyor' }, { status: 400 });
    }
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
