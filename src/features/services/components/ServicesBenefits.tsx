import React from 'react';

import { Clock, Shield, Award, Users } from '@/lib/icons';

const benefits = [
  {
    icon: Clock,
    title: 'Entrega Rápida',
    description: 'Tiempos de entrega optimizados sin comprometer la calidad',
  },
  {
    icon: Shield,
    title: 'Calidad Garantizada',
    description:
      'Todos nuestros productos pasan por rigurosos controles de calidad',
  },
  {
    icon: Award,
    title: 'Experiencia Comprobada',
    description: 'Más de 1000 proyectos exitosos nos respaldan',
  },
  {
    icon: Users,
    title: 'Soporte Personalizado',
    description:
      'Acompañamiento completo desde la idea hasta el producto final',
  },
];

export default function ServicesBenefits() {
  return (
    <section className="mb-12 sm:mb-16 lg:mb-20" aria-labelledby="benefits">
      <h2
        id="benefits"
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-neutral-900 dark:text-white"
      >
        ¿Por qué{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          elegirnos
        </span>
        ?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {benefits.map((benefit, index) => (
          <article
            key={index}
            className={`bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover-lift hover-glow p-6 sm:p-8 text-center group animate-scale-in stagger-${
              index + 1
            }`}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 animate-float">
              <benefit.icon
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-neutral-800 dark:text-neutral-200">
              {benefit.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
              {benefit.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
