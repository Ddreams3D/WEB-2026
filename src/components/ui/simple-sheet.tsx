'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  underHeader?: boolean;
  footer?: React.ReactNode;
  style?: React.CSSProperties; // Add style prop support
}

export function Sheet({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  description,
  className,
  underHeader = false,
  footer,
  style
}: SheetProps) {
  const [mounted, setMounted] = React.useState(false);

  // Use useLayoutEffect to prevent layout shift before paint
  React.useLayoutEffect(() => {
    setMounted(true);
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      // Small timeout to allow animation to start before restoring scroll
      // This prevents the scrollbar from appearing too early
      const timer = setTimeout(() => {
        document.body.style.overflow = 'unset';
        document.body.style.paddingRight = '0px';
      }, 0);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className={cn(
              "fixed inset-0 bg-black/40 backdrop-blur-sm",
              underHeader ? "z-[44]" : "z-50"
            )}
            style={{ willChange: 'opacity' }}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
            style={{ 
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
              ...style // Apply custom styles (e.g., CSS variables)
            }}
            className={cn(
              "fixed right-0 top-0 h-full w-full max-w-2xl border-l bg-background shadow-2xl overflow-hidden flex flex-col",
              underHeader ? "z-[45] pt-16" : "z-50",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="space-y-1">
                {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full" aria-label="Cerrar panel">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="border-t bg-background p-6">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
