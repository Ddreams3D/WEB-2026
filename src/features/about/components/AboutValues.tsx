import React from 'react';
import { Heart, Rocket, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
import InfoCard from '@/shared/components/InfoCard';

const values = [
  {
    icon: Target,
    title: 'Precisión y cuidado en los detalles',
    description:
      'Cada pieza se desarrolla con atención técnica y cuidado en los detalles, priorizando la funcionalidad, el acabado y el uso final del proyecto.',
  },
  {
    icon: TrendingUp,
    title: 'Aprendizaje y mejora constante',
    description:
      'Nos mantenemos en constante aprendizaje para mejorar procesos, materiales y resultados, adaptándonos a nuevos retos y tipos de proyectos.',
  },
  {
    icon: Heart,
    title: 'Pasión por crear',
    description:
      'Disfrutamos el proceso de diseñar y fabricar piezas únicas. Esa motivación se refleja en la dedicación que ponemos en cada trabajo.',
  },
  {
    icon: Rocket,
    title: 'Eficiencia responsable',
    description:
      'Optimizamos tiempos y procesos sin sacrificar calidad, priorizando soluciones realistas y bien ejecutadas según cada encargo.',
  },
];

export default function AboutValues() {
  return (
    <section className="py-20" aria-labelledby="values-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <span className="block text-neutral-500 dark:text-white/60 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
            Nuestros Valores
          </span>
          <h2
            id="values-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6"
          >
            Principios que nos{' '}
            <span className={colors.gradients.textHighlight}>
              Guían
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Los principios que guían nuestra forma de trabajar en cada proyecto.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <InfoCard
              key={index}
              title={value.title}
              description={value.description}
              icon={value.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
