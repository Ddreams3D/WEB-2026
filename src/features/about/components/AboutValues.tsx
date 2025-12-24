import {
  getGradientClasses,
  getIconClasses,
  getTransitionClasses,
} from '@/shared/styles';
import { Heart, Rocket, Target, TrendingUp } from 'lucide-react';
import React from 'react';

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
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Nuestros valores
          </span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Los principios que guían nuestra forma de trabajar en cada proyecto.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value, index) => {
          const IconComponent = value.icon;
          return (
            <div key={index} className="group">
              <div
                className={`h-full bg-surface dark:bg-neutral-800 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-neutral-700 hover:shadow-xl ${getTransitionClasses(
                  'transform'
                )} hover:-translate-y-1 relative overflow-hidden flex flex-col items-center`}
              >
                <div
                  className={`absolute inset-0 ${getGradientClasses(
                    'overlayLight'
                  )} opacity-0 group-hover:opacity-100 ${getTransitionClasses(
                    'opacity'
                  )}`}
                ></div>
                <div className="relative z-10 flex flex-col items-center flex-grow">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${getGradientClasses(
                      'backgroundLight'
                    )} rounded-full mb-4 group-hover:scale-110 ${getTransitionClasses(
                      'transform'
                    )}`}
                  >
                    <IconComponent
                      className={`${getIconClasses(
                        'lg'
                      )} text-primary-600 group-hover:text-secondary-600 ${getTransitionClasses(
                        'colors'
                      )}`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 ${getTransitionClasses(
                      'colors'
                    )}`}
                  >
                    {value.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
