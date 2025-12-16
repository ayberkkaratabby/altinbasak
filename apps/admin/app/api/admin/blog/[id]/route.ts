import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// GET /api/admin/blog/[id] - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/blog/[id] - Update blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const data = await request.json();
    const { translations, ...postData } = data;
    
    await prisma.blogPost.update({
      where: { id },
      data: postData,
    });

    if (translations && Array.isArray(translations)) {
      for (const translation of translations) {
        await prisma.blogPostTranslation.upsert({
          where: {
            blogPostId_locale: {
              blogPostId: id,
              locale: translation.locale,
            },
          },
          update: translation,
          create: {
            ...translation,
            blogPostId: id,
          },
        });
      }
    }

    const updatedPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL adresi zaten kullanılıyor' }, { status: 400 });
    }
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
