import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

/**
 * Public API endpoint for published services
 * No authentication required - only returns published services
 * Used by the website to fetch service/product content
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch only published services
    const services = await prisma.service.findMany({
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

    return NextResponse.json(services);
  } catch (error: any) {
    console.error('Error fetching published services:', error);
    // Return empty array on error (graceful degradation)
    return NextResponse.json([], { status: 200 });
  }
}

