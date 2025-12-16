'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProductGallery } from '@/components/ProductGallery';
import { createBreadcrumbSchema } from '@/lib/jsonld';

interface Product {
  id: string;
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  content?: string;
  featured?: boolean;
}

interface ProductPageClientProps {
  product: Product;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Ürünler', url: '/urunler' },
    { name: product.title, url: `/urunler/${product.slug}` },
  ]);

  // Generate gallery images
  const galleryImages = [
    `https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80&auto=format&fit=crop`,
    `https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80&auto=format&fit=crop`,
    `https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80&auto=format&fit=crop`,
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section with Image */}
        <section className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={galleryImages[0]}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </motion.div>
          
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-white">
                  {product.title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                  {product.excerpt || product.description || ''}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-sm"
              style={{ color: 'var(--theme-text-muted)' }}
              aria-label="Breadcrumb"
            >
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:opacity-70 transition-opacity">
                    Ana Sayfa
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/urunler" className="hover:opacity-70 transition-opacity">
                    Ürünler
                  </Link>
                </li>
                <li>/</li>
                <li className="opacity-60">{product.title}</li>
              </ol>
            </motion.nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
              {/* Left Column - Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <ProductGallery images={galleryImages} productName={product.title} />
              </motion.div>

              {/* Right Column - Details */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-8"
              >
                {/* Description */}
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal mb-4">
                    Hakkında
                  </h2>
                  {product.content ? (
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.content }}
                      style={{ color: 'var(--theme-text-muted)' }}
                    />
                  ) : (
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                      {product.description || product.excerpt || ''}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-6"
                >
                  <Link
                    href="/subeler"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-medium transition-all duration-300 group"
                    style={{
                      backgroundColor: 'var(--theme-primary)',
                      color: 'var(--theme-background)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>Şubede Keşfet</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
