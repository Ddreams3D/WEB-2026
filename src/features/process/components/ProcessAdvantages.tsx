import React from 'react';

import { 
  Award, 
  Settings, 
  Lightbulb, 
  MessageCircle, 
  PackageCheck, 
  Target,
  Star
} from '@/lib/icons';
import { getAnimationClasses } from '@/shared/hooks/useIntersectionAnimation';

const advantages = [
  {
    title: 'Experiencia comprobada',
    description:
      'Más de 3 años desarrollando proyectos reales en impresión y modelado 3D, desde piezas médicas y prototipos funcionales hasta trofeos y productos personalizados.',
    icon: Award,
  },
  {
    title: 'Enfoque personalizado',
    description:
      'Cada proyecto se diseña y fabrica según su uso real, necesidades técnicas y objetivos del cliente. No trabajamos con soluciones genéricas.',
    icon: Settings,
  },
  {
    title: 'Combinación técnica y creativa',
    description:
      'Unimos modelado 3D, impresión y acabados para lograr piezas funcionales, precisas y visualmente cuidadas.',
    icon: Lightbulb,
  },
  {
    title: 'Comunicación directa',
    description:
      'Tratas directamente con quien diseña y fabrica tu proyecto, lo que permite ajustes rápidos, claridad y mejores resultados.',
    icon: MessageCircle,
  },
  {
    title: 'Producción responsable',
    description:
      'Plazos claros, materiales adecuados y procesos definidos para entregar piezas confiables y bien terminadas.',
    icon: PackageCheck,
  },
  {
    title: 'Calidad enfocada al resultado',
    description:
      'Cada pieza se imprime pensando en su función final: estudio, presentación, validación técnica o uso real.',
    icon: Target,
  },
];

export default function ProcessAdvantages() {
  return (
    <section className="mb-16 md:mb-24" aria-labelledby="advantages-heading">
      <header className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
            <Star className="h-4 w-4 text-white" />
          </div>
          <h2
            id="advantages-heading"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent"
          >
            ¿Por qué elegir Ddreams3D?
          </h2>
        </div>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Nuestras ventajas competitivas que nos distinguen en el mercado
        </p>
      </header>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Ventajas de nuestro servicio"
      >
        {advantages.map((advantage, index) => {
          const Icon = advantage.icon;
          return (
            <article
              key={index}
              className={`group ${getAnimationClasses(
                true,
                index
              )} animate-fade-in-up h-full`}
              role="listitem"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl shadow-sm p-6 h-full border border-neutral-100 dark:border-neutral-700/50 hover:border-primary-500/30 dark:hover:border-primary-500/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 mb-2">
                      {advantage.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
