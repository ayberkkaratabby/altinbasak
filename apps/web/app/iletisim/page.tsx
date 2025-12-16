'use client';

import React, { useState } from 'react';
import { branches } from '@/content/branches';
import { motion } from 'framer-motion';
import { BranchMap } from '@/components/BranchMap';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const mainBranch = branches[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b py-16 md:py-24" style={{ borderColor: 'var(--color-primary)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-balance">
              İletişim
            </h1>
            <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Bize ulaşın. Sorularınız ve önerileriniz için buradayız.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Left Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-normal mb-6">
                Mesaj Gönderin
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-4 transition-all"
                      style={{
                        borderColor: 'var(--color-primary)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-4 transition-all"
                      style={{
                        borderColor: 'var(--color-primary)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-4 transition-all"
                    style={{
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-4 transition-all"
                    style={{
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-4 transition-all resize-none"
                    style={{
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800"
                  >
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                  </motion.div>
                )}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-background)',
                  }}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </motion.button>
              </form>
            </motion.div>

            {/* Right Column - Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-8"
            >
              {/* Contact Info */}
              <div className="p-6 rounded-xl border-2"
                style={{
                  borderColor: 'var(--color-primary)',
                  backgroundColor: 'var(--color-background)',
                }}
              >
                <h2 className="font-serif text-3xl md:text-4xl font-normal mb-6">
                  Genel İletişim
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>Adres</p>
                    <p className="leading-relaxed">{mainBranch.address}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>Telefon</p>
                    <a
                      href={`tel:${mainBranch.phone.replace(/\s/g, '')}`}
                      className="hover:opacity-70 transition-opacity"
                    >
                      {mainBranch.phone}
                    </a>
                  </div>
                  {mainBranch.email && (
                    <div>
                      <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>E-posta</p>
                      <a
                        href={`mailto:${mainBranch.email}`}
                        className="hover:opacity-70 transition-opacity"
                      >
                        {mainBranch.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <BranchMap address={mainBranch.address} coordinates={mainBranch.coordinates} />

              {/* Hours */}
              <div className="p-6 rounded-xl border-2"
                style={{
                  borderColor: 'var(--color-primary)',
                  backgroundColor: 'var(--color-background)',
                }}
              >
                <h3 className="font-serif text-2xl font-normal mb-4">
                  Çalışma Saatleri
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b"
                    style={{ borderColor: 'var(--color-primary)' }}
                  >
                    <span>Pazartesi - Cuma</span>
                    <span className="font-medium">{mainBranch.hours.weekdays}</span>
                  </div>
                  {mainBranch.hours.weekend && (
                    <div className="flex justify-between py-2">
                      <span>Cumartesi - Pazar</span>
                      <span className="font-medium">{mainBranch.hours.weekend}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* All Branches */}
              <div>
                <h3 className="font-serif text-2xl font-normal mb-4">
                  Tüm Şubelerimiz
                </h3>
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <div key={branch.slug} className="p-4 rounded-lg border"
                      style={{
                        borderColor: 'var(--color-primary)',
                        backgroundColor: 'var(--color-background)',
                      }}
                    >
                      <h4 className="font-medium mb-1">{branch.name}</h4>
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        {branch.address}
                      </p>
                      <a
                        href={`tel:${branch.phone.replace(/\s/g, '')}`}
                        className="text-sm hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {branch.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
