'use client';

import React from 'react';
import { Award, Users, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import InfoCard from './InfoCard';

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
  return (
    <section className="py-20" aria-labelledby="benefits-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <span className="block text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
            Nuestras Ventajas
          </span>
          <h2 id="benefits-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6">
            ¿Por Qué{' '}
            <span className="text-primary">
              Elegirnos?
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre las ventajas que nos convierten en tu mejor opción para proyectos de impresión 3D
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <InfoCard
              key={benefit.title}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}