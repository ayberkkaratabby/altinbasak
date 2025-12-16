import { notFound } from 'next/navigation';
import { ProductsPageClient } from './ProductsPageClient';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

async function getProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/services`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  
  return [];
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return <ProductsPageClient products={products} />;
}
