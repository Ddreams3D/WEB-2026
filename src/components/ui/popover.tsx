'use client';

import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface PopoverTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

const PopoverContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}>({ 
  open: false, 
  setOpen: () => {}, 
  triggerRef: { current: null } 
});

const Popover: React.FC<PopoverProps> = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = React.useCallback((newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  }, [onOpenChange]);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, setOpen]);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        const popoverContent = document.querySelector('[data-popover-content]');
        if (popoverContent && !popoverContent.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, setOpen]);

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, className, asChild = false }) => {
  const { open, setOpen, triggerRef } = React.useContext(PopoverContext);

  const handleClick = () => {
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any;
    return React.cloneElement(children, {
      ...childProps,
      ref: triggerRef,
      onClick: handleClick,
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
    });
  }

  return (
    <Button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      variant="ghost"
      className={className}
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup="dialog"
    >
      {children}
    </Button>
  );
};

const PopoverContent: React.FC<PopoverContentProps> = ({ 
  children, 
  className, 
  align = "center", 
  side = "bottom", 
  sideOffset = 4 
}) => {
  const { open, triggerRef } = React.useContext(PopoverContext);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      // Calculate position based on side
      switch (side) {
        case "top":
          top = triggerRect.top - contentRect.height - sideOffset;
          break;
        case "bottom":
          top = triggerRect.bottom + sideOffset;
          break;
        case "left":
          left = triggerRect.left - contentRect.width - sideOffset;
          top = triggerRect.top;
          break;
        case "right":
          left = triggerRect.right + sideOffset;
          top = triggerRect.top;
          break;
      }

      // Calculate position based on align
      if (side === "top" || side === "bottom") {
        switch (align) {
          case "start":
            left = triggerRect.left;
            break;
          case "center":
            left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
            break;
          case "end":
            left = triggerRect.right - contentRect.width;
            break;
        }
      } else {
        switch (align) {
          case "start":
            top = triggerRect.top;
            break;
          case "center":
            top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
            break;
          case "end":
            top = triggerRect.bottom - contentRect.height;
            break;
        }
      }

      setPosition({ top, left });
    }
  }, [open, side, align, sideOffset, triggerRef]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" />
      
      {/* Content */}
      <div
        ref={contentRef}
        data-popover-content
        className={cn(
          "fixed z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          "bg-white border-gray-200 text-gray-900",
          className
        )}
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {children}
      </div>
    </>
  );
};

Popover.displayName = "Popover";
PopoverTrigger.displayName = "PopoverTrigger";
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };