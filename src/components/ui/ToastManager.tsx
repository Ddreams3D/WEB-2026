'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (data: Omit<ToastData, 'id'>) => void;
  showToast: (data: Omit<ToastData, 'id'>) => void;
  dismiss: (id: string) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((data: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...data, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    toast({ type: 'success', title, message });
  }, [toast]);

  const showError = useCallback((title: string, message?: string) => {
    toast({ type: 'error', title, message });
  }, [toast]);

  const showInfo = useCallback((title: string, message?: string) => {
    toast({ type: 'info', title, message });
  }, [toast]);

  const showWarning = useCallback((title: string, message?: string) => {
    toast({ type: 'warning', title, message });
  }, [toast]);

  const contextValue = React.useMemo(() => ({
    toast,
    showToast: toast,
    dismiss,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }), [toast, dismiss, showSuccess, showError, showInfo, showWarning]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col items-end gap-2 pointer-events-none w-full max-w-sm">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            type={t.type}
            title={t.title}
            message={t.message}
            duration={t.duration}
            onClose={dismiss}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
