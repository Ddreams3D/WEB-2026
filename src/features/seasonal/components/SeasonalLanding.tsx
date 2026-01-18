'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { cn } from '@/lib/utils';
import { useSeasonalLanding } from '@/features/seasonal/hooks/useSeasonalLanding';
import { SeasonalHero } from '@/features/seasonal/components/landing/SeasonalHero';
import { SeasonalBenefits } from '@/features/seasonal/components/landing/SeasonalBenefits';
import { SeasonalProductShowcase } from '@/features/seasonal/components/landing/SeasonalProductShowcase';
import { SeasonalTestimonials } from '@/features/seasonal/components/landing/SeasonalTestimonials';
import { SeasonalFooter } from '@/features/seasonal/components/landing/SeasonalFooter';
import { useAdminPermissions } from '@/features/admin/hooks/useAdminProtection';
import { UniversalLandingEditor } from '@/features/admin/components/universal-landing/UniversalLandingEditor';
import { campaignToUnified, unifiedToCampaign } from '@/features/admin/components/universal-landing/adapters';
import { UnifiedLandingData } from '@/features/admin/components/universal-landing/types';
import { saveSeasonalTheme } from '@/lib/seasonal-service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SeasonalLandingProps {
  config: SeasonalThemeConfig;
}

export default function SeasonalLanding({ config }: SeasonalLandingProps) {
  const [currentConfig, setCurrentConfig] = useState<SeasonalThemeConfig>(config);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { isAdmin } = useAdminPermissions();

  useEffect(() => {
    setCurrentConfig(config);
  }, [config]);

  const {
    featuredProducts,
    mounted,
    textEffectTriggered,
    themeStyles,
    isValentines,
    isMothersDay,
    isHalloween,
    isChristmas,
    logoColor,
    handleExorcise,
    getDeadline
  } = useSeasonalLanding(currentConfig);

  const themeClass =
    currentConfig.landing.themeMode === 'dark'
      ? 'dark'
      : currentConfig.landing.themeMode === 'light'
        ? 'light'
        : '';

  const initialData: UnifiedLandingData = useMemo(() => {
    return campaignToUnified(currentConfig);
  }, [currentConfig]);

  const handleSave = async (data: UnifiedLandingData) => {
    try {
      setIsSaving(true);
      const updates = unifiedToCampaign(data);
      const updatedTheme: SeasonalThemeConfig = { ...currentConfig, ...updates };
      await saveSeasonalTheme(updatedTheme);
      setCurrentConfig(updatedTheme);
      toast.success('Campaña actualizada correctamente');
      setIsEditing(false);
    } catch (error: any) {
      const message = error?.message || 'No se pudo guardar la campaña';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        className={cn('min-h-screen bg-background overflow-x-hidden text-foreground', themeClass)}
        data-theme={currentConfig.themeId}
      >
        <div
          className={cn(
            'fixed inset-0 pointer-events-none transition-colors duration-700',
            themeStyles.previewColors[0],
            'opacity-[0.03] dark:opacity-[0.05]'
          )}
        />

        <SeasonalHero
          config={currentConfig}
          isHalloween={isHalloween}
          isValentines={isValentines}
          isMothersDay={isMothersDay}
          isChristmas={isChristmas}
          mounted={mounted}
          themeStyles={themeStyles}
          logoColor={logoColor}
          textEffectTriggered={textEffectTriggered}
          handleExorcise={handleExorcise}
        />

        <SeasonalBenefits
          config={currentConfig}
          isValentines={isValentines}
          isMothersDay={isMothersDay}
          isHalloween={isHalloween}
          deadline={getDeadline()}
        />

        <SeasonalProductShowcase
          config={currentConfig}
          isHalloween={isHalloween}
          featuredProducts={featuredProducts}
        />

        <SeasonalTestimonials isHalloween={isHalloween} />

        <SeasonalFooter config={currentConfig} isHalloween={isHalloween} />
      </div>

      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            size="sm"
            className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsEditing(true)}
            disabled={isSaving}
          >
            Editar campaña
          </Button>
        </div>
      )}

      {isAdmin && (
        <UniversalLandingEditor
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          initialData={initialData}
          isSaving={isSaving}
        />
      )}
    </>
  );
}
