import {
  getGradientClasses,
  getIconClasses,
  getTransitionClasses,
} from '@/shared/styles';
import { Heart, Lightbulb, Rocket, Target } from 'lucide-react';
import React from 'react';

const values = [
  {
    icon: Target,
    title: 'Precisión Excepcional',
    description:
      'Cada proyecto se ejecuta con precisión milimétrica y atención obsesiva al detalle, garantizando resultados que superan las expectativas más exigentes.',
  },
  {
    icon: Lightbulb,
    title: 'Innovación Constante',
    description:
      'Adoptamos y desarrollamos las tecnologías más avanzadas para crear soluciones revolucionarias que transforman industrias completas.',
  },
  {
    icon: Heart,
    title: 'Pasión Genuina',
    description:
      'Nuestro amor por la tecnología 3D se refleja en cada diseño, cada impresión y cada sonrisa de satisfacción de nuestros clientes.',
  },
  {
    icon: Rocket,
    title: 'Eficiencia Inteligente',
    description:
      'Procesos optimizados con inteligencia artificial y metodologías ágiles que entregan resultados extraordinarios en tiempo récord.',
  },
];

export default function AboutValues() {
  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Nuestros Valores
          </span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          <strong>Los pilares fundamentales</strong> que definen nuestra
          identidad y guían cada decisión, acción e innovación en nuestra
          empresa. Estos valores son el <em>corazón de todo lo que hacemos</em>.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {values.map((value, index) => {
          const IconComponent = value.icon;
          return (
            <div key={index} className="group">
              <div
                className={`bg-surface dark:bg-neutral-800 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-neutral-700 hover:shadow-xl ${getTransitionClasses(
                  'transform'
                )} hover:-translate-y-1 relative overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 ${getGradientClasses(
                    'overlayLight'
                  )} opacity-0 group-hover:opacity-100 ${getTransitionClasses(
                    'opacity'
                  )}`}
                ></div>
                <div className="relative z-10">
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
