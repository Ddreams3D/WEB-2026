'use client';

import { useState } from 'react';
import { QuoterForm } from './components/QuoterForm';
import { QuoterResults } from './components/QuoterResults';
import { useFinanceSettings } from '../finances/hooks/useFinanceSettings';

export function QuoterView() {
  const { settings } = useFinanceSettings();
  const [quoteData, setQuoteData] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5">
        <QuoterForm onCalculate={setQuoteData} settings={settings} />
      </div>
      <div className="lg:col-span-7">
        {quoteData ? (
          <QuoterResults data={quoteData} settings={settings} />
        ) : (
          <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-xl bg-muted/50 text-muted-foreground text-sm">
            Configura las máquinas y materiales para ver el análisis de costos
          </div>
        )}
      </div>
    </div>
  );
}
