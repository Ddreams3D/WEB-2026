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
    number: '15+',
    label: 'Países Atendidos',
    description: 'Presencia internacional en América Latina',
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
  const counter3 = useCounterAnimation(15, 2000, { threshold: 0.3 });
  const counter4 = useCounterAnimation(99, 2000, { threshold: 0.3 });

  const counters = [counter1, counter2, counter3, counter4];
  return (
    <section ref={heroRef} className="mb-20">
      <div className="text-center mb-16">
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 ${getAnimationClasses(
            heroVisible,
            0
          )}`}
        >
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Transformando Ideas en Realidad
          </span>
        </h2>
        <p
          className={`text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed ${getAnimationClasses(
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
      </div>

      {/* Estadísticas Interactivas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const counter = counters[index];
          const suffix =
            index === 0 ? '+' : index === 1 ? '+' : index === 2 ? '+' : '%';

          return (
            <div
              key={index}
              ref={counter.ref}
              className={`bg-surface dark:bg-neutral-800 rounded-xl p-4 text-center shadow-lg border border-primary-100 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 ${getAnimationClasses(
                counter.isVisible,
                0
              )}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                {counter.value}
                {suffix}
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
