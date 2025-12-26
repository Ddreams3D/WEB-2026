'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from '@/lib/icons';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle
};

const colors = {
  success: 'bg-success-50 text-success-800 dark:bg-success-900/50 dark:text-success-300',
  error: 'bg-danger-50 text-danger-800 dark:bg-danger-900/50 dark:text-danger-300',
  info: 'bg-secondary-50 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-300'
};

export default function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg ${colors[type]} animate-slide-up z-50`}
    >
      <Icon className="h-5 w-5 mr-2" />
      <span className="mr-2">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-white/20 inline-flex items-center justify-center"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
