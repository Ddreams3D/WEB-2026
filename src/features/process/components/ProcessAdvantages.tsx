import React from 'react';

import { Users, Lightbulb, Shield, Zap, Star, HelpCircle } from '@/lib/icons';
import { getAnimationClasses } from '@/shared/hooks/useIntersectionAnimation';

const advantages = [
  {
    title: 'Experiencia Comprobada',
    description:
      'Más de 5 años creando soluciones digitales innovadoras para empresas de todos los tamaños.',
    icon: Users,
    details: [
      '1000+ proyectos completados',
      '500+ clientes satisfechos',
      'Equipo multidisciplinario',
      'Metodologías ágiles',
    ],
  },
  {
    title: 'Innovación Constante',
    description:
      'Utilizamos las últimas tecnologías y tendencias para mantener tu proyecto a la vanguardia.',
    icon: Lightbulb,
    details: [
      'Tecnologías de última generación',
      'Investigación continua',
      'Actualización constante',
      'Soluciones creativas',
    ],
  },
  {
    title: 'Soporte Integral',
    description:
      'Ofrecemos soporte completo desde la conceptualización hasta el mantenimiento a largo plazo.',
    icon: Shield,
    details: [
      'Soporte 24/7',
      'Mantenimiento incluido',
      'Actualizaciones gratuitas',
      'Consultoría continua',
    ],
  },
  {
    title: 'Entrega Rápida',
    description:
      'Procesos optimizados que garantizan entregas puntuales sin comprometer la calidad.',
    icon: Zap,
    details: [
      'Metodología ágil',
      'Entregas incrementales',
      'Comunicación constante',
      'Plazos garantizados',
    ],
  },
  {
    title: 'Calidad Premium',
    description:
      'Estándares de calidad excepcionales en cada aspecto del desarrollo y diseño.',
    icon: Star,
    details: [
      'Control de calidad riguroso',
      'Pruebas exhaustivas',
      'Código limpio y documentado',
      'Diseño pixel-perfect',
    ],
  },
  {
    title: 'Transparencia Total',
    description:
      'Comunicación clara y transparente en cada etapa del proyecto con reportes detallados.',
    icon: HelpCircle,
    details: [
      'Reportes semanales',
      'Acceso a herramientas',
      'Comunicación directa',
      'Feedback constante',
    ],
  },
];

export default function ProcessAdvantages() {
  return (
    <section className="mb-10" aria-labelledby="advantages-heading">
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
            <Star className="h-4 w-4 text-white" />
          </div>
          <h2
            id="advantages-heading"
            className="text-2xl font-bold bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent"
          >
            ¿Por qué elegirnos?
          </h2>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Nuestras ventajas competitivas que nos distinguen en el mercado
        </p>
      </header>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
              )} animate-fade-in-up`}
              role="listitem"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-3 h-full border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0">
                    <div
                      className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                      aria-hidden="true"
                    >
                      <Icon className="h-4 w-4 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-primary-500 group-hover:text-primary-600 transition-colors duration-300 mb-1">
                      {advantage.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-300">
                      {advantage.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-1" aria-label="Detalles de la ventaja">
                  <ul className="space-y-1">
                    {advantage.details
                      .slice(0, 3)
                      .map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-start space-x-2 animate-slide-in-left hover:translate-x-1 transition-transform duration-300"
                          style={{
                            animationDelay: `${
                              index * 150 + detailIndex * 50
                            }ms`,
                          }}
                        >
                          <div className="w-1 h-1 bg-primary-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                          <span className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300">
                            {detail}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
