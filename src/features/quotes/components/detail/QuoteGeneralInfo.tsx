'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteDetail } from '../../types';

export function QuoteGeneralInfo({ quote }: { quote: QuoteDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{quote.description}</p>
      </CardContent>
    </Card>
  );
}
