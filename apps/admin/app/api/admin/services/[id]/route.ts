import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// GET /api/admin/services/[id] - Get single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/services/[id] - Update service
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const data = await request.json();
    const { translations, ...serviceData } = data;
    
    await prisma.service.update({
      where: { id },
      data: serviceData,
    });

    if (translations && Array.isArray(translations)) {
      for (const translation of translations) {
        await prisma.serviceTranslation.upsert({
          where: {
            serviceId_locale: {
              serviceId: id,
              locale: translation.locale,
            },
          },
          update: translation,
          create: {
            ...translation,
            serviceId: id,
          },
        });
      }
    }

    const updatedService = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(updatedService);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL adresi zaten kullanılıyor' }, { status: 400 });
    }
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/services/[id] - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
