'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { createBreadcrumbSchema } from '@/lib/jsonld';
import Link from 'next/link';

interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  content?: string;
  seoTitle?: string;
  seoDesc?: string;
  publishedAt?: string;
  updatedAt?: string;
}

interface DynamicPageClientProps {
  page: Page;
}

export function DynamicPageClient({ page }: DynamicPageClientProps) {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: page.title, url: `/${page.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="border-b py-16 md:py-24" style={{ borderColor: 'var(--theme-primary)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
                {page.title}
              </h1>
              {page.description && (
                <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                  {page.description}
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
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
                <li className="opacity-60">{page.title}</li>
              </ol>
            </motion.nav>

            {/* Page Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content || page.excerpt || '' }}
              style={{
                color: 'var(--theme-text)',
              }}
            />
          </div>
        </section>
      </div>
    </>
  );
}

