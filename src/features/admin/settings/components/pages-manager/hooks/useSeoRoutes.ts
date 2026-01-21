import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { RouteItem, RouteType, RouteCategory, RouteStatus, SeoConfig } from '../types';
import { SITE_ROUTES, ACTIVE_REDIRECTS } from '../data';
import { SERVICE_LANDINGS_DATA } from '@/shared/data/service-landings-data';
import { seasonalThemes } from '@/data/seasonal-themes';
import { fetchAllSeoConfigs, saveSeoConfig, getDocIdFromPath } from '@/services/seo.service';
import { revalidateSeoPath } from '@/app/actions/seo';

export function useSeoRoutes() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Construct the initial base list from static code definitions
  const getBaseRoutes = useCallback(() => {
    const serviceLandings: RouteItem[] = SERVICE_LANDINGS_DATA.map(l => ({
    path: `/servicios/${l.slug}`,
    name: l.name,
    type: 'Generada' as RouteType,
    category: 'Servicios' as RouteCategory,
    status: (l.isActive ? 'active' : 'inactive') as RouteStatus,
    description: 'Landing generada dinámicamente',
    seo: {
      canonicalUrl: `https://ddreams3d.com/servicios/${l.slug}`,
      robots:
        l.slug === 'soportes-personalizados-dispositivos'
          ? 'noindex, nofollow'
          : 'index, follow'
    }
  }));

    const campaignLandings: RouteItem[] = seasonalThemes.map(t => ({
    path: `/campanas/${t.id}`,
    name: `Campaña: ${t.name}`,
    type: 'Campaign' as RouteType,
    category: 'Marketing' as RouteCategory,
    status: 'active' as RouteStatus,
    description: `Landing estacional de ${t.name}`,
    seo: {
        metaTitle: `${t.landing.heroTitle} | Ddreams 3D`,
        metaDescription: t.landing.heroDescription,
        canonicalUrl: `https://ddreams3d.com/campanas/${t.id}`,
        robots: 'index, follow'
    }
  }));

    return [
      ...SITE_ROUTES,
      ...ACTIVE_REDIRECTS,
      ...serviceLandings,
      ...campaignLandings
    ];
  }, []);

  // 2. Fetch SEO overrides from Firestore and merge
  const refreshRoutes = useCallback(async () => {
    setIsLoading(true);
    try {
      const configs = await fetchAllSeoConfigs();
      const baseRoutes = getBaseRoutes();

      const mergedRoutes = baseRoutes.map(route => {
        const docId = getDocIdFromPath(route.path);
        const savedConfig = configs[docId];

        if (savedConfig) {
          return {
            ...route,
            seo: {
              ...route.seo, // Keep code-defined defaults
              ...savedConfig, // Override with DB values
            }
          };
        }
        return route;
      });

      setRoutes(mergedRoutes);
    } catch (error) {
      console.error("Error loading SEO data:", error);
      toast.error("Error al sincronizar configuraciones SEO");
      // Fallback to base routes if DB fails
      setRoutes(getBaseRoutes());
    } finally {
      setIsLoading(false);
    }
  }, [getBaseRoutes]);

  // Initial Load
  useEffect(() => {
    refreshRoutes();
  }, [refreshRoutes]);

  // 3. Save Handler
  const updateSeo = async (path: string, newSeo: SeoConfig) => {
    setIsSaving(true);
    try {
      // Optimistic Update
      setRoutes(prev => prev.map(r => {
        if (r.path === path) {
          return { ...r, seo: newSeo };
        }
        return r;
      }));

      // Persist
      await saveSeoConfig(path, newSeo);
      
      // Revalidate cache on server
      const response = await revalidateSeoPath(path);
      if (!response.success) {
        console.warn('SEO Revalidation warning:', response.error);
        // We might not want to revert the whole save if just revalidation fails, 
        // but let's at least log it or show a warning toast.
        // If we want to strictly fail: throw new Error(response.error);
      }

      toast.success('Configuración guardada y propagada');
      return true;
    } catch (error) {
      console.error("Error saving SEO:", error);
      toast.error("Error crítico al guardar. Revirtiendo...");
      await refreshRoutes(); // Revert on failure
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    routes,
    isLoading,
    isSaving,
    updateSeo,
    refreshRoutes
  };
}
