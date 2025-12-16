'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BranchMap } from '@/components/BranchMap';
import { Branch } from '@/content/branches';
import { Product } from '@/content/products';
import { createBreadcrumbSchema, createLocalBusinessSchema } from '@/lib/jsonld';

interface BranchPageClientProps {
  branch: Branch;
  featuredProducts: Product[];
}

export function BranchPageClient({ branch, featuredProducts }: BranchPageClientProps) {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Şubeler', url: '/subeler' },
    { name: branch.name, url: `/subeler/${branch.slug}` },
  ]);

  const localBusinessSchema = createLocalBusinessSchema(branch);

  const whatsappNumber = branch.phone.replace(/\s/g, '').replace('+', '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80"
              alt={branch.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          </motion.div>
          
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 backdrop-blur-sm bg-white/20 text-white">
                  {branch.city}
                </div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-white">
                  {branch.name}
                </h1>
                {branch.description && (
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                    {branch.description}
                  </p>
                )}
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
                  <Link href="/subeler" className="hover:opacity-70 transition-opacity">
                    Şubeler
                  </Link>
                </li>
                <li>/</li>
                <li className="opacity-60">{branch.name}</li>
              </ol>
            </motion.nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
              {/* Left Column - Map & Contact */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-8"
              >
                {/* Map */}
                <BranchMap address={branch.address} coordinates={branch.coordinates} />

                {/* Contact Info */}
                <div className="space-y-6 p-6 rounded-xl border-2"
                  style={{
                    borderColor: 'var(--theme-primary)',
                    backgroundColor: 'var(--theme-background)',
                  }}
                >
                  <h2 className="font-serif text-2xl md:text-3xl font-normal">
                    İletişim Bilgileri
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm mb-1" style={{ color: 'var(--theme-text-muted)' }}>Adres</p>
                      <p className="leading-relaxed">{branch.address}</p>
                    </div>
                    <div>
                      <p className="text-sm mb-1" style={{ color: 'var(--theme-text-muted)' }}>Telefon</p>
                      <a
                        href={`tel:${branch.phone.replace(/\s/g, '')}`}
                        className="hover:opacity-70 transition-opacity"
                      >
                        {branch.phone}
                      </a>
                    </div>
                    {branch.email && (
                      <div>
                        <p className="text-sm mb-1" style={{ color: 'var(--theme-text-muted)' }}>E-posta</p>
                        <a
                          href={`mailto:${branch.email}`}
                          className="hover:opacity-70 transition-opacity"
                        >
                          {branch.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: 'var(--theme-primary)',
                        color: 'var(--theme-background)',
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Haritada Gör
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border-2 transition-all duration-300 hover:scale-105"
                      style={{
                        borderColor: 'var(--theme-primary)',
                        color: 'var(--theme-text)',
                      }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="p-6 rounded-xl border-2"
                  style={{
                    borderColor: 'var(--theme-primary)',
                    backgroundColor: 'var(--theme-background)',
                  }}
                >
                  <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                    Çalışma Saatleri
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b"
                      style={{ borderColor: 'var(--theme-primary)' }}
                    >
                      <span>Pazartesi - Cuma</span>
                      <span className="font-medium">{branch.hours.weekdays}</span>
                    </div>
                    {branch.hours.weekend && (
                      <div className="flex justify-between items-center py-2 border-b"
                        style={{ borderColor: 'var(--theme-primary)' }}
                      >
                        <span>Cumartesi - Pazar</span>
                        <span className="font-medium">{branch.hours.weekend}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Featured Products */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-8"
              >
                {featuredProducts.length > 0 && (
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl font-normal mb-6">
                      Öne Çıkan Ürünler
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {featuredProducts.map((product, index) => (
                        <motion.div
                          key={product.slug}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <Link
                            href={`/urunler/${product.slug}`}
                            className="group block"
                          >
                            <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-gray-100">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0"
                              >
                                <Image
                                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80&auto=format&fit=crop"
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              </motion.div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </div>
                            <h3 className="font-serif text-xl font-normal mb-2 group-hover:opacity-80 transition-opacity">
                              {product.name}
                            </h3>
                            <p className="text-sm line-clamp-2" style={{ color: 'var(--theme-text-muted)' }}>
                              {product.shortDescription}
                            </p>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back to Branches */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-8"
                >
                  <Link
                    href="/subeler"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Tüm Şubelere Dön
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

