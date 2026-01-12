'use client';

import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { cn } from '@/lib/utils';
import { useSeasonalLanding } from '@/features/seasonal/hooks/useSeasonalLanding';
import { SeasonalHero } from '@/features/seasonal/components/landing/SeasonalHero';
import { SeasonalBenefits } from '@/features/seasonal/components/landing/SeasonalBenefits';
import { SeasonalProductShowcase } from '@/features/seasonal/components/landing/SeasonalProductShowcase';
import { SeasonalTestimonials } from '@/features/seasonal/components/landing/SeasonalTestimonials';
import { SeasonalFooter } from '@/features/seasonal/components/landing/SeasonalFooter';

interface SeasonalLandingProps {
  config: SeasonalThemeConfig;
}

export default function SeasonalLanding({ config }: SeasonalLandingProps) {
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
  } = useSeasonalLanding(config);

  // Determine theme class override
  const themeClass = config.landing.themeMode === 'dark' ? 'dark' : config.landing.themeMode === 'light' ? 'light' : '';

  return (
    <div className={cn("min-h-screen bg-background overflow-x-hidden text-foreground", themeClass)} data-theme={config.themeId}>
      {/* Background with Theme Colors */}
      <div className={cn("fixed inset-0 pointer-events-none transition-colors duration-700", themeStyles.previewColors[0], "opacity-[0.03] dark:opacity-[0.05]")} />
      
      <SeasonalHero 
        config={config}
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
        config={config}
        isValentines={isValentines}
        isMothersDay={isMothersDay}
        isHalloween={isHalloween}
        deadline={getDeadline()}
      />

      <SeasonalProductShowcase 
        config={config}
        isHalloween={isHalloween}
        featuredProducts={featuredProducts}
      />

      <SeasonalTestimonials isHalloween={isHalloween} />

      <SeasonalFooter config={config} isHalloween={isHalloween} />
    </div>
  );
}
