'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteDetail } from '../../types';

export function QuoteFinancials({ quote }: { quote: QuoteDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen Financiero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>S/ {(quote.subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>IGV (18%):</span>
          <span>S/ {(quote.tax || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total:</span>
          <span>S/ {(quote.total || 0).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
