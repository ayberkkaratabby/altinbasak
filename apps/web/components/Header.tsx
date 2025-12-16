'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll } from 'framer-motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const navItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/hikayemiz', label: 'Hikayemiz' },
    { href: '/urunler', label: 'Ürünler' },
    { href: '/subeler', label: 'Şubeler' },
    { href: '/iletisim', label: 'İletişim' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-black/5'
          : 'bg-white/95 backdrop-blur-sm border-b border-black/5'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-32 h-8 flex items-center justify-center text-xs font-bold tracking-wider transition-colors"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-background)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              PATISSERIE
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-black/80 hover:text-black transition-colors group"
                >
                  {item.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"
                    initial={false}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <motion.span
                className="block w-full h-0.5 bg-black origin-center"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-full h-0.5 bg-black"
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-full h-0.5 bg-black origin-center"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-black/5 bg-white"
          >
            <ul className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="block text-base font-medium text-black/80 hover:text-black transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
