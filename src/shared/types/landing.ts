export interface AnnouncementBarConfig {
  enabled: boolean;
  content: string;
  linkUrl?: string;
  linkText?: string;
  bgColor?: string; // hex code or tailwind class
  textColor?: string;
  closable: boolean;
}

export interface LandingMainConfig {
  heroTitle: string;
  heroSubtitle?: string;
  heroDescription: string;
  heroImage?: string;
  ctaText: string;
  ctaLink: string;
  bubbleImages?: string[];
  announcement?: AnnouncementBarConfig;
}

