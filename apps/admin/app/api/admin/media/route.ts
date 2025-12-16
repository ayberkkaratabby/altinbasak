import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import prisma from '@/lib/prisma';

// GET /api/admin/media - List all media
export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const folder = searchParams.get('folder');
    const search = searchParams.get('search');

    const where: any = {};
    if (type) where.type = type;
    if (folder) where.folder = folder;
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(media);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/media - Upload new media
export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // TODO: Implement actual file upload to storage (S3, Cloudinary, etc.)
    // For now, create a placeholder record
    const media = await prisma.media.create({
      data: {
        url: `/uploads/${file.name}`, // Placeholder URL
        filename: file.name,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        mimeType: file.type,
        size: file.size,
        alt: formData.get('alt') as string || null,
        caption: formData.get('caption') as string || null,
        tags: formData.get('tags') as string || null,
        folder: formData.get('folder') as string || null,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error uploading media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

