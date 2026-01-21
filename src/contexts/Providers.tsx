'use client';

import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { OrderTrackingProvider } from './OrderTrackingContext';
import { QuoteProvider } from './QuoteContext';
import { FavoritesProvider } from './FavoritesContext';
import { NotificationProvider } from './NotificationContext';
import { ToastProvider } from '../components/ui/ToastManager';
import { SeasonalThemeController } from '@/components/seasonal/SeasonalThemeController';
import { WhatsAppController } from '@/components/whatsapp/WhatsAppController';

interface ProvidersProps {
  children: React.ReactNode;
}

export function CoreProviders({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <AuthProvider>
        <OrderTrackingProvider>
          <QuoteProvider>
              <FavoritesProvider>
                <CartProvider>
                  <NotificationProvider>
                    {children}
                  </NotificationProvider>
                </CartProvider>
              </FavoritesProvider>
            </QuoteProvider>
        </OrderTrackingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export function MainAppProviders({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SeasonalThemeController />
      <WhatsAppController />
      <CoreProviders>
        {children}
      </CoreProviders>
    </ThemeProvider>
  );
}

// Deprecated: Use MainAppProviders instead
export { MainAppProviders as Providers };
