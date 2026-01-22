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
        // EXCEPCIÓN DE ARQUITECTURA: Aislamiento de Contexto
        // Las landings de servicio (ej: /impresion-3d-arequipa, /servicios/*) son "islas" de marca.
        // No deben ser afectadas por campañas estacionales (Navidad, etc.) de la web principal.
        const isServiceContext = 
          pathname?.startsWith('/impresion-3d-arequipa') || 
          pathname?.startsWith('/servicios/');

        if (isServiceContext) {
          // Si estamos en contexto de servicio, forzamos "standard" (sin tema estacional)
          // Esto limpia cualquier tema residual si el usuario viene de la Home
          if (theme !== 'standard') {
             console.log(`[Seasonal] Aislamiento de servicio detectado. Restaurando tema base en: ${pathname}`);
             setTheme('standard'); 
          }
          return; // ABORTAR inyección de tema estacional
        }

        // Apply seasonal theme to Standard Web Context (Home, Catalog, etc.)
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
