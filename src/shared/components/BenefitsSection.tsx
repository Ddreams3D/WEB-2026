'use client';

import React from 'react';
import { Award, Users, Shield } from '@/lib/icons';
import { useStaggeredItemsAnimation, getAnimationClasses } from '../hooks/useIntersectionAnimation';
import { getTransitionClasses, getIconClasses, getGradientClasses } from '../styles';

const benefits = [
  {
    icon: Award,
    title: "Precisión en cada proyecto",
    description: "Cada pieza se diseña y fabrica con atención técnica al detalle, priorizando la funcionalidad, el acabado y el uso final del proyecto."
  },
  {
    icon: Users,
    title: "Trato directo y personalizado",
    description: "Trabajas directamente con quien diseña y fabrica tu proyecto, lo que permite comunicación clara, ajustes rápidos y mejores resultados."
  },
  {
    icon: Shield,
    title: "Experiencia en proyectos reales",
    description: "Más de 3 años desarrollando modelos médicos, prototipos funcionales, trofeos y productos personalizados para distintos usos y sectores."
  }
];

export default function BenefitsSection() {
  const { ref, visibleItems } = useStaggeredItemsAnimation(benefits.length, 200);

  return (
    <section className="py-20 bg-neutral-50 dark:bg-transparent" aria-labelledby="benefits-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <span className="block text-neutral-500 dark:text-white/60 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
            Nuestras Ventajas
          </span>
          <h2 id="benefits-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            ¿Por Qué{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Elegirnos?
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Descubre las ventajas que nos convierten en tu mejor opción para proyectos de impresión 3D
          </p>
        </header>
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <article 
                key={index} 
                className={`text-center p-8 bg-white dark:bg-neutral-900/40 border border-transparent dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl ${getTransitionClasses('transform')} hover:scale-105 ${getAnimationClasses(visibleItems?.[index] || false, index)}`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${getGradientClasses('primary')} rounded-full mb-6 shadow-lg`}>
                  <IconComponent className={`${getIconClasses('lg')} text-white`} aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}