'use client';

import React from 'react';
import { QuoteDetail } from '../../types';
import { Badge } from '@/components/ui/badge';

export function QuoteDetailHeader({ quote }: { quote: QuoteDetail }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{quote.title}</h1>
        <p className="text-muted-foreground">{quote.number}</p>
      </div>
      <Badge>{quote.status}</Badge>
    </div>
  );
}
