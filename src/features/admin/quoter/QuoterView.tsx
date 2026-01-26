'use client';

import { useState } from 'react';
import { QuoterForm } from './components/QuoterForm';
import { QuoterResults } from './components/QuoterResults';
import { useFinanceSettings } from '../finances/hooks/useFinanceSettings';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { QuoteHistorySheet } from './components/QuoteHistorySheet';

export function QuoterView() {
  const { settings } = useFinanceSettings();
  const [quoteData, setQuoteData] = useState<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold tracking-tight">Cotizador 3D</h2>
            <p className="text-muted-foreground text-sm">Calcula costos y precios de venta</p>
         </div>
         <Button variant="outline" onClick={() => setIsHistoryOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            Historial
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
        <div className="lg:col-span-5">
          <QuoterForm onCalculate={setQuoteData} settings={settings} />
        </div>
        <div className="lg:col-span-7 lg:sticky lg:top-4 transition-all duration-300">
          {quoteData ? (
            <QuoterResults 
              data={quoteData} 
              settings={settings} 
              onOpenHistory={() => setIsHistoryOpen(true)}
            />
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/30 text-muted-foreground text-sm gap-2 animate-in fade-in-50">
              <span className="text-4xl">🖨️</span>
              <p>Configura las máquinas y materiales para ver el análisis de costos</p>
            </div>
          )}
        </div>
      </div>

      <QuoteHistorySheet isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
}
