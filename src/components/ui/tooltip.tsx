'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Contexto simple para el estado del tooltip
const TooltipContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

// En una implementación completa usaríamos delayDuration, pero para esta versión simple lo omitimos o lo hacemos básico
export const TooltipProvider = ({ children }: TooltipProviderProps) => {
  return <>{children}</>;
};

interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}

export const Tooltip = ({ children, delayDuration = 0 }: TooltipProps) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (delayDuration > 0) {
      timeoutRef.current = setTimeout(() => setOpen(true), delayDuration);
    } else {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div 
        className="relative flex items-center justify-center" // Flex para no romper layouts
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const TooltipTrigger = ({ children }: TooltipTriggerProps) => {
  // En una implementación real con asChild, clonaríamos el elemento.
  // Aquí simplemente renderizamos los hijos.
  return <>{children}</>;
};

interface TooltipContentProps {
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
}

export const TooltipContent = ({ 
  children, 
  className, 
  side = 'bottom',
  sideOffset = 4 
}: TooltipContentProps) => {
  const { open } = React.useContext(TooltipContext);

  if (!open) return null;

  const sideStyles = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div
      className={cn(
        "absolute z-50 overflow-hidden rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95",
        sideStyles[side],
        // Centrado horizontal si es top/bottom
        (side === 'top' || side === 'bottom') && "left-1/2 -translate-x-1/2",
        // Centrado vertical si es left/right
        (side === 'left' || side === 'right') && "top-1/2 -translate-y-1/2",
        className
      )}
    >
      {children}
    </div>
  );
};
