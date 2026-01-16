'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { resolveActiveTheme } from '@/lib/seasonal-service';

export function SeasonalThemeController() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const checkSeasonalTheme = async () => {
      try {
        // Apply seasonal theme to ALL pages including Service Landings, Home, Catalog, Process, Admin, etc.
        const activeSeasonalConfig = await resolveActiveTheme();
        
        // Always apply the resolved theme
        if (theme !== activeSeasonalConfig.themeId) {
           console.log(`[Seasonal] Cambiando tema a: ${activeSeasonalConfig.themeId} en ruta: ${pathname}`);
           setTheme(activeSeasonalConfig.themeId);
        }
      } catch (error) {
        console.error('Error al resolver tema estacional:', error);
      }
    };

    checkSeasonalTheme();
  }, [pathname, theme, setTheme]); // Re-run on route change or theme change to ensure consistency

  return null;
}
