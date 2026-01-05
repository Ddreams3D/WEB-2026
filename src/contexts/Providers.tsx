'use client';

import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { OrderTrackingProvider } from './OrderTrackingContext';
import { BillingProvider } from './BillingContext';
import { QuoteProvider } from './QuoteContext';
import { FavoritesProvider } from './FavoritesContext';
import { NotificationProvider } from './NotificationContext';
import { ToastProvider } from '../components/ui/ToastManager';
import { SeasonalThemeController } from '@/components/seasonal/SeasonalThemeController';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SeasonalThemeController />
      <ToastProvider>
        <AuthProvider>
          <OrderTrackingProvider>
            <BillingProvider>
              <QuoteProvider>
                <FavoritesProvider>
                  <CartProvider>
                    <NotificationProvider>
                      {children}
                    </NotificationProvider>
                  </CartProvider>
                </FavoritesProvider>
              </QuoteProvider>
            </BillingProvider>
          </OrderTrackingProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
