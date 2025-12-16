import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import { createBreadcrumbSchema } from '@/lib/jsonld';
import { DynamicPageClient } from './DynamicPageClient';

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicPageProps) {
  const { slug } = await params;
  
  try {
    // Use web app's own API which calls admin panel's public API
    // In server components, we need absolute URL for fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/pages/${slug}`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const page = await response.json();
      
      if (page && page.title) {
        return createMetadata({
          title: page.seoTitle || page.title,
          description: page.seoDesc || page.description || page.excerpt || '',
          path: `/${slug}`,
        });
      }
    }
  } catch (error) {
    console.error('Error fetching page metadata:', error);
  }
  
  return {};
}

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  
  try {
    // Use web app's own API which calls admin panel's public API
    // In server components, we need absolute URL for fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/pages/${slug}`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const page = await response.json();
      
      if (page && page.title) {
        return <DynamicPageClient page={page} />;
      }
    }
  } catch (error) {
    console.error('Error fetching page:', error);
  }
  
  notFound();
}

