'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientInfoProps {
  client?: {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
}

export function QuoteClientInfo({ client }: ClientInfoProps) {
  if (!client) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold">{client.name}</p>
        <p>{client.company}</p>
        <p className="text-sm text-muted-foreground">{client.email}</p>
        <p className="text-sm text-muted-foreground">{client.phone}</p>
      </CardContent>
    </Card>
  );
}
