import { LandingMainConfig } from '@/shared/types/landing';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { ServiceLandingConfig, ServiceLandingSection } from '@/shared/types/service-landing';
import { UnifiedLandingData } from './types';

// --- CAMPAIGN ADAPTERS ---

export function campaignToUnified(campaign: SeasonalThemeConfig): UnifiedLandingData {
  return {
    type: 'campaign',
    id: campaign.id,
    internalName: campaign.name,
    isActive: campaign.isActive,
    
    heroTitle: campaign.landing.heroTitle,
    heroSubtitle: campaign.landing.heroSubtitle,
    heroDescription: campaign.landing.heroDescription,
    heroImage: campaign.landing.heroImage,
    heroImages: campaign.landing.heroImages,
    heroVideo: campaign.landing.heroVideo,
    
    ctaText: campaign.landing.ctaText,
    ctaLink: campaign.landing.ctaLink,
    
    themeMode: campaign.landing.themeMode || 'system',
    
    campaignDates: campaign.dateRanges,
    campaignThemeId: campaign.themeId,
    announcement: campaign.announcement,
    
    _originalCampaign: campaign
  };
}

export function unifiedToCampaign(data: UnifiedLandingData): Partial<SeasonalThemeConfig> {
  if (!data._originalCampaign) return {};
  
  return {
    ...data._originalCampaign,
    name: data.internalName || data._originalCampaign.name,
    isActive: data.isActive,
    dateRanges: data.campaignDates || [],
    themeId: (data.campaignThemeId as any) || data._originalCampaign.themeId,
    announcement: data.announcement,
    landing: {
      ...data._originalCampaign.landing,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      heroDescription: data.heroDescription || '',
      heroImage: data.heroImage,
      heroImages: data.heroImages,
      heroVideo: data.heroVideo,
      ctaText: data.ctaText || '',
      ctaLink: data.ctaLink || '',
      themeMode: data.themeMode
    }
  };
}

// --- MAIN LANDING ADAPTERS ---

export function mainToUnified(main: LandingMainConfig): UnifiedLandingData {
  // CORRECCIÓN DE SINCRONIZACIÓN:
  // La DB tiene datos antiguos ("Impresión 3D en Arequipa" como título) que no coinciden con la Web real.
  // Forzamos la "Verdad Visual" de la landing si detectamos datos inconsistentes o vacíos.
    
    const visualDefaults = {
      title: 'Tu imaginación\nno tiene límites.\nNosotros\nle damos forma.',
      subtitle: 'Impresión 3D en Arequipa',
      description: 'Impresión 3D personalizada en Arequipa. Diseñamos y fabricamos piezas únicas a partir de tu idea.',
      cta: 'Cotiza tu idea',
      link: '/cotizaciones'
    };

    // Si el título guardado es el badge ("Impresión 3D en Arequipa"), lo movemos a subtítulo y restauramos el título real.
    // También detectamos el formato antiguo de título (2 o 3 líneas) para actualizarlo al nuevo (4 líneas).
    const hasLegacyTitle = main.heroTitle === 'Impresión 3D en Arequipa';
    const hasOldMultilineFormat = main.heroTitle?.includes('Tu imaginación') && !main.heroTitle?.includes('Nosotros\nle damos forma');
    
    const shouldUseDefaults = hasLegacyTitle || hasOldMultilineFormat || !main.heroTitle;
    
    return {
      type: 'main',
      // Si hay datos legacy o no hay título, usar el default visual. Si hay otro dato (edición usuario), respetarlo.
      heroTitle: shouldUseDefaults ? visualDefaults.title : main.heroTitle,
      
      // Si era legacy, el título antiguo pasa a ser subtítulo/gancho. Si no, usar lo que haya o el default.
      heroSubtitle: hasLegacyTitle ? visualDefaults.subtitle : (main.heroSubtitle || visualDefaults.subtitle),
      
      heroDescription: main.heroDescription || visualDefaults.description,
    heroImage: main.heroImage,
    
    ctaText: main.ctaText || visualDefaults.cta,
    ctaLink: main.ctaLink || visualDefaults.link,
    
    themeMode: main.themeMode || 'system',
    primaryColor: main.primaryColor,
    
    bubbles: main.bubbleImages,
    announcement: main.announcement,
    
    _originalMain: main
  };
}

export function unifiedToMain(data: UnifiedLandingData): LandingMainConfig {
  return {
    heroTitle: data.heroTitle,
    heroSubtitle: data.heroSubtitle,
    heroDescription: data.heroDescription || '',
    heroImage: data.heroImage,
    ctaText: data.ctaText || '',
    ctaLink: data.ctaLink || '',
    bubbleImages: data.bubbles,
    announcement: data.announcement,
    themeMode: data.themeMode,
    primaryColor: data.primaryColor
  };
}

// --- SERVICE LANDING ADAPTERS ---

export function serviceToUnified(service: ServiceLandingConfig): UnifiedLandingData {
  // Find hero section to extract common fields
  const heroSection = service.sections.find(s => s.type === 'hero');
  
  return {
    type: 'service',
    id: service.id,
    internalName: service.name,
    slug: service.slug,
    isActive: service.isActive,
    
    heroTitle: heroSection?.title || 'Nuevo Servicio',
    heroSubtitle: heroSection?.subtitle,
    heroDescription: heroSection?.content, // Correctly mapped to content (long description)
    heroImage: service.heroImage || heroSection?.image,
    heroImageComparison: service.heroImageComparison,
    
    ctaText: 'Explorar Servicio',
    ctaLink: '', 


    
    themeMode: service.themeMode,
    primaryColor: service.primaryColor,
    
    sections: service.sections,
    featuredTag: service.featuredTag,
    metaTitle: service.metaTitle,
    metaDescription: service.metaDescription,
    
    _originalService: service
  };
}

export function unifiedToService(data: UnifiedLandingData): ServiceLandingConfig {
  if (!data._originalService) throw new Error("Original service data missing");

  // Update hero section within sections array
  const sections = [...(data.sections || [])];
  const heroIndex = sections.findIndex(s => s.type === 'hero');
  
  if (heroIndex >= 0) {
    sections[heroIndex] = {
      ...sections[heroIndex],
      title: data.heroTitle,
      subtitle: data.heroSubtitle,
      content: data.heroDescription,
      image: data.heroImage // Sync hero image
    };
  }

  return {
    ...data._originalService,
    name: data.internalName || '',
    slug: data.slug || '',
    isActive: data.isActive || false,
    themeMode: data.themeMode,
    primaryColor: data.primaryColor,
    heroImage: data.heroImage,
    heroImageComparison: data.heroImageComparison,
    sections,
    featuredTag: data.featuredTag,
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || ''
  };
}
