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
  return {
    type: 'main',
    heroTitle: main.heroTitle,
    heroSubtitle: main.heroSubtitle,
    heroDescription: main.heroDescription,
    heroImage: main.heroImage,
    
    ctaText: main.ctaText,
    ctaLink: main.ctaLink,
    
    themeMode: main.themeMode || 'system',
    
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
    themeMode: data.themeMode
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
    heroDescription: heroSection?.subtitle, // Mapped to subtitle as description doesn't exist
    heroImage: service.heroImage || heroSection?.image,
    
    ctaText: heroSection?.content, // Mapping content to ctaText based on usage
    ctaLink: '', 

    
    themeMode: service.themeMode,
    primaryColor: service.primaryColor,
    
    sections: service.sections,
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
      subtitle: data.heroDescription, // Map unified description to service subtitle
      content: data.ctaText, // Map unified ctaText to service content
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
    sections: sections,
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || ''
  };
}
