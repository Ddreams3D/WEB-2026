'use client';

import React from 'react';
import { Users, Printer, Star, Clock } from '@/lib/icons';
import { useStaggeredItemsAnimation } from '../hooks/useIntersectionAnimation';
import { StatCard } from '@/shared/components/StatCard';
import { cn } from '@/lib/utils';

const stats = [
  {
    id: 1,
    value: 1000,
    label: "Proyectos Completados",
    icon: Printer,
    suffix: '+'
  },
  {
    id: 2,
    value: 500,
    label: "Clientes Satisfechos",
    icon: Users,
    suffix: '+'
  },
  {
    id: 3,
    value: 4.9,
    label: "Valoración Media",
    icon: Star,
    suffix: ''
  },
  {
    id: 4,
    value: 24,
    label: "Tiempo de Respuesta",
    icon: Clock,
    suffix: 'h'
  }
];

export default function Stats() {
  const { ref: sectionRef, visibleItems } = useStaggeredItemsAnimation(stats.length, 150, {
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16"
      aria-labelledby="stats-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm">
            Trayectoria & Confianza
          </span>
        </div>
        <h2 id="stats-heading" className="sr-only">
          Estadísticas de Ddreams 3D
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 opacity-90 hover:opacity-100 transition-opacity duration-300">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              icon={stat.icon}
              endValue={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              isVisible={visibleItems[index]}
              animationDelay={index * 150}
              className="bg-transparent border-none shadow-none hover:shadow-none hover:translate-y-0 p-0 sm:p-0"
              iconClassName="w-16 h-16 text-primary mb-6"
              valueClassName={cn(
                 "text-4xl sm:text-5xl font-bold mb-3",
                 "text-primary"
               )}
              labelClassName="text-muted-foreground text-base font-medium"
            />
          ))}
        </div>
      </div>
    </section>
  );
}