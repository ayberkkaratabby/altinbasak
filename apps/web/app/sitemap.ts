import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patisserie.com';
// CRITICAL: For sitemap, log error but do NOT crash build
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
if (!ADMIN_API_URL) {
  console.error('[FATAL] NEXT_PUBLIC_ADMIN_API_URL is missing - sitemap will only include static routes');
}

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Only fetch from admin API if URL is configured
  if (ADMIN_API_URL) {
    try {
      const fetchUrl = `${ADMIN_API_URL}/api/public/pages`;
      console.log('[PROD-DIAG] Web → Admin fetch:', fetchUrl);
      
      // Fetch published pages from admin panel
      const response = await fetch(fetchUrl, {
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ADMIN API ERROR]', response.status, errorText);
        // Continue with static routes only
      } else {
        const pages = await response.json();
        
        // Add published pages to sitemap (excluding homepage sections)
        const publishedPages = pages.filter((page: any) => 
          page.status === 'published' && 
          !page.slug.startsWith('home-')
        );

        publishedPages.forEach((page: any) => {
          routes.push({
            url: `${baseUrl}/${page.slug}`,
            lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
            changeFrequency: 'monthly',
            priority: page.featured ? 0.9 : 0.7,
          });
        });
      }
    } catch (error) {
      console.error('Error fetching pages for sitemap:', error);
      // Continue with static routes if admin API fails
    }
  }

  // Add static routes that should always be in sitemap
  const staticRoutes = [
    {
      url: `${baseUrl}/hikayemiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/urunler`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subeler`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return [...routes, ...staticRoutes];
}

