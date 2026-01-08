import React from 'react';
import { CoreProviders } from '@/contexts/Providers';
import { CookieBanner } from '@/components/ui';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CoreProviders>
      <AnalyticsTracker />
      {children}
      <CookieBanner />
    </CoreProviders>
  );
}
