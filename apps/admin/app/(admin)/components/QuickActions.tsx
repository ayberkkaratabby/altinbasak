'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/admin/Icon';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'new-page',
    label: 'Yeni Sayfa',
    icon: 'pages',
    href: '/admin/pages/new',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'new-project',
    label: 'Yeni Proje',
    icon: 'projects',
    href: '/admin/projects/new',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    id: 'new-blog',
    label: 'Yeni Blog Yazısı',
    icon: 'blog',
    href: '/admin/blog/new',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'new-service',
    label: 'Yeni Hizmet',
    icon: 'services',
    href: '/admin/services/new',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    id: 'upload-media',
    label: 'Medya Yükle',
    icon: 'upload',
    href: '/admin/media',
    color: 'bg-pink-500 hover:bg-pink-600',
  },
];

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleAction = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" data-tour="quick-actions">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mb-4 space-y-2"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAction(action.href)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg',
                  'hover:shadow-xl transition-all duration-200',
                  'min-w-[200px] text-left',
                  action.color
                )}
              >
                <Icon name={action.icon as any} size={20} />
                <span className="font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full bg-gray-900 text-white shadow-lg',
          'flex items-center justify-center',
          'hover:bg-gray-800 transition-colors',
          isOpen && 'bg-gray-800'
        )}
        aria-label="Hızlı İşlemler"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name="plus" size={24} />
        </motion.div>
      </motion.button>
    </div>
  );
}

