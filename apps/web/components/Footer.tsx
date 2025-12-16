'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quick: [
      { href: '/hikayemiz', label: 'Hikayemiz' },
      { href: '/urunler', label: 'Ürünler' },
      { href: '/subeler', label: 'Şubeler' },
      { href: '/iletisim', label: 'İletişim' },
    ],
    social: [
      { href: '#', label: 'Instagram', icon: '📷' },
      { href: '#', label: 'Facebook', icon: '📘' },
      { href: '#', label: 'Twitter', icon: '🐦' },
    ],
  };

  return (
    <footer 
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-background)',
      }}
    >
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(255 255 255) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-2xl mb-4">Patisserie</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Tekirdağ'dan dünyaya açılan lüks patisserie deneyimi.
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-medium mb-4 text-white">Hızlı Linkler</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.quick.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-medium mb-4 text-white">İletişim</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Tekirdağ Merkez</li>
              <li>Rüstem Paşa Mahallesi</li>
              <li>Hükümet Caddesi No: 45</li>
              <li className="pt-2">
                <a
                  href="tel:+902821234567"
                  className="hover:text-white transition-colors"
                >
                  +90 282 123 45 67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@patisserie.com"
                  className="hover:text-white transition-colors"
                >
                  info@patisserie.com
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-medium mb-4 text-white">Bülten</h4>
            <p className="text-white/60 text-sm mb-4">
              Özel fırsatlar ve yeni ürünlerden haberdar olun.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors text-sm font-medium"
              >
                Abone Ol
              </motion.button>
            </form>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10 text-sm text-white/40 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p>&copy; {currentYear} Patisserie. Tüm hakları saklıdır.</p>
          <div className="flex gap-6 text-xs">
            <Link href="/gizlilik" className="hover:text-white/60 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim" className="hover:text-white/60 transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
