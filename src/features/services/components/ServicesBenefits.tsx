import React from 'react';

import { Clock, Shield, Users, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import InfoCard from '@/shared/components/InfoCard';

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
      <div className="text-center mb-4">
        <span className="text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm">
          Excelencia & Calidad
        </span>
      </div>
      <h2
        id="benefits"
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 text-foreground"
      >
        ¿Cómo{' '}
        <span className="text-primary">
          trabajamos?
        </span>
      </h2>
      <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 text-base sm:text-lg px-4">
        Trabajamos cada proyecto de forma personalizada, cuidando el diseño, la fabricación y los acabados según el uso final de la pieza.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {benefits.map((benefit, index) => (
          <InfoCard
            key={index}
            title={benefit.title}
            description={benefit.description}
            icon={benefit.icon}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
