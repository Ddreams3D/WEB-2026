'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export function QuoteCreate({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="text-center py-10">
      <p>Componente de creación de cotización (Simplificado)</p>
      <Button onClick={() => setActiveTab('list')} className="mt-4">
        Volver a la lista
      </Button>
    </div>
  );
}
