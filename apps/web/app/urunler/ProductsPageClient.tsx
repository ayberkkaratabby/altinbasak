'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  featured?: boolean;
}

interface ProductsPageClientProps {
  products: Product[];
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  // Defensive: Ensure products is an array (handles API error responses)
  const safeProducts = Array.isArray(products) ? products : [];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-black/5 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
            Ürünlerimiz
          </h1>
          <p className="text-lg md:text-xl text-black/60 max-w-2xl leading-relaxed">
            Her biri özenle hazırlanmış, geleneksel lezzetler modern yaklaşımla.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {safeProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-black/60 mb-4">Henüz ürün eklenmemiş.</p>
              <p className="text-sm text-black/40">Ürünler admin panelinden eklenecek.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {safeProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`/urunler/${product.slug}`}
                    className="group block"
                  >
                    <article className="h-full flex flex-col">
                      {/* Image with Hover Effect */}
                      <div className="relative aspect-[4/5] bg-gray-100 mb-6 overflow-hidden">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={`https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80&auto=format&fit=crop`}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </motion.div>
                        
                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        
                        {/* Featured Badge */}
                        {product.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-black uppercase tracking-wider">
                              Öne Çıkan
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <h2 className="font-serif text-2xl md:text-3xl font-normal mb-2 group-hover:text-black/80 transition-colors">
                          {product.title}
                        </h2>
                        <p className="text-sm md:text-base text-black/60 mb-4 leading-relaxed line-clamp-2">
                          {product.excerpt || product.description || ''}
                        </p>
                        
                        {/* View More Indicator */}
                        <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between">
                          <span className="text-xs text-black/40 uppercase tracking-wider">
                            Detaylar
                          </span>
                          <motion.svg
                            className="w-5 h-5 text-black/40 group-hover:text-black transition-colors"
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
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
