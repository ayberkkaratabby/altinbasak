import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// GET /api/admin/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/projects/[id] - Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const data = await request.json();
    const { translations, ...projectData } = data;
    
    await prisma.project.update({
      where: { id },
      data: projectData,
    });

    if (translations && Array.isArray(translations)) {
      for (const translation of translations) {
        await prisma.projectTranslation.upsert({
          where: {
            projectId_locale: {
              projectId: id,
              locale: translation.locale,
            },
          },
          update: translation,
          create: {
            ...translation,
            projectId: id,
          },
        });
      }
    }

    const updatedProject = await prisma.project.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL adresi zaten kullanılıyor' }, { status: 400 });
    }
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
