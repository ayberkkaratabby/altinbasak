'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  content?: {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaPrimary?: { text?: string; link?: string };
    ctaSecondary?: { text?: string; link?: string };
  };
}

interface HeroSectionProps {
  content?: HeroContent | null;
}

export function HeroSection({ content }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80)',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-xl"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-normal mb-6 text-white leading-tight"
          >
            {content?.content?.title || content?.title || 'Lezzetin Zarif Hikayesi'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            {content?.content?.subtitle || content?.subtitle || content?.description || 'Tekirdağ\'dan dünyaya açılan lüks patisserie deneyimi.'}
            <br />
            <span className="text-white/70">
              {content?.content?.description || content?.description || 'Geleneksel lezzetler, modern yaklaşım.'}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {content?.content?.ctaPrimary && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={content.content.ctaPrimary.link || '/urunler'}
                  className="group relative inline-block px-8 py-4 transition-all duration-300 text-sm font-medium overflow-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                  <span 
                    className="relative z-10 block transition-colors"
                    style={{
                      color: 'var(--color-text)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-background)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text)';
                    }}
                  >
                    {content.content.ctaPrimary.text || 'Ürünleri Keşfet'}
                  </span>
                </Link>
              </motion.div>
            )}
            {content?.content?.ctaSecondary && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={content.content.ctaSecondary.link || '/subeler'}
                  className="inline-block px-8 py-4 border-2 transition-all duration-300 text-sm font-medium"
                  style={{
                    borderColor: 'var(--color-background)',
                    color: 'var(--color-background)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background)';
                    e.currentTarget.style.color = 'var(--color-text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-background)';
                  }}
                >
                  {content.content.ctaSecondary.text || 'Şubelerimiz'}
                </Link>
              </motion.div>
            )}
            {!content?.content?.ctaPrimary && !content?.content?.ctaSecondary && (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/urunler"
                    className="group relative inline-block px-8 py-4 transition-all duration-300 text-sm font-medium overflow-hidden"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                    <span 
                      className="relative z-10 block transition-colors"
                      style={{
                        color: 'var(--color-text)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-background)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text)';
                      }}
                    >
                      Ürünleri Keşfet
                    </span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/subeler"
                    className="inline-block px-8 py-4 border-2 transition-all duration-300 text-sm font-medium"
                    style={{
                      borderColor: 'var(--color-background)',
                      color: 'var(--color-background)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-background)';
                      e.currentTarget.style.color = 'var(--color-text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-background)';
                    }}
                  >
                    Şubelerimiz
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/80"
        >
          <span className="text-xs uppercase tracking-wider font-medium">Keşfet</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

