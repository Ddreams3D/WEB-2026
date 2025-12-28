'use client';

import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { MarketplaceProvider } from './MarketplaceContext';
import { OrderTrackingProvider } from './OrderTrackingContext';
import { BillingProvider } from './BillingContext';
import { QuoteProvider } from './QuoteContext';
import { ToastProvider } from '../components/ui/ToastManager';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <OrderTrackingProvider>
            <BillingProvider>
              <QuoteProvider>
                  <MarketplaceProvider>
                    <CartProvider>
                      {children}
                    </CartProvider>
                  </MarketplaceProvider>
              </QuoteProvider>
            </BillingProvider>
          </OrderTrackingProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
