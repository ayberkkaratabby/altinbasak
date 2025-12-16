'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/admin/Icon';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Admin Paneline Hoş Geldiniz! 🎉',
    description: 'Bu tur size admin panelinin temel özelliklerini gösterecek. İsterseniz atlayabilirsiniz.',
    position: 'bottom',
  },
  {
    id: 'sidebar',
    title: 'Sidebar Menü',
    description: 'Buradan tüm sayfalara erişebilirsiniz. Menüyü daraltmak için üstteki butona tıklayın.',
    target: 'aside',
    position: 'right',
  },
  {
    id: 'dashboard',
    title: 'Dashboard Kartları',
    description: 'İstatistikleri buradan takip edebilirsiniz. Kartlara tıklayarak ilgili sayfaya gidebilirsiniz.',
    target: '[data-tour="dashboard-cards"]',
    position: 'bottom',
  },
  {
    id: 'quick-actions',
    title: 'Hızlı İşlemler',
    description: 'Sağ alttaki butona tıklayarak hızlıca yeni içerik oluşturabilirsiniz.',
    target: '[data-tour="quick-actions"]',
    position: 'top',
  },
  {
    id: 'activity',
    title: 'Aktivite Akışı',
    description: 'Sağ tarafta son yaptığınız işlemleri görebilirsiniz.',
    target: '[data-tour="activity-feed"]',
    position: 'left',
  },
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if user has completed tour before
    const hasCompletedTour = localStorage.getItem('admin-tour-completed');
    if (!hasCompletedTour) {
      // Start tour after a short delay
      setTimeout(() => {
        setCurrentStep(0);
      }, 1000);
    } else {
      setIsCompleted(true);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem('admin-tour-completed', 'true');
    setCurrentStep(null);
    setIsCompleted(true);
  };

  const nextStep = () => {
    if (currentStep !== null && currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const skipTour = () => {
    completeTour();
  };

  if (isCompleted || currentStep === null) {
    return null;
  }

  const step = tourSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tourSteps.length - 1;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {currentStep !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={skipTour}
          />
        )}
      </AnimatePresence>

      {/* Tour Tooltip */}
      <AnimatePresence>
        {currentStep !== null && (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[70]"
            style={{
              ...(step.target
                ? (() => {
                    const element = document.querySelector(step.target);
                    if (element) {
                      const rect = element.getBoundingClientRect();
                      const positions = {
                        top: { top: rect.bottom + 16, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' },
                        bottom: { top: rect.top - 200, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' },
                        left: { top: rect.top + rect.height / 2, left: rect.right + 16, transform: 'translateY(-50%)' },
                        right: { top: rect.top + rect.height / 2, left: rect.left - 320, transform: 'translateY(-50%)' },
                      };
                      return positions[step.position || 'bottom'];
                    }
                    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
                  })()
                : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }),
            }}
          >
            <Card className="w-80 shadow-2xl border-2 border-gray-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                      {currentStep + 1}
                    </div>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <button
                    onClick={skipTour}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Icon name="x" size={18} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {step.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {tourSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentStep
                            ? 'bg-gray-900'
                            : index < currentStep
                            ? 'bg-gray-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {!isFirst && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Geri
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={isLast ? completeTour : nextStep}
                    >
                      {isLast ? 'Tamamla' : 'İleri'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

