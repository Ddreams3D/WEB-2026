'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from '@/lib/icons';
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
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: "bg-success-50 dark:bg-success-900/20",
          border: "border-success-200 dark:border-success-800",
          text: "text-success-800 dark:text-success-300",
          gradient: "bg-gradient-to-br from-success-100/50 to-transparent"
        };
      case 'error':
        return {
          bg: "bg-destructive-50 dark:bg-destructive-900/20",
          border: "border-destructive-200 dark:border-destructive-800",
          text: "text-destructive-800 dark:text-destructive-300",
          gradient: "bg-gradient-to-br from-destructive-100/50 to-transparent"
        };
      case 'warning':
        return {
          bg: "bg-warning-50 dark:bg-warning-900/20",
          border: "border-warning-200 dark:border-warning-800",
          text: "text-warning-800 dark:text-warning-300",
          gradient: "bg-gradient-to-br from-warning-100/50 to-transparent"
        };
      case 'info':
      default:
        return {
          bg: "bg-primary-50 dark:bg-primary-900/20",
          border: "border-primary-200 dark:border-primary-800",
          text: "text-primary-800 dark:text-primary-300",
          gradient: "bg-gradient-to-br from-primary-100/50 to-transparent"
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
              <p className="mt-1 text-sm text-muted-foreground">
                {message}
              </p>
            )}
          </div>

          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={cn(
                "rounded-md inline-flex text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
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