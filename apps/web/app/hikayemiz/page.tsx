'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const timelineEvents = [
  {
    year: '2010',
    title: 'Başlangıç',
    description: 'Tekirdağ\'ın kalbinde küçük bir pastane olarak başladık. Geleneksel lezzetleri modern tekniklerle birleştirme hayalimiz vardı.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
  },
  {
    year: '2015',
    title: 'Büyüme',
    description: 'Müşteri memnuniyeti ve kalite odaklı yaklaşımımız sayesinde İstanbul\'da ilk şubemizi açtık.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
  },
  {
    year: '2020',
    title: 'Yenilik',
    description: 'Ankara\'da üçüncü şubemizi açarak, geleneksel değerlerle modern yaklaşımı birleştiren konseptimizi genişlettik.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
  },
  {
    year: '2024',
    title: 'Bugün',
    description: 'Her ürünümüzde mükemmelliği hedefliyor, misafirlerimize unutulmaz bir deneyim sunmak için çalışıyoruz.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
  },
];

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80"
            alt="Hikayemiz"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </motion.div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal mb-6 text-white">
              Hikayemiz
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Tekirdağ&apos;dan başlayan lezzet yolculuğumuz. Geleneksel değerler, modern yaklaşım.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 hidden md:block"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />

            {/* Timeline Events */}
            <div className="space-y-16 md:space-y-24">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Image */}
                    <div className="w-full md:w-1/2">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4"
                          style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-text)',
                          }}
                        >
                          {event.year}
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl font-normal">
                          {event.title}
                        </h2>
                      </div>
                      <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 border-t"
        style={{ borderColor: 'var(--color-primary)' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-normal mb-4">
              Değerlerimiz
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
              Her ürünümüzde öne çıkan temel değerlerimiz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Kalite',
                description: 'En iyi malzemeler, en özenli hazırlık. Her ürünümüzde mükemmellik hedefliyoruz.',
                icon: '⭐',
              },
              {
                title: 'Gelenek',
                description: 'Atalardan gelen tarifler, modern tekniklerle buluşuyor. Geleneksel lezzetler, çağdaş sunum.',
                icon: '🏛️',
              },
              {
                title: 'İnovasyon',
                description: 'Sürekli yenilik arayışı. Yeni lezzetler, yeni teknikler, yeni deneyimler.',
                icon: '✨',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-xl border-2 text-center"
                style={{
                  borderColor: 'var(--color-primary)',
                  backgroundColor: 'var(--color-background)',
                }}
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-serif text-2xl font-normal mb-3">{value.title}</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
