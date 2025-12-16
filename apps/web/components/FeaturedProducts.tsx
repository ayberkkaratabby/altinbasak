'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedProductsContent {
  heading?: string;
  description?: string;
  content?: {
    heading?: string;
    description?: string;
  };
}

interface FeaturedProductsProps {
  content?: FeaturedProductsContent | null;
}

export function FeaturedProducts({ content }: FeaturedProductsProps) {
  // Featured products will come from admin panel services or pages
  // For now, show empty state if no content
  const heading = content?.content?.heading || content?.heading || 'Öne Çıkanlar';
  const description = content?.content?.description || content?.description || 'Her biri özenle hazırlanmış, geleneksel lezzetler modern yaklaşımla';

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-4">
            {heading}
          </h2>
          <p className="text-lg md:text-xl text-black/60 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Products will be loaded from admin panel - placeholder for now */}
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center py-12 text-black/40"
            >
              <p className="text-sm">Ürünler admin panelinden eklenecek</p>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 text-black hover:text-black/60 transition-colors font-medium"
          >
            Tüm Ürünleri Gör
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

