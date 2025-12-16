import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

// GET /api/homepage - Get homepage content sections
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
    const fetchUrl = `${ADMIN_API_URL}/api/public/pages`;
    console.log('[PROD-DIAG] Web → Admin fetch:', fetchUrl);
    
    // Fetch homepage sections from admin public API
    const response = await fetch(fetchUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ADMIN API ERROR]', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch homepage content from admin API' },
        { status: 500 }
      );
    }

    const pages = await response.json();
    
    // Find homepage sections
    const heroPage = pages.find((p: any) => p.slug === 'home-hero' && p.status === 'published');
    const featuredProductsPage = pages.find((p: any) => p.slug === 'home-featured-products' && p.status === 'published');
    const storyPage = pages.find((p: any) => p.slug === 'home-story' && p.status === 'published');
    
    const trHero = heroPage?.translations?.find((t: any) => t.locale === 'tr');
    const trFeatured = featuredProductsPage?.translations?.find((t: any) => t.locale === 'tr');
    const trStory = storyPage?.translations?.find((t: any) => t.locale === 'tr');
    
    // Helper function to safely parse JSON content
    const parseContent = (content: string | null | undefined) => {
      if (!content) return null;
      try {
        return JSON.parse(content);
      } catch {
        // If not JSON, return as is (might be HTML)
        return null;
      }
    };

    return NextResponse.json({
      hero: trHero ? {
        title: trHero.title,
        subtitle: trHero.description,
        description: trHero.excerpt,
        content: parseContent(trHero.content),
      } : null,
      featuredProducts: trFeatured ? {
        heading: trFeatured.title,
        description: trFeatured.description,
        content: parseContent(trFeatured.content),
      } : null,
      story: trStory ? {
        heading: trStory.title,
        paragraph1: trStory.description,
        paragraph2: trStory.excerpt,
        content: parseContent(trStory.content),
      } : null,
    });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

