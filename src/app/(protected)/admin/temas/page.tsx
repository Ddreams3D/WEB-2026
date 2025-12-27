'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, THEMES } from '@/contexts/ThemeContext';
import { THEME_CONFIG } from '@/config/themes';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Check, ArrowLeft, Lock } from '@/lib/icons';

export default function ThemeManagerPage() {
  const router = useRouter();
  const { theme: currentTheme, setTheme } = useTheme();

  return (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                <span className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                  <Lock className="w-6 h-6" />
                </span>
                Gestor de Temas
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Selecciona el tema visual para toda la aplicación. Los cambios se aplican inmediatamente.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.removeItem('theme_secret_access');
                router.push('/');
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Salir del Modo Admin
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEMES.map((themeKey) => {
            const config = THEME_CONFIG[themeKey];
            const isActive = currentTheme === themeKey;
            const Icon = config.icon;

            return (
              <button 
                key={themeKey}
                onClick={() => setTheme(themeKey)}
                className={cn(
                  "relative group rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white dark:bg-neutral-800 text-left w-full",
                  isActive 
                    ? "border-primary-500 shadow-xl scale-[1.02]" 
                    : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 shadow-md hover:shadow-lg"
                )}
              >
                {/* Preview Header */}
                <div className="h-32 relative overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <div className={cn("absolute inset-0 opacity-20", config.previewColors[0])} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className={cn("w-16 h-16 transition-transform duration-500 group-hover:scale-110", config.colorClass || "text-neutral-900 dark:text-white")} />
                  </div>
                  {/* Color Swatches */}
                  <div className="absolute bottom-4 right-4 flex -space-x-2">
                    {config.previewColors.map((color, i) => (
                      <div 
                        key={i} 
                        className={cn("w-8 h-8 rounded-full border-2 border-white dark:border-neutral-800 shadow-sm", color)}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                      {config.label}
                    </h3>
                    {isActive && (
                      <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Activo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 h-12 line-clamp-2">
                    {config.description}
                  </p>

                  <div className="w-full py-2 bg-neutral-100 dark:bg-neutral-900 text-center rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {isActive ? 'Tema Actual' : 'Activar Tema'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
  );
}
