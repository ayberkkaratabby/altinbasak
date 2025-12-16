'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/admin/Icon';
import { useKeyboardShortcuts, createShortcut } from '@/hooks/useKeyboardShortcuts';
import { useState } from 'react';

interface AdminHeaderProps {
  username: string;
}

export function AdminHeader({ username }: AdminHeaderProps) {
  const router = useRouter();
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  // Keyboard shortcuts for header actions
  useKeyboardShortcuts({
    shortcuts: [
      createShortcut('?', () => {
        setShowShortcuts(prev => !prev);
      }, { description: 'Kısayolları göster/gizle' }),
    ],
    enabled: true,
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <div className="flex items-center justify-between px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Icon name="globe" size={18} />
            <span className="hidden sm:inline">Siteyi Görüntüle</span>
          </a>
          
          {/* Keyboard Shortcuts Hint */}
          <button
            onClick={() => setShowShortcuts(prev => !prev)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
            title="Kısayollar (?)"
          >
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-mono">
              ⌘K
            </kbd>
            <span className="text-[10px] whitespace-nowrap">Komutlar</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200/60">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">{username}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Icon name="logout" size={18} className="mr-2" />
            <span className="hidden sm:inline">Çıkış Yap</span>
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg p-6 z-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Klavye Kısayolları</h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Command Palette</div>
                  <div className="text-xs text-gray-500">Hızlı sayfa geçişi</div>
                </div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  ⌘K
                </kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Kaydet</div>
                  <div className="text-xs text-gray-500">Formu kaydet</div>
                </div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  ⌘S
                </kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Geri Al</div>
                  <div className="text-xs text-gray-500">Son değişikliği geri al</div>
                </div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  ⌘Z
                </kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">İleri Al</div>
                  <div className="text-xs text-gray-500">Geri alınanı tekrarla</div>
                </div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  ⌘⇧Z
                </kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Kapat</div>
                  <div className="text-xs text-gray-500">Modal/Command Palette</div>
                </div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  ESC
                </kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Yardım</div>
                  <div className="text-xs text-gray-500">Kısayolları göster</div>
                </div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                  ?
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
