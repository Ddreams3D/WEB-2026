'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteItemDetail } from '../../types';

export function QuoteItemsList({ items }: { items: QuoteItemDetail[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Items de la Cotización</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between">
                <span className="font-semibold">{item.name}</span>
                <span>S/ {item.totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="text-sm mt-1">
                Cant: {item.quantity} | Material: {item.material}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
