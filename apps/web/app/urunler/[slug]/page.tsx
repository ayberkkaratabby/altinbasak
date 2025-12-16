import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import { ProductPageClient } from './ProductPageClient';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/services/${slug}`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const product = await response.json();
      return createMetadata({
        title: product.seoTitle || product.title,
        description: product.seoDesc || product.description || product.excerpt || '',
        path: `/urunler/${slug}`,
      });
    }
  } catch (error) {
    console.error('Error fetching product metadata:', error);
  }
  
  return {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/services/${slug}`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const product = await response.json();
      return <ProductPageClient product={product} />;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }
  
  notFound();
}
