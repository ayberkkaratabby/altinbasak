import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

// GET /api/services/[slug] - Get single published service by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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
    const { slug } = await params;
    const fetchUrl = `${ADMIN_API_URL}/api/public/services/${slug}`;
    console.log('[PROD-DIAG] Web → Admin fetch:', fetchUrl);
    
    // Fetch service from admin public API
    const response = await fetch(fetchUrl, {
      cache: 'no-store',
    });

    if (response.status === 404) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ADMIN API ERROR]', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch service from admin API' },
        { status: 500 }
      );
    }

    const service = await response.json();
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Transform to website format
    const trTranslation = service.translations?.find((t: any) => t.locale === 'tr');
    const serviceData = {
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

    return NextResponse.json(serviceData);
  } catch (error) {
    console.error('Error fetching service from admin API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

