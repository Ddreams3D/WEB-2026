'use client';

import React from 'react';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { cn } from '@/lib/utils';
import { useServiceLanding } from '@/features/service-landings/hooks/useServiceLanding';
import { ServiceHero } from './sections/ServiceHero';
import { ServiceFeatures } from './sections/ServiceFeatures';
import { ServiceFocus } from './sections/ServiceFocus';
import { ServiceProcess } from './sections/ServiceProcess';
import { ServiceShowcase } from './sections/ServiceShowcase';
import { ServiceCTA } from './sections/ServiceCTA';
import { ServiceFooter } from './sections/ServiceFooter';

interface ServiceLandingRendererProps {
  config: ServiceLandingConfig;
  isPreview?: boolean;
}

export default function ServiceLandingRenderer({ config, isPreview = false }: ServiceLandingRendererProps) {
  const {
    featuredProducts,
    themeClass,
    primaryColor,
    heroSection,
    featuresSection,
    focusSection,
    processSection
  } = useServiceLanding(config, isPreview);

  // Custom CSS for primary color override
  const style = {
      '--primary-color': primaryColor,
  } as React.CSSProperties;

  // Special overrides for Organic Modeling landing to match "warm/clay" vibe
  if (config.id === 'organic-modeling') {
    // Warm Stone/Earth tones
    // Foreground: Stone 950 (#0c0a09) -> 20 14.3% 4.1%
    // Muted: Stone 500 (#78716c) -> 25 5.3% 44.7%
    // Background: Stone 50 (#fafaf9) -> 60 4.8% 95.9% (Optional, keeps it cleaner if white, but let's warm it slightly)
    
    // We override the HSL variables that Tailwind uses
    (style as any)['--foreground'] = '20 14.3% 10%'; // Warm dark brown/black
    (style as any)['--muted-foreground'] = '25 5.3% 45%'; // Warm gray
    // (style as any)['--background'] = '60 5% 98%'; // Very subtle warm off-white
  }

  // Special overrides for Trophies landing to match "Premium/Gold" vibe
  if (config.id === 'trophies') {
    // Premium Dark Vibe (Slate/Gold) - Forces Dark Mode look while keeping system config
    // We override CSS variables to simulate dark mode on this specific page
    
    // Backgrounds (Slate 950)
    (style as any)['--background'] = '222.2 84% 4.9%';
    (style as any)['--card'] = '222.2 84% 4.9%';
    (style as any)['--popover'] = '222.2 84% 4.9%';
    
    // Foregrounds (Slate 50)
    (style as any)['--foreground'] = '210 40% 98%';
    (style as any)['--card-foreground'] = '210 40% 98%';
    (style as any)['--popover-foreground'] = '210 40% 98%';
    
    // Secondary/Muted elements (Slate 900/800)
    (style as any)['--secondary'] = '217.2 32.6% 17.5%';
    (style as any)['--secondary-foreground'] = '210 40% 98%';
    (style as any)['--muted'] = '217.2 32.6% 17.5%';
    (style as any)['--muted-foreground'] = '215 20.2% 65.1%'; // Lighter gray for readability on dark
    (style as any)['--accent'] = '217.2 32.6% 17.5%';
    (style as any)['--accent-foreground'] = '210 40% 98%';
    
    // Borders (Slate 800)
    (style as any)['--border'] = '217.2 32.6% 17.5%';
    (style as any)['--input'] = '217.2 32.6% 17.5%';
  }

  return (
    <div 
      className={cn("min-h-screen bg-background overflow-x-hidden text-foreground", themeClass)} 
      style={style}
      data-theme={themeClass === 'light' ? 'standard' : undefined}
    >
      
      {/* 1. HERO SECTION */}
      <ServiceHero 
        config={config} 
        heroSection={heroSection} 
        primaryColor={primaryColor} 
      />

      {/* 1.5. FOCUS SECTION (New) */}
      <ServiceFocus 
        focusSection={focusSection} 
        primaryColor={primaryColor} 
      />

      {/* 1.6. PROCESS SECTION (New Cards) */}
      <ServiceProcess 
        processSection={processSection} 
        primaryColor={primaryColor} 
      />

      {/* 2. FEATURES SECTION */}
      <ServiceFeatures 
        featuresSection={featuresSection} 
        primaryColor={primaryColor} 
      />

      {/* 3. PRODUCT SHOWCASE SECTION */}
      <ServiceShowcase 
        config={config} 
        featuredProducts={featuredProducts} 
        isPreview={isPreview} 
      />

      {/* 4. FINAL CTA */}
      <ServiceCTA 
        primaryColor={primaryColor} 
        isPreview={isPreview} 
      />

      {/* 5. MINIMAL FOOTER */}
      <ServiceFooter 
        primaryColor={primaryColor} 
        isPreview={isPreview} 
      />
    </div>
  );
}
