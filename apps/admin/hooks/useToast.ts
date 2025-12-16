'use client';

import { useState, useCallback } from 'react';
import { Toast, ToastType } from '@/components/ui/Toast';

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (type: ToastType, title: string, options?: ToastOptions) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = {
        id,
        type,
        title,
        description: options?.description,
        duration: options?.duration ?? 5000,
        action: options?.action,
      };

      setToasts((prev) => [...prev, toast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (title: string, options?: ToastOptions) =>
      showToast('success', title, options),
    error: (title: string, options?: ToastOptions) =>
      showToast('error', title, options),
    warning: (title: string, options?: ToastOptions) =>
      showToast('warning', title, options),
    info: (title: string, options?: ToastOptions) =>
      showToast('info', title, options),
  };

  return {
    toasts,
    toast,
    removeToast,
  };
}

