'use client';

import { useState } from 'react';
import { QuoterForm } from './components/QuoterForm';
import { QuoterResults } from './components/QuoterResults';
import { useFinanceSettings } from '../finances/hooks/useFinanceSettings';

export function QuoterView() {
  const { settings } = useFinanceSettings();
  const [quoteData, setQuoteData] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
      <div className="lg:col-span-5">
        <QuoterForm onCalculate={setQuoteData} settings={settings} />
      </div>
      <div className="lg:col-span-7 lg:sticky lg:top-4 transition-all duration-300">
        {quoteData ? (
          <QuoterResults data={quoteData} settings={settings} />
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/30 text-muted-foreground text-sm gap-2 animate-in fade-in-50">
            <span className="text-4xl">🖨️</span>
            <p>Configura las máquinas y materiales para ver el análisis de costos</p>
          </div>
        )}
      </div>
    </div>
  );
}
