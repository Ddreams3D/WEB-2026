'use client';

import { useState, useEffect, useRef } from 'react';
import { AnnouncementBarConfig } from '@/shared/types/landing';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Theme } from '@/contexts/ThemeContext';

interface AnnouncementBarProps {
  config?: AnnouncementBarConfig;
  seasonalConfig?: SeasonalThemeConfig | null;
}

// Configuration Map for Automatic Seasonal Styles
// Maps themeId (from seasonalConfig) to specific visual styles and default copy
const SEASONAL_STYLES: Record<string, {
  bgClass: string;
  icon: string;
  defaultText: string;
  ctaText: string;
}> = {
  'valentines': {
    bgClass: 'bg-gradient-to-r from-red-600 to-rose-500 text-white',
    icon: '💘',
    defaultText: '¡Celebra el Amor! Regalos personalizados únicos.',
    ctaText: 'Ver Colección San Valentín'
  },
  'san-valentin': { // Alias for consistency
    bgClass: 'bg-gradient-to-r from-red-600 to-rose-500 text-white',
    icon: '💘',
    defaultText: '¡Celebra el Amor! Regalos personalizados únicos.',
    ctaText: 'Ver Colección San Valentín'
  },
  'halloween': {
    bgClass: 'bg-gradient-to-r from-orange-600 via-orange-500 to-purple-900 text-white',
    icon: '🎃',
    defaultText: '¡Terroríficamente increíbles! Especial Halloween.',
    ctaText: 'Ver Colección Halloween'
  },
  'christmas': {
    bgClass: 'bg-gradient-to-r from-red-700 to-green-800 text-white',
    icon: '🎄',
    defaultText: '¡Regala Magia! Edición Especial Navidad.',
    ctaText: 'Ver Regalos Navideños'
  },
  'festive-warm': { // Fallback Christmas
    bgClass: 'bg-gradient-to-r from-amber-500 to-red-600 text-white',
    icon: '🎁',
    defaultText: 'Regalos que emocionan. Temporada Festiva.',
    ctaText: 'Ver Catálogo'
  },
  'dia-de-la-madre': {
    bgClass: 'bg-gradient-to-r from-pink-500 to-rose-400 text-white',
    icon: '🌹',
    defaultText: 'Para Mamá, solo lo mejor. Detalles únicos.',
    ctaText: 'Ver Regalos para Mamá'
  },
  'mothers-day': {
    bgClass: 'bg-gradient-to-r from-pink-500 to-rose-400 text-white',
    icon: '🌹',
    defaultText: 'Para Mamá, solo lo mejor. Detalles únicos.',
    ctaText: 'Ver Regalos para Mamá'
  },
  'festive-strong': { // Fiestas Patrias
    bgClass: 'bg-gradient-to-r from-red-600 via-white/20 to-red-600 text-white',
    icon: '🇵🇪',
    defaultText: '¡Orgullo Peruano! Edición Fiestas Patrias.',
    ctaText: 'Ver Colección'
  }
};

const DEFAULT_SEASONAL_STYLE = {
  bgClass: 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground',
  icon: '✨',
  defaultText: 'Descubre nuestra colección de temporada.',
  ctaText: 'Ver Campaña'
};

export default function AnnouncementBar({ config, seasonalConfig }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);

  // Priority Logic:
  // 1. Manual Global Config (if enabled) - Panic Button
  // 2. Seasonal Config Specific Override (if exists) - Campaign Specific Bar
  // 3. Smart Fallback (Hardcoded styles) - Automatic Defaults
  const showGlobalManual = config?.enabled;
  const seasonalOverride = seasonalConfig?.announcement;
  const showSeasonalOverride = !showGlobalManual && seasonalOverride?.enabled;
  // Only show smart seasonal bar if it's NOT the standard theme
  const showSmartSeasonal = !showGlobalManual && !showSeasonalOverride && seasonalConfig && seasonalConfig.id !== 'standard';

  // Handle navbar offset logic
  useEffect(() => {
    const updateOffset = () => {
      if (isVisible && (showGlobalManual || showSeasonalOverride || showSmartSeasonal) && barRef.current) {
        const height = barRef.current.offsetHeight;
        document.documentElement.style.setProperty('--navbar-offset', `${height}px`);
      } else {
        document.documentElement.style.setProperty('--navbar-offset', '0px');
      }
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => {
       document.documentElement.style.setProperty('--navbar-offset', '0px');
       window.removeEventListener('resize', updateOffset);
    };
  }, [isVisible, showGlobalManual, showSeasonalOverride, showSmartSeasonal]);

  if (!isVisible) return null;
  if (!showGlobalManual && !showSeasonalOverride && !showSmartSeasonal) return null;

  // RENDER 1: GLOBAL MANUAL CONFIGURATION (Highest Priority)
  if (showGlobalManual && config) {
      const bgColor = config.bgColor || 'bg-primary';
      const textColor = config.textColor || 'text-primary-foreground';
      const isCustomBg = bgColor.startsWith('#');
      const isCustomText = textColor.startsWith('#');
      
      return (
        <div 
            ref={barRef}
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] min-h-[40px] py-2.5 flex items-center justify-center px-4 shadow-md transition-all duration-300 ease-in-out",
                !isCustomBg && bgColor,
                !isCustomText && textColor
            )}
            style={{
                backgroundColor: isCustomBg ? bgColor : undefined,
                color: isCustomText ? textColor : undefined
            }}
        >
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center pr-8 sm:pr-0 sm:mr-8 w-full max-w-7xl mx-auto">
                <span className="text-xs sm:text-sm font-medium leading-tight">{config.content}</span>
                {config.linkUrl && (
                    <Link href={config.linkUrl} className="text-xs sm:text-sm underline hover:opacity-80 font-bold whitespace-nowrap transition-opacity">
                        {config.linkText || 'Ver más'}
                    </Link>
                )}
            </div>
            {config.closable && (
                <button 
                    onClick={() => setIsVisible(false)} 
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-black/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Cerrar anuncio"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
      );
  }

  // RENDER 2: SEASONAL CAMPAIGN OVERRIDE (Second Priority)
  if (showSeasonalOverride && seasonalOverride) {
      const bgColor = seasonalOverride.bgColor || 'bg-primary';
      const textColor = seasonalOverride.textColor || 'text-primary-foreground';
      const isCustomBg = bgColor.startsWith('#');
      const isCustomText = textColor.startsWith('#');
      
      return (
        <div 
            ref={barRef}
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] min-h-[40px] py-2.5 flex items-center justify-center px-4 shadow-md transition-all duration-300 ease-in-out",
                !isCustomBg && bgColor,
                !isCustomText && textColor
            )}
            style={{
                backgroundColor: isCustomBg ? bgColor : undefined,
                color: isCustomText ? textColor : undefined
            }}
        >
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center pr-8 sm:pr-0 sm:mr-8 w-full max-w-7xl mx-auto">
                <span className="text-xs sm:text-sm font-medium leading-tight">{seasonalOverride.content}</span>
                {seasonalOverride.linkUrl && (
                    <Link href={seasonalOverride.linkUrl} className="text-xs sm:text-sm underline hover:opacity-80 font-bold whitespace-nowrap transition-opacity">
                        {seasonalOverride.linkText || 'Ver más'}
                    </Link>
                )}
            </div>
            {seasonalOverride.closable && (
                <button 
                    onClick={() => setIsVisible(false)} 
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-black/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Cerrar anuncio"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
      );
  }

  // RENDER 3: AUTOMATIC SEASONAL CONFIGURATION (Fallback)
  if (showSmartSeasonal && seasonalConfig) {
     // Determine styles based on theme ID or fallback
     // Use seasonalConfig.id (e.g., 'san-valentin') or themeId (e.g., 'valentines') to find match
     const style = SEASONAL_STYLES[seasonalConfig.id] || 
                   SEASONAL_STYLES[seasonalConfig.themeId] || 
                   DEFAULT_SEASONAL_STYLE;

     return (
         <div 
            ref={barRef}
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] min-h-[40px] py-2.5 flex items-center justify-center px-4 shadow-md transition-all duration-300 ease-in-out",
                style.bgClass
            )}
         >
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center pr-8 sm:pr-0 sm:mr-8 w-full max-w-7xl mx-auto">
                 <span className="animate-bounce text-base" role="img" aria-label="icono estacional">
                    {style.icon}
                 </span>
                 <span className="font-bold text-xs sm:text-sm leading-tight">
                    {/* Prefer heroTitle if it's short/punchy, otherwise fallback to our optimized default */}
                    {seasonalConfig.landing.heroTitle || style.defaultText}
                 </span>
                 <Link 
                    href={`/campanas/${seasonalConfig.id}`} 
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors whitespace-nowrap font-semibold ml-1"
                 >
                    {style.ctaText}
                 </Link>
            </div>
             <button 
                onClick={() => setIsVisible(false)} 
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-black/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Cerrar anuncio"
             >
                <X className="w-4 h-4" />
            </button>
         </div>
     )
  }

  return null;
}
