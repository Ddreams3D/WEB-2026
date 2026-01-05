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
        if (pathname === '/impresion-3d-arequipa') {
          if (theme !== 'standard') {
            setTheme('standard');
          }
          return;
        }
        const activeSeasonalConfig = await resolveActiveTheme();
        
        if (activeSeasonalConfig) {
           // Si hay una campaña activa (por fecha o manual), aplicar su tema
           if (theme !== activeSeasonalConfig.themeId) {
             console.log(`[Seasonal] Activando tema de campaña: ${activeSeasonalConfig.themeId}`);
             setTheme(activeSeasonalConfig.themeId);
           }
        } else {
           // Si NO hay campaña activa, revertir al estándar
           // Esto corrige casos donde un tema estacional quedó guardado en localStorage
           // pero la fecha ya pasó.
           if (theme !== 'standard') {
              console.log('[Seasonal] Sin campaña activa, revirtiendo a Standard');
              setTheme('standard');
           }
        }
      } catch (error) {
        console.error('Error al resolver tema estacional:', error);
      }
    };

    checkSeasonalTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ejecutar solo al montar para verificar el estado actual

  return null;
}
