import { Metadata } from 'next';
import { CoreProviders } from '@/contexts/Providers';
import { CookieBanner } from '@/components/ui';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CoreProviders>
      <AnalyticsTracker />
      {children}
      <CookieBanner />
    </CoreProviders>
  );
}
