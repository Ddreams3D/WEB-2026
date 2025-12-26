'use client';

import React from 'react';
import { Users, Printer, Star, Clock } from '@/lib/icons';
import { useStaggeredItemsAnimation, useCounterAnimation, getAnimationClasses } from '../hooks/useIntersectionAnimation';
import { getTransitionClasses, getIconClasses, getGradientClasses } from '../styles';

const stats = [
  {
    id: 1,
    value: "1000+",
    label: "Proyectos Completados",
    icon: Printer
  },
  {
    id: 2,
    value: "500+",
    label: "Clientes Satisfechos",
    icon: Users
  },
  {
    id: 3,
    value: "4.9",
    label: "Valoración Media",
    icon: Star
  },
  {
    id: 4,
    value: "24h",
    label: "Tiempo de Respuesta",
    icon: Clock
  }
];

export default function Stats() {
  const { ref: sectionRef, visibleItems } = useStaggeredItemsAnimation(stats.length, 150, {
    threshold: 0.3,
    triggerOnce: true
  });

  // Hook personalizado para cada contador
  const counter1 = useCounterAnimation(1000, 2000, { threshold: 0.3 });
  const counter2 = useCounterAnimation(500, 2000, { threshold: 0.3 });
  const counter3 = useCounterAnimation(4.9, 2000, { threshold: 0.3 });
  const counter4 = useCounterAnimation(24, 2000, { threshold: 0.3 });

  const counters = [counter1, counter2, counter3, counter4];

  const formatValue = (stat: typeof stats[0], index: number) => {
    const counter = counters[index];
    const value = counter.value;
    
    if (stat.id === 1) return `${value}+`;
    if (stat.id === 2) return `${value}+`;
    if (stat.id === 3) return value.toFixed(1);
    if (stat.id === 4) return `${value}h`;
    
    return value.toString();
  };

  return (
    <section 
      ref={sectionRef}
      className="bg-neutral-50 dark:bg-neutral-800 py-12 sm:py-16"
      aria-labelledby="stats-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="stats-heading" className="sr-only">
          Estadísticas de Ddreams 3D
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <article 
              key={stat.id} 
              ref={counters[index].ref}
              className={`text-center group ${getAnimationClasses(visibleItems?.[index] || false, index)}`}
              role="listitem"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${getGradientClasses('primary')} hover:from-secondary-500 hover:to-primary-500 ${getTransitionClasses()} rounded-full mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-105`}>
                <stat.icon 
                  className={`${getIconClasses('md', 'primary')} text-white`} 
                  aria-hidden="true" 
                  aria-label={`Icono de ${stat.label}`}
                />
              </div>
              <div 
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${getGradientClasses('textPrimary')} bg-clip-text text-transparent mb-1 sm:mb-2`}
                aria-label={`${stat.value} ${stat.label}`}
              >
                {formatValue(stat, index)}
              </div>
              <div className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base font-medium">
                {stat.label}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}