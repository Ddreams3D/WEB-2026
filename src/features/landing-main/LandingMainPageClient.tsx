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
import { saveLandingMain } from '@/services/landing.service';
import { toast } from 'sonner';

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
  const [config, setConfig] = useState<LandingMainConfig | null>(initialConfig);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { isAdmin } = useAdminPermissions();

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const themeClass = config?.themeMode === 'dark' ? 'dark' : config?.themeMode === 'light' ? 'light' : '';

  const effectiveBubbleImages = useMemo(() => {
    const fromConfig = config?.bubbleImages?.filter(Boolean) || [];
    if (fromConfig.length > 0) return fromConfig;
    return bubbleImages;
  }, [config, bubbleImages]);

  const initialData: UnifiedLandingData | null = useMemo(() => {
    if (!config) return null;
    const unified = mainToUnified(config);
    unified.bubbles = effectiveBubbleImages;
    return unified;
  }, [config, effectiveBubbleImages]);

  const handleSave = async (data: UnifiedLandingData) => {
    if (!config) return;
    try {
      setIsSaving(true);
      const newConfig = unifiedToMain(data);
      await saveLandingMain(newConfig);
      setConfig(newConfig);
      toast.success('Landing principal actualizada correctamente');
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
      >
        <HeroSection initialConfig={config} bubbleImages={effectiveBubbleImages} />
        <BenefitsSection />
        <FeaturedProductsSection featuredProducts={featuredProducts} />
        <ServicesPreviewSection services={services} />
        <TestimonialsSection />
        <FAQSection />
        <CallToActionSection />
        <LandingFooter />
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
    </>
  );
}
