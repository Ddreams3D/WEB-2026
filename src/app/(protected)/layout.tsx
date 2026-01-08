import React from 'react';
import { MainAppProviders } from '@/contexts/Providers';
import { ThemeScript } from '@/components/theme/ThemeScript';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainAppProviders>
      <ThemeScript />
      {children}
    </MainAppProviders>
  );
}
