import React from 'react';
import { processAdvantages } from '@/shared/data/processData';
import InfoCard from '@/shared/components/InfoCard';

export default function ProcessAdvantages() {
  return (
    <section className="py-20" aria-labelledby="advantages-heading">
      <header className="text-center mb-16">
        <span className="block text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
          ¿Por qué elegirnos?
        </span>
        <h2
          id="advantages-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6"
        >
          Ventajas{' '}
          <span className="text-highlight-theme">
            Competitivas
          </span>
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
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
            key={advantage.title}
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
