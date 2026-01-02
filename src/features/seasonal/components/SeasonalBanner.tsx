'use client';

import Link from 'next/link';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { THEME_CONFIG } from '@/config/themes';

interface SeasonalBannerProps {
  config: SeasonalThemeConfig;
}

export default function SeasonalBanner({ config }: SeasonalBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Get theme colors from existing config to style the banner
  const themeStyles = THEME_CONFIG[config.themeId] || THEME_CONFIG.standard;
  
  // Use primary color for background, or fallback
  // Since we don't have direct access to the tailwind classes in JS logic easily without mapping,
  // we'll rely on a generic style or specific theme classes if available.
  // For now, we'll use a gradient that attempts to match the theme name or a default seasonal look.

  return (
    <div className={cn(
      "relative w-full overflow-hidden transition-all duration-500",
      "bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground",
      "border-b border-primary/20 shadow-md"
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 py-3 sm:py-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          
          <div className="flex items-center gap-3 flex-1 text-center sm:text-left">
            <span className="text-2xl animate-bounce" role="img" aria-label="seasonal icon">
              {config.id === 'christmas' ? '🎄' : 
               config.id === 'halloween' ? '🎃' : 
               config.id === 'valentines' ? '💘' : '✨'}
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base leading-tight">
                {config.landing.heroTitle}
              </span>
              {config.landing.heroSubtitle && (
                <span className="text-xs sm:text-sm opacity-90 hidden sm:inline-block">
                  {config.landing.heroSubtitle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button 
              asChild 
              size="sm" 
              variant="secondary"
              className="whitespace-nowrap text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all"
            >
              <Link href={`/campanas/${config.id}`}>
                Ver Campaña
              </Link>
            </Button>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Cerrar banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
