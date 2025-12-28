'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = ['standard', 'halloween', 'promo', 'festive-strong', 'festive-warm', 'festive-soft'] as const;
export type Theme = typeof THEMES[number];

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setThemeState] = useState<Theme>('standard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load Dark Mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    let initialDarkMode = false;
    
    if (savedDarkMode) {
      initialDarkMode = JSON.parse(savedDarkMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Fallback to system preference if no stored preference
      initialDarkMode = true;
    }

    setDarkMode(initialDarkMode);
    
    // Ensure DOM matches state immediately upon mount
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load Theme preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && (THEMES as readonly string[]).includes(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
