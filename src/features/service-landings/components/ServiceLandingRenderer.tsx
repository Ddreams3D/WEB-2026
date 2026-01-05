'use client';

import React from 'react';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { cn } from '@/lib/utils';
import { useServiceLanding } from '@/features/service-landings/hooks/useServiceLanding';
import { ServiceHero } from './sections/ServiceHero';
import { ServiceFeatures } from './sections/ServiceFeatures';
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
    featuresSection
  } = useServiceLanding(config, isPreview);

  // Custom CSS for primary color override
  const style = {
      '--primary-color': primaryColor,
  } as React.CSSProperties;

  return (
    <div className={cn("min-h-screen bg-background overflow-x-hidden text-foreground", themeClass)} style={style}>
      
      {/* 1. HERO SECTION */}
      <ServiceHero 
        config={config} 
        heroSection={heroSection} 
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
