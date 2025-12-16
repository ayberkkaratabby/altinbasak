'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Görsel yok</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${productName} - Görsel ${selectedIndex + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-full"
            >
              <Icon name="view" size={24} className="text-gray-900" />
            </motion.div>
          </div>
        </motion.div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-gray-900 scale-105'
                    : 'border-transparent hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                />
                {selectedIndex === index && (
                  <motion.div
                    className="absolute inset-0 bg-black/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={productName}
                width={1200}
                height={1600}
                className="w-full h-auto object-contain rounded-lg"
              />
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
              >
                <Icon name="x" size={24} className="text-white" />
              </button>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
                  >
                    <Icon name="chevronLeft" size={24} className="text-white" />
                  </button>
                  <button
                    onClick={() => setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
                  >
                    <Icon name="chevronRight" size={24} className="text-white" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

