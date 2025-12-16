import Link from 'next/link';
import { createMetadata } from '@/lib/metadata';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { StorySection } from '@/components/StorySection';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export const metadata = createMetadata({
  title: 'Ana Sayfa',
  description: 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi. Geleneksel lezzetler, modern yaklaşım.',
  path: '/',
});

async function getHomepageContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/homepage`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching homepage content:', error);
  }
  
  return { hero: null, featuredProducts: null, story: null };
}

export default async function Home() {
  const homepageContent = await getHomepageContent();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection content={homepageContent.hero} />

      {/* Featured Products */}
      <FeaturedProducts content={homepageContent.featuredProducts} />

      {/* Story Section */}
      <StorySection content={homepageContent.story} />
    </div>
  );
}
