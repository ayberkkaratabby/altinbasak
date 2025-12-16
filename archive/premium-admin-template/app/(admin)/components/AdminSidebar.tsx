'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon, IconName } from '@/components/admin/Icon';

interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Kontrol Paneli', href: '/admin', icon: 'dashboard' },
  { label: 'Sayfalar', href: '/admin/pages', icon: 'pages' },
  { label: 'Projeler', href: '/admin/projects', icon: 'projects' },
  { label: 'Blog', href: '/admin/blog', icon: 'blog' },
  { label: 'Hizmetler', href: '/admin/services', icon: 'services' },
  { label: 'Medya Kütüphanesi', href: '/admin/media', icon: 'media' },
  { label: 'Leads', href: '/admin/leads', icon: 'leads' },
];

const settingsItems: NavItem[] = [
  { label: 'Navigasyon', href: '/admin/navigation', icon: 'navigation' },
  { label: 'Footer', href: '/admin/footer', icon: 'footer' },
  { label: 'Hero Bölümleri', href: '/admin/hero-sections', icon: 'hero' },
  { label: 'Site Ayarları', href: '/admin/site-settings', icon: 'siteSettings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full z-40 transition-all duration-300",
      "bg-gradient-to-b from-white via-white to-gray-50/50",
      "border-r border-gray-200/80 backdrop-blur-sm",
      "shadow-[4px_0_24px_rgba(0,0,0,0.04)]",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className={cn(
          "p-5 border-b border-gray-200/60",
          "bg-gradient-to-r from-black via-black to-gray-900"
        )}>
          <Link href="/admin" className="flex items-center gap-3 group">
            <AnimatePresence mode="wait">
              {isCollapsed ? (
                <motion.div
                  key="icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 overflow-hidden flex-shrink-0"
                >
                  <Image
                    src="/logo-icon.svg"
                    alt="Tabby Digital"
                    width={40}
                    height={40}
                    className="w-full h-full"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 flex-1"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 overflow-hidden flex-shrink-0">
                    <Image
                      src="/logo-icon.svg"
                      alt="Tabby Digital"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block leading-tight">Tabby Digital</span>
                    <p className="text-xs text-white/60 font-light leading-tight">Yönetim Paneli</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Collapse Toggle Button */}
        <div className="px-4 py-2 border-b border-gray-200/60">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100/80 transition-colors text-gray-600"
            title={isCollapsed ? 'Genişlet' : 'Daralt'}
          >
            <Icon
              name={isCollapsed ? 'chevronDown' : 'chevronUp'}
              size={20}
              className={cn(
                "transition-transform duration-200",
                isCollapsed ? "rotate-[-90deg]" : "rotate-90"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Main Navigation */}
          <div className="mb-6">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3"
                >
                  Ana Menü
                </motion.div>
              )}
            </AnimatePresence>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
                        'hover:bg-gray-100/80',
                        isActive
                          ? 'bg-gradient-to-r from-black to-gray-900 text-white shadow-lg shadow-black/10'
                          : 'text-gray-700'
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      
                      <Icon
                        name={item.icon}
                        size={20}
                        className={cn(
                          "transition-transform duration-200",
                          isActive ? "scale-110" : "group-hover:scale-110"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="flex-1"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {item.badge && !isCollapsed && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Settings Section */}
          <div className="pt-4 border-t border-gray-200/60">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3"
                >
                  Ayarlar
                </motion.div>
              )}
            </AnimatePresence>
            <ul className="space-y-1">
              {settingsItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
                        'hover:bg-gray-100/80',
                        isActive
                          ? 'bg-gradient-to-r from-black to-gray-900 text-white shadow-lg shadow-black/10'
                          : 'text-gray-700'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorSettings"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      
                      <Icon
                        name={item.icon}
                        size={20}
                        className={cn(
                          "transition-transform duration-200",
                          isActive ? "scale-110" : "group-hover:scale-110"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="flex-1"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
