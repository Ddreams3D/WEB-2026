'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { resolveActiveTheme } from '@/lib/seasonal-service';
import { hexToHsl, hexToRgb } from '@/lib/utils';

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
             if (process.env.NODE_ENV === 'development') {
                console.log(`[Seasonal] Aislamiento de servicio detectado. Restaurando tema base en: ${pathname}`);
             }
             setTheme('standard'); 
             
             // 1. Remove Server-Side Injected Style if exists (The "Purist" Cleanup)
             const serverStyle = document.getElementById('server-theme-style');
             if (serverStyle) serverStyle.remove();

             // 2. Restaurar colores CSS base (Cleaning inline styles)
             document.documentElement.style.removeProperty('--primary');
             document.documentElement.style.removeProperty('--primary-500');
             document.documentElement.style.removeProperty('--primary-600');
             document.documentElement.style.removeProperty('--ring');
             document.documentElement.style.removeProperty('--secondary');
             document.documentElement.style.removeProperty('--secondary-500');
             document.documentElement.style.removeProperty('--background');
             document.documentElement.style.removeProperty('--radius');
             document.documentElement.style.removeProperty('--font-heading');
             document.documentElement.style.removeProperty('--font-body');
          }
          return; // ABORTAR inyección de tema estacional
        }

        // Apply seasonal theme to Standard Web Context (Home, Catalog, etc.)
        const activeSeasonalConfig = await resolveActiveTheme();
        
        // Architecture Check: Does this campaign want to override the global theme?
        // Default to true if undefined for backward compatibility, unless it's standard which is always applied
        const shouldApplyGlobal = activeSeasonalConfig.applyThemeToGlobal !== false;

        if (shouldApplyGlobal) {
           // Always apply the resolved theme if allowed
           if (theme !== activeSeasonalConfig.themeId) {
              if (process.env.NODE_ENV === 'development') {
                 console.log(`[Seasonal] Cambiando tema a: ${activeSeasonalConfig.themeId} en ruta: ${pathname}`);
              }
              setTheme(activeSeasonalConfig.themeId);
           }
           
           // INYECCIÓN DE COLORES DINÁMICOS
           // Si el tema tiene un color personalizado definido, lo inyectamos como variables CSS
           if (activeSeasonalConfig.landing.primaryColor) {
             const rgb = hexToRgb(activeSeasonalConfig.landing.primaryColor);
             const hsl = hexToHsl(activeSeasonalConfig.landing.primaryColor);
             
             if (rgb) {
               // Tailwind config expects RGB for primary colors
               document.documentElement.style.setProperty('--primary', rgb);
               document.documentElement.style.setProperty('--primary-500', rgb);
               document.documentElement.style.setProperty('--primary-600', rgb);
             }
             if (hsl) {
               // Tailwind config expects HSL for ring
               document.documentElement.style.setProperty('--ring', hsl);
             }
           } else {
             // Si no hay color personalizado, limpiamos para usar los del tema CSS
             document.documentElement.style.removeProperty('--primary');
             document.documentElement.style.removeProperty('--primary-500');
             document.documentElement.style.removeProperty('--primary-600');
             document.documentElement.style.removeProperty('--ring');
           }

           // --- NUEVAS INYECCIONES DE ESTILO (Apariencia Global) ---
           
           // 1. Color Secundario
           if (activeSeasonalConfig.landing.secondaryColor) {
             const rgb = hexToRgb(activeSeasonalConfig.landing.secondaryColor);
             // Tailwind config expects RGB for secondary (based on our config check)
             if (rgb) {
                document.documentElement.style.setProperty('--secondary', rgb);
                document.documentElement.style.setProperty('--secondary-500', rgb);
             }
           } else {
             document.documentElement.style.removeProperty('--secondary');
             document.documentElement.style.removeProperty('--secondary-500');
           }

           // 2. Fondo de Página
           if (activeSeasonalConfig.landing.backgroundColor) {
             const hsl = hexToHsl(activeSeasonalConfig.landing.backgroundColor);
             // Tailwind config expects HSL for background
             if (hsl) document.documentElement.style.setProperty('--background', hsl);
           } else {
             document.documentElement.style.removeProperty('--background');
           }

           // 3. Radio de Botones (Button Style)
           if (activeSeasonalConfig.landing.buttonStyle) {
             const radius = activeSeasonalConfig.landing.buttonStyle === 'pill' ? '9999px' 
               : activeSeasonalConfig.landing.buttonStyle === 'square' ? '0rem' 
               : '0.5rem';
             document.documentElement.style.setProperty('--radius', radius);
           } else {
             document.documentElement.style.removeProperty('--radius');
           }
           
           // 4. Tipografía (Simplified Stacks)
           // Nota: Asegúrate de que las fuentes estén cargadas en layout o usar web-safe
           if (activeSeasonalConfig.landing.fontFamilyHeading) {
              const font = activeSeasonalConfig.landing.fontFamilyHeading === 'playfair' ? '"Playfair Display", serif' 
                : activeSeasonalConfig.landing.fontFamilyHeading === 'oswald' ? '"Oswald", sans-serif'
                : activeSeasonalConfig.landing.fontFamilyHeading === 'montserrat' ? '"Montserrat", sans-serif'
                : 'var(--font-sans)';
              document.documentElement.style.setProperty('--font-heading', font);
           }
           
           if (activeSeasonalConfig.landing.fontFamilyBody) {
              const font = activeSeasonalConfig.landing.fontFamilyBody === 'roboto' ? '"Roboto", sans-serif'
                : activeSeasonalConfig.landing.fontFamilyBody === 'open-sans' ? '"Open Sans", sans-serif'
                : 'var(--font-sans)';
              document.documentElement.style.setProperty('--font-body', font);
           }

        } else {
           // If the active campaign does NOT want to touch global theme, ensure we are in standard
           if (theme !== 'standard') {
              console.log(`[Seasonal] Campaña activa (${activeSeasonalConfig.id}) sin efecto global. Restaurando standard.`);
              setTheme('standard');
              // Clean up styles
              document.documentElement.style.removeProperty('--primary');
              document.documentElement.style.removeProperty('--primary-500');
              document.documentElement.style.removeProperty('--primary-600');
              document.documentElement.style.removeProperty('--ring');
              document.documentElement.style.removeProperty('--secondary');
              document.documentElement.style.removeProperty('--secondary-500');
              document.documentElement.style.removeProperty('--background');
              document.documentElement.style.removeProperty('--radius');
              document.documentElement.style.removeProperty('--font-heading');
              document.documentElement.style.removeProperty('--font-body');
           }
        }
      } catch (error) {
        console.error('Error al resolver tema estacional:', error);
      }
    };

    checkSeasonalTheme();
  }, [pathname, theme, setTheme]); // Re-run on route change or theme change to ensure consistency

  return null;
}
