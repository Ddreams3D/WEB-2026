'use client';

import ProcessHero from './components/ProcessHero';
import ProcessSteps from './components/ProcessSteps';
import ProcessAdvantages from './components/ProcessAdvantages';
import ProcessCallAction from './components/ProcessCallAction';

export default function ProcessClient() {
  return (
    <main className="min-h-screen bg-background">
      <ProcessHero />

      {/* Proceso paso a paso */}
      <ProcessSteps />

      {/* Ventajas */}
      <ProcessAdvantages />
      
      {/* Call to Action */}
      <ProcessCallAction />
    </main>
  );
}
