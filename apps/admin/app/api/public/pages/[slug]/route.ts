import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Public API endpoint for a single published page by slug
 * No authentication required - only returns published pages
 */
export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Public API - no authentication required
    // Find published page by slug
    const page = await prisma.page.findFirst({
      where: {
        slug: slug,
        status: 'published',
      },
      include: {
        translations: true,
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error: any) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

