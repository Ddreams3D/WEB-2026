'use client';

import React from 'react';
import { useTheme, THEMES } from '@/contexts/ThemeContext';
import { THEME_CONFIG } from '@/config/themes';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  isScrolled?: boolean;
}

export default function ThemeSelector({ isScrolled = false }: ThemeSelectorProps) {
  const { theme, setTheme, darkMode } = useTheme();

  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  };

  const nextThemeIndex = (THEMES.indexOf(theme) + 1) % THEMES.length;
  const nextTheme = THEMES[nextThemeIndex];
  const nextThemeLabel = `Cambiar a Tema ${THEME_CONFIG[nextTheme].label}`;
  const currentThemeLabel = `Tema ${THEME_CONFIG[theme].label}`;
  
  // Resolve base classes
  const baseClasses = !isScrolled
    ? 'text-white hover:bg-white/10 hover:text-white'
    : darkMode
      ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900';

  const activeColorClass = THEME_CONFIG[theme].colorClass;

  return (
    <Button
      onClick={cycleTheme}
      variant="ghost"
      size="icon"
      className={cn(
        "relative p-2 rounded-lg overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out",
        baseClasses,
        activeColorClass
      )}
      aria-label={nextThemeLabel}
      title={nextThemeLabel}
    >
      <div className="relative w-5 h-5">
        {THEMES.map((t) => {
          const config = THEME_CONFIG[t];
          const Icon = config.icon;
          const isActive = theme === t;
          
          return (
            <Icon 
              key={t}
              className={cn(
                "h-5 w-5 absolute transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                isActive ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
              )} 
            />
          );
        })}
      </div>
      <span className="sr-only">{currentThemeLabel}</span>
    </Button>
  );
}
