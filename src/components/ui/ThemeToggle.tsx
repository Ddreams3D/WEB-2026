'use client';

import React from 'react';
import { Moon, Sun } from '@/lib/icons';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  isScrolled?: boolean;
}

export default function ThemeToggle({ isScrolled = false }: ThemeToggleProps) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-lg transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${
        isScrolled
          ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          : 'text-white/90 hover:bg-white/10 backdrop-blur-sm'
      }`}
      aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-yellow-500 transition-colors duration-300" />
      ) : (
        <Moon className={`w-5 h-5 transition-colors duration-300 ${
          isScrolled ? 'text-neutral-600 dark:text-neutral-300' : 'text-white'
        }`} />
      )}
    </button>
  );
}