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
    
    // --- VISUAL CUSTOMIZATION ---
    primaryColor?: string; // Custom override color (Hex)
    secondaryColor?: string; // NEW: Secondary accent color
    backgroundColor?: string; // NEW: Page background override
    
    // Typography
    fontFamilyHeading?: 'inter' | 'playfair' | 'montserrat' | 'oswald'; // NEW
    fontFamilyBody?: 'inter' | 'roboto' | 'open-sans'; // NEW
    
    // UI Elements
    buttonStyle?: 'rounded' | 'pill' | 'square'; // NEW
    
    // Background Effects
    patternOverlay?: 'none' | 'dots' | 'grid' | 'noise'; // NEW
    
    heroTitle: string;
    heroSubtitle?: string;
    heroDescription: string;
    heroImage?: string; // Path to image (Primary)
    heroImages?: string[]; // Multiple images for slider/carousel
    heroVideo?: string; // Optional background video
    
    // Visual Elements
    bubbleImages?: string[]; // Floating bubbles images
    
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
  
  // Architecture Decoupling:
  // If true, this campaign will override the global website theme (colors, fonts).
  // If false, the campaign content is active (landing, products) but the site keeps its standard look.
  applyThemeToGlobal?: boolean;
}

export interface SeasonalSystemConfig {
  automationEnabled: boolean;
}
