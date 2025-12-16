import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

/**
 * Public API endpoint for a single published service by slug
 * No authentication required - only returns published services
 * Used by the website to fetch service/product content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Find published service by slug
    const service = await prisma.service.findFirst({
      where: {
        slug: slug,
        status: 'published',
      },
      include: {
        translations: true,
      },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: any) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

