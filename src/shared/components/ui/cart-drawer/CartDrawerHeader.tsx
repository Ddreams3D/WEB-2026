'use client';

import React from 'react';
import { ShoppingBag, X } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartDrawerHeaderProps {
  itemCount: number;
  onClose: () => void;
}

export function CartDrawerHeader({ itemCount, onClose }: CartDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border/30">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", "bg-accent/50")}>
          <ShoppingBag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Mi Carrito
          </h2>
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-white/50 dark:hover:bg-neutral-700/50 transition-all duration-200 hover:scale-105"
        aria-label="Cerrar carrito"
      >
        <X className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </Button>
    </div>
  );
}
