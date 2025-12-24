'use client';

import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { MarketplaceProvider } from './MarketplaceContext';
import { AuthMockProvider } from './AuthMockContext';
import { B2BProvider } from './B2BContext';
import { OrderTrackingProvider } from './OrderTrackingContext';
import { BillingProvider } from './BillingContext';
import { QuoteProvider } from './QuoteContext';
import { LegalProvider } from './LegalContext';
import { ToastProvider } from '../components/ui/ToastManager';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthMockProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <B2BProvider>
              <OrderTrackingProvider>
                <BillingProvider>
                  <QuoteProvider>
                    <LegalProvider>
                      <MarketplaceProvider>
                        <CartProvider>
                          {children}
                        </CartProvider>
                      </MarketplaceProvider>
                    </LegalProvider>
                  </QuoteProvider>
                </BillingProvider>
              </OrderTrackingProvider>
            </B2BProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthMockProvider>
  );
}
