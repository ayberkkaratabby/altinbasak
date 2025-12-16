import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Public API endpoint for published pages
 * No authentication required - only returns published pages
 * Used by the website to fetch dynamic page content
 */
export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET(request: NextRequest) {
  try {
    // Public API - no authentication required
    // Fetch only published pages
    const pages = await prisma.page.findMany({
      where: {
        status: 'published',
      },
      include: {
        translations: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(pages);
  } catch (error: any) {
    console.error('Error fetching published pages:', error);
    // Return empty array on error (graceful degradation)
    // This allows the website to work even if database has issues
    return NextResponse.json([], { status: 200 });
  }
}

