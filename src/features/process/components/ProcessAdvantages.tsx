import React from 'react';
import { colors } from '@/shared/styles/colors';
import { processAdvantages } from '@/shared/data/processData';
import InfoCard from '@/shared/components/InfoCard';

export default function ProcessAdvantages() {
  return (
    <section className="py-20" aria-labelledby="advantages-heading">
      <header className="text-center mb-16">
        <span className="block text-neutral-500 dark:text-white/60 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
          ¿Por qué elegirnos?
        </span>
        <h2
          id="advantages-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6"
        >
          Ventajas{' '}
          <span className={colors.gradients.textHighlight}>
            Competitivas
          </span>
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          Nuestras ventajas competitivas que nos distinguen en el mercado
        </p>
      </header>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        role="list"
        aria-label="Ventajas de nuestro servicio"
      >
        {processAdvantages.map((advantage, index) => (
          <InfoCard
            key={index}
            title={advantage.title}
            description={advantage.description}
            icon={advantage.icon}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
