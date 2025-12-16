'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcuts, createShortcut } from '@/hooks/useKeyboardShortcuts';
import { Icon } from './Icon';
import { adminConfig } from '@/admin.config';
import { cn } from '@/lib/utils';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Open command palette with Cmd/Ctrl+K
  useKeyboardShortcuts({
    shortcuts: [
      createShortcut('k', () => {
        setIsOpen(true);
      }, { ctrl: true, description: 'Command Palette aç' }),
    ],
    enabled: true,
  });

  // Close on Escape
  useKeyboardShortcuts({
    shortcuts: [
      createShortcut('Escape', () => {
        setIsOpen(false);
        setSearchQuery('');
      }),
    ],
    enabled: isOpen,
  });

  // Filter menu items based on search query
  const filteredItems = adminConfig.menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Icon name="search" size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Komut ara veya sayfa bul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-lg placeholder:text-gray-400"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-[60vh]">
              {filteredItems.length > 0 ? (
                <div className="p-2">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.href)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
                        'hover:bg-gray-100 transition-colors text-left'
                      )}
                    >
                      <Icon name={item.icon as any} size={20} className="text-gray-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.label}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Sonuç bulunamadı
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

