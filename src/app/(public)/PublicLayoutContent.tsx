import React from 'react';
import Navbar from '@/components/layout/Navbar';
import FooterServerWrapper from '@/shared/components/layout/FooterServerWrapper';
import WhatsAppFloatingButton from '@/shared/components/layout/WhatsAppFloatingButton';
import PageTransition from '@/shared/components/ui/PageTransition';
import { fetchLandingMain } from '@/services/landing.service';
import { resolveActiveTheme } from '@/lib/seasonal-service';
import AnnouncementBar from '@/shared/components/layout/AnnouncementBar';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { CookieBanner } from '@/components/ui';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';

export async function PublicLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [landingConfig, activeTheme] = await Promise.all([
    fetchLandingMain().catch(() => null),
    resolveActiveTheme().catch(() => null)
  ]);

  return (
    <>
      <ThemeScript />
      <AnalyticsTracker />
      <div 
        id="public-layout-root" 
        className="flex min-h-screen flex-col w-full bg-background pb-16 lg:pb-0"
        suppressHydrationWarning
      >
        <AnnouncementBar config={landingConfig?.announcement} seasonalConfig={activeTheme} />
        <Navbar />
        <main className="flex-1 flex flex-col w-full relative">
          <PageTransition>{children}</PageTransition>
        </main>
        <FooterServerWrapper />
        <WhatsAppFloatingButton />
        <CookieBanner />
      </div>
    </>
  );
}
