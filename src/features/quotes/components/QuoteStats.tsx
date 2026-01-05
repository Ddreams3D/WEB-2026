'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from '../types';

interface QuoteStatsProps {
  quotes: Quote[];
}

export function QuoteStats({ quotes }: QuoteStatsProps) {
  const total = quotes.length;
  const pending = quotes.filter(q => q.status === 'pending').length;
  const approved = quotes.filter(q => q.status === 'approved').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cotizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pending}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approved}</div>
        </CardContent>
      </Card>
    </div>
  );
}
