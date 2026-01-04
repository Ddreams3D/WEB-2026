import React from 'react';

import {
  Target,
  Heart,
  Lightbulb,
  Rocket,
  Users,
  Award,
  Globe,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  useIntersectionAnimation,
  getAnimationClasses,
} from '@/shared/hooks/useIntersectionAnimation';
import { StatCard } from '@/shared/components/StatCard';
import { cn } from '@/lib/utils';

const stats = [
  {
    icon: Users,
    number: 500,
    label: 'Clientes Satisfechos',
    description: 'Empresas y particulares que confían en nosotros',
    suffix: '+'
  },
  {
    icon: Award,
    number: 1000,
    label: 'Proyectos Completados',
    description: 'Desde prototipos hasta producciones en serie',
    suffix: '+'
  },
  {
    icon: Globe,
    number: 20,
    label: 'Departamentos Atendidos',
    description: 'Presencia en todo el Perú',
    suffix: '+'
  },
  {
    icon: TrendingUp,
    number: 99,
    label: 'Tasa de Satisfacción',
    description: 'Clientes que recomiendan nuestros servicios',
    suffix: '%'
  },
];

export default function AboutStadistics() {
  const { ref: heroRef, isVisible: heroVisible } = useIntersectionAnimation();

  return (
    <section ref={heroRef} className="py-20" aria-labelledby="stats-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <span className="block text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
            Nuestra Trayectoria
          </span>
          <h2
            id="stats-heading"
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 ${getAnimationClasses(
              heroVisible,
              0
            )}`}
          >
            Transformando Ideas en{' '}
            <span className="text-highlight-theme">
              Realidad
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed ${getAnimationClasses(
              heroVisible,
              1
            )}`}
          >
            <strong>Somos pioneros en tecnología 3D</strong> que transformamos
            ideas innovadoras en realidades tangibles. Desde 2020, hemos liderado
            la revolución digital en Perú, empoderando a empresas y emprendedores
            con <em>soluciones de vanguardia</em> que superan expectativas y abren
            nuevas posibilidades.
          </p>
        </header>

        {/* Estadísticas Interactivas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              endValue={stat.number}
              label={stat.label}
              suffix={stat.suffix}
              description={stat.description}
              className="bg-transparent border-none shadow-none hover:shadow-none hover:translate-y-0 p-0 sm:p-0"
              iconClassName="w-16 h-16 !text-[var(--highlight-start)] mb-6"
              valueClassName={cn(
                "text-4xl sm:text-5xl font-bold mb-3",
                "!text-[var(--highlight-mid)]"
              )}
              labelClassName="text-muted-foreground text-base font-medium"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
