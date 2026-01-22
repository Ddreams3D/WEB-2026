import { AnnouncementBarConfig, LandingMainConfig } from '@/shared/types/landing';
import { DateRange, SeasonalThemeConfig } from '@/shared/types/seasonal';
import { ServiceLandingConfig, ServiceLandingSection } from '@/shared/types/service-landing';

export type LandingType = 'campaign' | 'main' | 'service';

export interface UnifiedLandingData {
  // Metadata
  id?: string;
  type: LandingType;
  internalName?: string;
  isActive?: boolean;
  
  // URL / Routing
  slug?: string; // For services
  
  // Hero Section (Standardized)
  heroTitle: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroImageComparison?: string;
  heroImages?: string[]; // Campaign supports multiple
  heroVideo?: string;
  
  // CTA
  ctaText?: string;
  ctaLink?: string;
  
  // Visuals
  themeMode: 'light' | 'dark' | 'system';
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  fontFamilyHeading?: 'inter' | 'playfair' | 'montserrat' | 'oswald';
  fontFamilyBody?: 'inter' | 'roboto' | 'open-sans';
  buttonStyle?: 'rounded' | 'pill' | 'square';
  patternOverlay?: 'none' | 'dots' | 'grid' | 'noise';
  
  // Campaign Specifics
  campaignDates?: DateRange[];
  campaignThemeId?: string;
  applyThemeToGlobal?: boolean; // New flag for architecture decoupling
  
  // Main Specifics
  bubbles?: string[];
  
  // Announcement (Campaign & Main)
  announcement?: AnnouncementBarConfig;
  
  // Service Specifics
  sections?: ServiceLandingSection[];
  featuredTag?: string;
  metaTitle?: string;
  metaDescription?: string;
  
  // Original Objects (for restoration/saving if needed)
  _originalCampaign?: SeasonalThemeConfig;
  _originalMain?: LandingMainConfig;
  _originalService?: ServiceLandingConfig;
}
