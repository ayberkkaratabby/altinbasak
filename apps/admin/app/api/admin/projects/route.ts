import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// GET /api/admin/projects - List all projects
export async function GET() {
  try {
    await requireAdminSession();
    
    const projects = await prisma.project.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    
    const data = await request.json();
    const { translations, ...projectData } = data;
    
    const project = await prisma.project.create({
      data: {
        ...projectData,
        translations: {
          create: translations || [],
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL adresi zaten kullanılıyor' }, { status: 400 });
    }
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
