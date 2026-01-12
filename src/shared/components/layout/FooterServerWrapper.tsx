import React from 'react';
import Footer from './Footer';
import { getSeasonalThemes, fetchSeasonalConfig, isDateInRange } from '@/lib/seasonal-service';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';

interface ServiceItem {
  name: string;
  slug: string;
}

interface CampaignItem {
  name: string;
  id: string;
}

export default async function FooterServerWrapper() {
  // 1. Obtener Landings de Servicio (Static + DB)
  // Filtramos solo las activas
  let activeServices: ServiceItem[] = [];
  try {
    const services = await ServiceLandingsService.getAll();
    activeServices = services
      .filter(s => s.isActive)
      .map(s => ({ name: s.name, slug: s.slug }));
  } catch (error) {
    console.error('Error fetching services for footer:', error);
    // Fallback vacio o estatico si es necesario
  }

  // 2. Obtener Campañas Activas (Manual o Automatizadas)
  let activeCampaigns: CampaignItem[] = [];
  try {
    const [themes, config] = await Promise.all([
      getSeasonalThemes(),
      fetchSeasonalConfig()
    ]);

    activeCampaigns = themes.filter((theme: SeasonalThemeConfig) => {
      // Excluir standard
      if (theme.id === 'standard') return false;

      // 1. Activación Manual
      if (theme.isActive) return true;

      // 2. Automatización por Fechas
      if (config.automationEnabled && theme.dateRanges && theme.dateRanges.length > 0) {
        return theme.dateRanges.some(range =>
          isDateInRange(new Date(), range.start, range.end)
        );
      }
      return false;
    }).map((c: SeasonalThemeConfig) => ({ name: c.name, id: c.id }));

  } catch (error) {
    console.error('Error fetching campaigns for footer:', error);
  }

  return (
    <Footer 
      services={activeServices} 
      campaigns={activeCampaigns} 
    />
  );
}
