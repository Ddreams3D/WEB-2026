'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteDetail } from '../../types';

export function QuoteNotes({ quote }: { quote: QuoteDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{quote.notes || 'Sin notas adicionales.'}</p>
      </CardContent>
    </Card>
  );
}
