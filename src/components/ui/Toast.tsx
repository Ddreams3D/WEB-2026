'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { colors } from '@/shared/styles/colors';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Mostrar toast
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-cerrar toast
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: colors.status.success.bg,
          border: colors.status.success.border,
          text: colors.status.success.text,
          gradient: colors.gradients.backgroundPage // Using page background for glass effect base
        };
      case 'error':
        return {
          bg: colors.status.error.bg,
          border: colors.status.error.border,
          text: colors.status.error.text,
          gradient: colors.gradients.backgroundError
        };
      case 'warning':
        return {
          bg: colors.status.warning.bg,
          border: colors.status.warning.border,
          text: colors.status.warning.text,
          gradient: colors.gradients.backgroundWarning
        };
      case 'info':
      default:
        return {
          bg: colors.status.info.bg,
          border: colors.status.info.border,
          text: colors.status.info.text,
          gradient: colors.gradients.backgroundInfo
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm mb-3",
        "transform transition-all duration-300 ease-in-out",
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className={cn(
        "rounded-xl border shadow-xl p-4 backdrop-blur-md overflow-hidden relative group",
        styles.bg,
        styles.border
      )}>
        {/* Decorative gradient background */}
        <div className={cn(
          "absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none",
          styles.gradient
        )} />
        
        <div className="flex items-start relative z-10">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="ml-3 flex-1">
            <h3 className={cn("text-sm font-semibold", styles.text)}>
              {title}
            </h3>
            {message && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                {message}
              </p>
            )}
          </div>

          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={cn(
                "rounded-md inline-flex text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2",
                "bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors p-1"
              )}
              onClick={handleClose}
            >
              <span className="sr-only">Cerrar</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Progress bar animation could go here */}
      </div>
    </div>
  );
};

export default Toast;