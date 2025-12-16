import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// GET /api/admin/blog - List all blog posts
export async function GET() {
  try {
    await requireAdminSession();
    
    const posts = await prisma.blogPost.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    
    const data = await request.json();
    const { translations, ...postData } = data;
    
    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        translations: {
          create: translations || [],
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL adresi zaten kullanılıyor' }, { status: 400 });
    }
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
