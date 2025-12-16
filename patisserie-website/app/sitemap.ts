import { MetadataRoute } from 'next';
import { branches } from '@/content/branches';
import { products } from '@/content/products';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patisserie.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
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

  // Add product pages
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/urunler/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add branch pages
  const branchRoutes = branches.map((branch) => ({
    url: `${baseUrl}/subeler/${branch.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...productRoutes, ...branchRoutes];
}

