'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useToast as useToastHook } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

interface ToastContextType {
  toast: {
    success: (title: string, options?: any) => string;
    error: (title: string, options?: any) => string;
    warning: (title: string, options?: any) => string;
    info: (title: string, options?: any) => string;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, toast, removeToast } = useToastHook();

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}

