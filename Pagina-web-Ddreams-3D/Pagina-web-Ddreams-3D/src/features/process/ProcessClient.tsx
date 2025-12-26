'use client';

import ProcessHero from './components/ProcessHero';
import ProcessSteps from './components/ProcessSteps';
import ProcessAdvantages from './components/ProcessAdvantages';
import ProcessCallAction from './components/ProcessCallAction';

export default function ProcessClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-secondary-50/20 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <ProcessHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Proceso paso a paso */}
        <ProcessSteps />

        {/* Ventajas */}
        <ProcessAdvantages />
        {/* Call to Action */}
        <ProcessCallAction />
      </div>
    </main>
  );
}
