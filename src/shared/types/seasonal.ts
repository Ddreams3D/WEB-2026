import { Theme } from '@/contexts/ThemeContext';
import { AnnouncementBarConfig } from './landing';

export interface DateRange {
  start: { month: number; day: number }; // 1-12, 1-31
  end: { month: number; day: number };
}

export interface SeasonalThemeConfig {
  id: string;
  themeId: Theme; // 'halloween', 'festive-warm', etc.
  name: string;
  
  // Activation Rules
  dateRanges: DateRange[];
  
  // Landing Page Content
  landing: {
    themeMode?: 'system' | 'light' | 'dark';
    heroTitle: string;
    heroSubtitle?: string;
    heroDescription: string;
    heroImage?: string; // Path to image (Primary)
    heroImages?: string[]; // Multiple images for slider/carousel
    heroVideo?: string; // Optional background video
    
    // Call to Action
    ctaText: string;
    ctaLink: string;
    
    // Product Highlighting
    featuredTag: string; // Tag to filter catalog products
    featuredTitle?: string; // Title for the featured section (e.g. "Regalos de Navidad")
  };
  
  // Announcement Bar Override for this Season
  announcement?: AnnouncementBarConfig;

  // Manual override (useful for testing or forced events)
  isActive?: boolean; 
}
