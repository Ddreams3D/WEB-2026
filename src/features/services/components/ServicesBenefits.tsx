import React from 'react';

import { Clock, Shield, Users, Printer } from '@/lib/icons';

const benefits = [
  {
    icon: Clock,
    title: 'Entrega rápida',
    description: 'Optimizamos tiempos de producción y procesos para cumplir plazos claros sin comprometer la calidad del resultado final.',
  },
  {
    icon: Shield,
    title: 'Calidad garantizada',
    description:
      'Cada pieza pasa por revisión técnica y control de acabado para asegurar precisión, funcionalidad y buena presentación.',
  },
  {
    icon: Users,
    title: 'Soporte personalizado',
    description:
      'Acompañamiento directo durante todo el proyecto: desde la idea inicial hasta la entrega de la pieza terminada.',
  },
  {
    icon: Printer,
    title: 'Prototipado funcional',
    description:
      'Desarrollo de prototipos y piezas funcionales para pruebas reales, validación de diseño y mejora antes de producción final.',
  },
];

export default function ServicesBenefits() {
  return (
    <section className="mb-12 sm:mb-16 lg:mb-20" aria-labelledby="benefits">
      <h2
        id="benefits"
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 text-neutral-900 dark:text-white"
      >
        ¿Cómo{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          trabajamos
        </span>
        ?
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8 sm:mb-12 text-base sm:text-lg px-4">
        Trabajamos cada proyecto de forma personalizada, cuidando el diseño, la fabricación y los acabados según el uso final de la pieza.
      </p>
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
