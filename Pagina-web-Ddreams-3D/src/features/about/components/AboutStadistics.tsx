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
} from '@/lib/icons';
import {
  getAnimationClasses,
  useCounterAnimation,
  useStaggeredAnimation,
} from '@/shared/hooks/useIntersectionAnimation';
import { colors } from '@/shared/styles/colors';
import { cn } from '@/lib/utils';

const stats = [
  {
    icon: Users,
    number: '500+',
    label: 'Clientes Satisfechos',
    description: 'Empresas y particulares que confían en nosotros',
  },
  {
    icon: Award,
    number: '1000+',
    label: 'Proyectos Completados',
    description: 'Desde prototipos hasta producciones en serie',
  },
  {
    icon: Globe,
    number: '20+',
    label: 'Departamentos Atendidos',
    description: 'Presencia en todo el Perú',
  },
  {
    icon: TrendingUp,
    number: '99%',
    label: 'Tasa de Satisfacción',
    description: 'Clientes que recomiendan nuestros servicios',
  },
];

export default function AboutStadistics() {
  const { ref: heroRef, isVisible: heroVisible } = useStaggeredAnimation();
  // Contadores animados para las estadísticas
  const counter1 = useCounterAnimation(500, 2000, { threshold: 0.3 });
  const counter2 = useCounterAnimation(1000, 2000, { threshold: 0.3 });
  const counter3 = useCounterAnimation(20, 2000, { threshold: 0.3 });
  const counter4 = useCounterAnimation(99, 2000, { threshold: 0.3 });

  const counters = [counter1, counter2, counter3, counter4];
  return (
    <section ref={heroRef} className="py-20" aria-labelledby="stats-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <span className="block text-neutral-500 dark:text-white/60 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
            Nuestra Trayectoria
          </span>
          <h2
            id="stats-heading"
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6 ${getAnimationClasses(
              heroVisible,
              0
            )}`}
          >
            Transformando Ideas en{' '}
            <span className={colors.gradients.textHighlight}>
              Realidad
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed ${getAnimationClasses(
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
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const counter = counters[index];
            const suffix =
              index === 0 ? '+' : index === 1 ? '+' : index === 2 ? '+' : '%';

            return (
              <div
                key={index}
                ref={counter.ref}
                className={`bg-white dark:bg-neutral-800 rounded-xl p-4 sm:p-6 text-center shadow-lg border border-primary-100 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 ${getAnimationClasses(
                  counter.isVisible,
                  0
                )}`}
              >
                <IconComponent className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 mb-4 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {counter.value}
                  {suffix}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
