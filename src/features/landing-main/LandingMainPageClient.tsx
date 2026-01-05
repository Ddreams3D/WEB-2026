'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { LandingMainConfig } from '@/shared/types/landing';
import { CatalogItem } from '@/shared/types/catalog';
import { cn } from '@/lib/utils';

// Components
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/BenefitsSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { ServicesPreviewSection } from './components/ServicesPreviewSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { CallToActionSection } from './components/CallToActionSection';
import { LandingFooter } from './components/LandingFooter';

interface LandingMainPageClientProps {
  initialConfig: LandingMainConfig | null;
  featuredProducts: CatalogItem[];
  services: CatalogItem[];
  bubbleImages: string[];
}

export default function LandingMainPageClient({
  initialConfig,
  featuredProducts,
  services,
  bubbleImages
}: LandingMainPageClientProps) {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  // Force Standard Theme for this specific landing page
  useEffect(() => {
    if (pathname === '/impresion-3d-arequipa') {
      setTheme('standard');
    }
  }, [setTheme, pathname]);

  // Determine theme class override
  const themeClass = initialConfig?.themeMode === 'dark' ? 'dark' : initialConfig?.themeMode === 'light' ? 'light' : '';

  return (
    <div className={cn("min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20", themeClass)}>
      
      {/* 1. HERO SECTION */}
      <HeroSection initialConfig={initialConfig} bubbleImages={bubbleImages} />

      {/* 2. BENEFITS SECTION */}
      <BenefitsSection />

      {/* 3. FEATURED PRODUCTS */}
      <FeaturedProductsSection featuredProducts={featuredProducts} />

      {/* 4. SERVICES PREVIEW */}
      <ServicesPreviewSection services={services} />

      {/* 5. LOCAL SOCIAL PROOF (Testimonials) */}
      <TestimonialsSection />

      {/* 6. FAQ Section */}
      <FAQSection />

      {/* 7. FINAL CTA */}
      <CallToActionSection />

      {/* 8. FOOTER */}
      <LandingFooter />
    </div>
  );
}
