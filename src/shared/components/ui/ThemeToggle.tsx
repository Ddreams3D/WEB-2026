'use client';

import React from 'react';
import { Moon, Sun } from '@/lib/icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  isScrolled?: boolean;
}

export default function ThemeToggle({ isScrolled = false }: ThemeToggleProps) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      onClick={toggleDarkMode}
      variant="ghost"
      size="icon"
      className={cn(
        "relative p-2 rounded-lg overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out",
        !isScrolled
          ? 'text-white hover:bg-white/10 hover:text-white'
          : darkMode
            ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      )}
      aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <Sun 
        className={cn(
          "h-5 w-5 absolute transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
          !darkMode 
            ? "opacity-100 rotate-0 scale-100 text-yellow-500" 
            : "opacity-0 -rotate-90 scale-0"
        )} 
      />
      <Moon 
        className={cn(
          "h-5 w-5 absolute transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
          !darkMode 
            ? "opacity-0 rotate-90 scale-0" 
            : "opacity-100 rotate-0 scale-100"
        )} 
      />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
