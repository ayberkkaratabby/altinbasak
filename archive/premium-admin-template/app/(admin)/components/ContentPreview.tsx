'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/admin/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ContentPreviewProps {
  entityType: 'page' | 'project' | 'blog' | 'service';
  slug: string;
  locale: 'tr' | 'en';
  title: string;
  content?: string;
}

export function ContentPreview({
  entityType,
  slug,
  locale,
  title,
  content,
}: ContentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewLocale, setPreviewLocale] = useState<'tr' | 'en'>(locale);

  const getPreviewUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const localePrefix = previewLocale === 'tr' ? '' : '/en';
    
    switch (entityType) {
      case 'page':
        return `${baseUrl}${localePrefix}/${slug}`;
      case 'project':
        return `${baseUrl}${localePrefix}/portfolio/${slug}`;
      case 'blog':
        return `${baseUrl}${localePrefix}/blog/${slug}`;
      case 'service':
        return `${baseUrl}${localePrefix}/hizmetler/${slug}`;
      default:
        return baseUrl;
    }
  };

  const deviceSizes = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px]',
    mobile: 'w-[375px] h-[667px]',
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Icon name="view" size={18} />
        Önizle
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Icon name="view" size={20} />
                    İçerik Önizleme
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={previewLocale === 'tr' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setPreviewLocale('tr')}
                    >
                      TR
                    </Button>
                    <Button
                      variant={previewLocale === 'en' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setPreviewLocale('en')}
                    >
                      EN
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Device Selector */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setDevice('desktop')}
                      className={cn(
                        "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                        device === 'desktop'
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-600 hover:text-black"
                      )}
                      title="Desktop"
                    >
                      <Icon name="globe" size={16} />
                    </button>
                    <button
                      onClick={() => setDevice('tablet')}
                      className={cn(
                        "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                        device === 'tablet'
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-600 hover:text-black"
                      )}
                      title="Tablet"
                    >
                      <Icon name="media" size={16} />
                    </button>
                    <button
                      onClick={() => setDevice('mobile')}
                      className={cn(
                        "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                        device === 'mobile'
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-600 hover:text-black"
                      )}
                      title="Mobile"
                    >
                      <Icon name="pages" size={16} />
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon name="x" size={20} />
                  </Button>
                </div>
              </div>

              {/* Preview Frame */}
              <div className="flex-1 overflow-auto bg-gray-100 p-8 flex items-center justify-center">
                <div
                  className={cn(
                    "bg-white rounded-lg shadow-2xl overflow-hidden transition-all",
                    deviceSizes[device],
                    device !== 'desktop' && 'border-8 border-gray-800'
                  )}
                >
                  <iframe
                    src={getPreviewUrl()}
                    className="w-full h-full border-0"
                    title="Content Preview"
                  />
                </div>
              </div>

              {/* Footer Info */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="font-medium">{title}</span>
                  <span className="text-gray-400">•</span>
                  <span>{getPreviewUrl()}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.open(getPreviewUrl(), '_blank')}
                >
                  <Icon name="globe" size={16} className="mr-2" />
                  Yeni Sekmede Aç
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

