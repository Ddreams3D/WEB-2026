'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent, AnalyticsEvents, AnalyticsCategories } from '@/lib/analytics';

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      trackEvent(AnalyticsEvents.ROUTE_CHANGE, {
        category: AnalyticsCategories.NAVIGATION,
        path: pathname,
        search_params: searchParams?.toString() || '',
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
