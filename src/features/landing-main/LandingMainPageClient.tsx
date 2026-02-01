'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { LandingMainConfig } from '@/shared/types/landing';
import { CatalogItem } from '@/shared/types/catalog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdminPermissions } from '@/features/admin/hooks/useAdminProtection';
import { UniversalLandingEditor } from '@/features/admin/components/universal-landing/UniversalLandingEditor';
import { mainToUnified, unifiedToMain } from '@/features/admin/components/universal-landing/adapters';
import { UnifiedLandingData } from '@/features/admin/components/universal-landing/types';
import { saveCityLanding } from '@/services/landing.service';
import { toast } from 'sonner';

import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/BenefitsSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { ServicesPreviewSection } from './components/ServicesPreviewSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { CallToActionSection } from './components/CallToActionSection';
import { LandingFooter } from './components/LandingFooter';
import WhatsAppFloatingButton from '@/shared/components/layout/WhatsAppFloatingButton';

interface LandingMainPageClientProps {
  initialConfig: LandingMainConfig | null;
  featuredProducts: CatalogItem[];
  services: CatalogItem[];
  bubbleImages: string[];
  whatsappMessage?: string;
  cityId?: string;
}

export default function LandingMainPageClient({
  initialConfig,
  featuredProducts,
  services,
  bubbleImages,
  whatsappMessage,
  cityId = 'main'
}: LandingMainPageClientProps) {
  const [config, setConfig] = useState<LandingMainConfig | null>(initialConfig);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { isAdmin } = useAdminPermissions();

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  // Helper to convert hex to RGB triplet for Tailwind variables
  const hexToRgb = (hex: string): string | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` 
      : null;
  };

  const themeClass = config?.themeMode === 'dark' ? 'dark' : config?.themeMode === 'light' ? 'light' : '';
  
  const primaryRgb = useMemo(() => {
    return hexToRgb(config?.primaryColor || '') || null; // Use config color or fallback to default theme
  }, [config?.primaryColor]);

  const style = {
      '--primary-color': config?.primaryColor,
      ...(primaryRgb ? {
        '--primary': primaryRgb,
        '--primary-500': primaryRgb,
        '--primary-600': primaryRgb, // Prevent teal flash
        '--ring': primaryRgb,
      } : {})
  } as React.CSSProperties;

  const effectiveBubbleImages = useMemo(() => {
    const fromConfig = config?.bubbleImages?.filter(Boolean) || [];
    if (fromConfig.length > 0) return fromConfig;
    return bubbleImages;
  }, [config, bubbleImages]);

  const initialData: UnifiedLandingData | null = useMemo(() => {
    if (!config) return null;
    const unified = mainToUnified(config);
    unified.slug = cityId; // Explicitly set slug from prop
    unified.bubbles = effectiveBubbleImages;
    return unified;
  }, [config, effectiveBubbleImages, cityId]);

  const handleSave = async (data: UnifiedLandingData) => {
    if (!config) return;
    try {
      setIsSaving(true);
      const newConfig = unifiedToMain(data);
      await saveCityLanding(cityId, newConfig);
      setConfig(newConfig);
      toast.success(`Landing ${cityId === 'main' ? 'Principal' : cityId} actualizada correctamente`);
      setIsEditing(false);
    } catch (error: any) {
      const message = error?.message || 'No se pudo guardar la landing principal';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div 
        className={cn("min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20", themeClass)}
        data-theme={themeClass === 'light' ? 'standard' : undefined}
        style={style}
      >
        <HeroSection initialConfig={config} bubbleImages={effectiveBubbleImages} />
        <BenefitsSection />
        <FeaturedProductsSection featuredProducts={featuredProducts} />
        <ServicesPreviewSection services={services} />
        <TestimonialsSection />
        <FAQSection />
        <CallToActionSection whatsappMessage={whatsappMessage} />
        <LandingFooter cityId={cityId} />
      </div>

      {isAdmin && initialData && (
        <UniversalLandingEditor
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          initialData={initialData}
          isSaving={isSaving}
        />
      )}

      {isAdmin && config && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            size="sm"
            className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsEditing(true)}
            disabled={isSaving}
          >
            Editar landing principal
          </Button>
        </div>
      )}
      <WhatsAppFloatingButton message={whatsappMessage} />
    </>
  );
}
