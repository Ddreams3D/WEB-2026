'use client';

import { useState, useEffect, useRef } from 'react';
import { AnnouncementBarConfig } from '@/shared/types/landing';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementBarProps {
  config?: AnnouncementBarConfig;
  seasonalConfig?: SeasonalThemeConfig | null;
}

export default function AnnouncementBar({ config, seasonalConfig }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);

  // Priority: 1. Manual Config (if enabled) 2. Seasonal Config (if active)
  const showManual = config?.enabled;
  const showSeasonal = !showManual && seasonalConfig;

  useEffect(() => {
    const updateOffset = () => {
      if (isVisible && (showManual || showSeasonal) && barRef.current) {
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
  }, [isVisible, showManual, showSeasonal]);

  if (!isVisible) return null;
  if (!showManual && !showSeasonal) return null;

  if (showManual && config) {
      const bgColor = config.bgColor || 'bg-primary';
      const textColor = config.textColor || 'text-primary-foreground';
      const isCustomBg = bgColor.startsWith('#');
      const isCustomText = textColor.startsWith('#');
      
      return (
        <div 
            ref={barRef}
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] min-h-[40px] py-2 flex items-center justify-center px-4 text-sm font-medium shadow-sm transition-all",
                !isCustomBg && bgColor,
                !isCustomText && textColor
            )}
            style={{
                backgroundColor: isCustomBg ? bgColor : undefined,
                color: isCustomText ? textColor : undefined
            }}
        >
            <div className="flex flex-wrap items-center justify-center gap-2 text-center mr-6">
                <span>{config.content}</span>
                {config.linkUrl && (
                    <Link href={config.linkUrl} className="underline hover:opacity-80 font-bold whitespace-nowrap">
                        {config.linkText || 'Ver más'}
                    </Link>
                )}
            </div>
            {config.closable && (
                <button 
                    onClick={() => setIsVisible(false)} 
                    className="absolute right-2 sm:right-4 p-1 hover:bg-black/10 rounded-full transition-colors"
                    aria-label="Cerrar anuncio"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
      );
  }

  if (showSeasonal && seasonalConfig) {
     return (
         <div 
            ref={barRef}
            className="fixed top-0 left-0 right-0 z-[100] min-h-[40px] py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground flex items-center justify-center px-4 shadow-sm"
         >
            <div className="flex flex-wrap items-center justify-center gap-3 mr-6">
                 <span className="animate-bounce" role="img" aria-label="icono estacional">
                    {seasonalConfig.id === 'christmas' ? '🎄' : 
                     seasonalConfig.id === 'halloween' ? '🎃' : 
                     seasonalConfig.id === 'san-valentin' ? '💘' : 
                     seasonalConfig.id === 'dia-de-la-madre' ? '🌹' : '✨'}
                 </span>
                 <span className="font-bold text-sm text-center">
                    {seasonalConfig.landing.heroTitle}
                 </span>
                 <Link href={`/campanas/${seasonalConfig.id}`} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors whitespace-nowrap">
                    Ver Campaña
                 </Link>
            </div>
             <button 
                onClick={() => setIsVisible(false)} 
                className="absolute right-2 sm:right-4 p-1 hover:bg-black/10 rounded-full transition-colors"
                aria-label="Cerrar anuncio"
             >
                <X className="w-4 h-4" />
            </button>
         </div>
     )
  }

  return null;
}
