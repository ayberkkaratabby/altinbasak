'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface StoryContent {
  heading?: string;
  paragraph1?: string;
  paragraph2?: string;
  content?: {
    heading?: string;
    paragraph1?: string;
    paragraph2?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

interface StorySectionProps {
  content?: StoryContent | null;
}

export function StorySection({ content }: StorySectionProps) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <Image
          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80"
          alt="Patisserie Story"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-white">
              {content?.content?.heading || content?.heading || 'Hikayemiz'}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              {content?.content?.paragraph1 || content?.paragraph1 || 'Tekirdağ\'da başlayan yolculuğumuz, geleneksel lezzetleri modern bir yaklaşımla buluşturarak dünyaya açıldı. Her ürünümüz, ustalık ve tutkuyla hazırlanır.'}
            </p>
            <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed">
              {content?.content?.paragraph2 || content?.paragraph2 || 'Yılların birikimi ve sürekli yenilik arayışımız, bizi bugünkü konumumuza getirdi. Müşterilerimize en iyi deneyimi sunmak için çalışmaya devam ediyoruz.'}
            </p>
            <Link
              href={content?.content?.ctaLink || '/hikayemiz'}
              className="inline-flex items-center gap-2 px-8 py-4 transition-all duration-300 text-sm font-medium group"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.95';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {content?.content?.ctaText || 'Hikayemizi Keşfet'}
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

