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
        // EXCLUSION RULES:
        // 1. Service Landings (/services/slug) must keep their own colors (Standard)
        // 2. Main Services Page (/services) SHOULD follow campaign theme (User request)
        // Note: Admin panel (/admin/*) follows the global campaign theme.
        
        // Only exclude if it is a sub-route of services (e.g. /services/printing), not the index itself
        const isServiceLanding = pathname.startsWith('/services/') && pathname !== '/services';

        if (isServiceLanding) {
          if (theme !== 'standard') {
            console.log('[Seasonal] Forzando tema standard en landing de servicio:', pathname);
            setTheme('standard');
          }
          return;
        }

        // Apply seasonal theme to ALL other pages (Home, Catalog, Process, Admin, etc.)
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
