import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

// GET /api/services - Get all published services (products) for the website
export async function GET(request: NextRequest) {
  // CRITICAL: Fail fast if admin API URL is not configured
  const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
  if (!ADMIN_API_URL) {
    console.error('[FATAL] NEXT_PUBLIC_ADMIN_API_URL is missing');
    return NextResponse.json(
      { error: 'Server misconfigured: ADMIN API URL missing' },
      { status: 500 }
    );
  }
  try {
    const fetchUrl = `${ADMIN_API_URL}/api/public/services`;
    console.log('[PROD-DIAG] Web → Admin fetch:', fetchUrl);
    
    // Fetch published services from admin public API
    const response = await fetch(fetchUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ADMIN API ERROR]', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch services from admin API' },
        { status: 500 }
      );
    }

    const publishedServices = await response.json();
    
    // Transform to website format
    const services = publishedServices.map((service: any) => {
      const trTranslation = service.translations?.find((t: any) => t.locale === 'tr');
      return {
        id: service.id,
        slug: service.slug,
        title: trTranslation?.title || service.slug,
        description: trTranslation?.description || '',
        excerpt: trTranslation?.excerpt || '',
        content: trTranslation?.content || '',
        seoTitle: trTranslation?.seoTitle || trTranslation?.title,
        seoDesc: trTranslation?.seoDesc || trTranslation?.description,
        featured: service.featured || false,
        publishedAt: service.publishedAt,
        updatedAt: service.updatedAt,
      };
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services from admin API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

