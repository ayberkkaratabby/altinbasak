import { MetadataRoute } from 'next';

/**
 * Robots.txt for admin app
 * 
 * Disallows all crawlers from indexing admin pages.
 * Admin panel should never appear in search results.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}

