'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { branches } from '@/content/branches';
import { motion } from 'framer-motion';

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b py-16 md:py-24" style={{ borderColor: 'var(--color-primary)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
              Şubelerimiz
            </h1>
            <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Tekirdağ, İstanbul ve Ankara&apos;da hizmet veren şubelerimizi keşfedin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/subeler/${branch.slug}`}
                  className="group block h-full"
                >
                  <article className="h-full flex flex-col rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl"
                    style={{
                      borderColor: 'var(--color-primary)',
                    }}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={`https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80&auto=format&fit=crop`}
                          alt={branch.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      
                      {/* City Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider backdrop-blur-sm"
                          style={{
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-text)',
                          }}
                        >
                          {branch.city}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col p-6" style={{ backgroundColor: 'var(--color-background)' }}>
                      <h2 className="font-serif text-2xl md:text-3xl font-normal mb-2 group-hover:opacity-80 transition-opacity">
                        {branch.name}
                      </h2>
                      {branch.description && (
                        <p className="text-sm md:text-base mb-4 leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                          {branch.description}
                        </p>
                      )}
                      <div className="mt-auto pt-4 border-t flex items-center justify-between"
                        style={{ borderColor: 'var(--color-primary)' }}
                      >
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {branch.hours.weekdays}
                        </p>
                        <motion.svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: 'var(--color-primary)' }}
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </motion.svg>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
