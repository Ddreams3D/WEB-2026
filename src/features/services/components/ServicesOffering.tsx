import React from 'react';

import { Printer, Palette, Award, Star, Zap, ChevronRight } from '@/lib/icons';

const services = [
  {
    icon: Palette,
    title: 'Modelado 3D personalizado',
    description:
      'Creación de modelos 3D únicos adaptados a tus necesidades específicas',
    emoji: '🎨',
    cta: 'Cotizar ahora',
    href: '/contact',
  },
  {
    icon: Printer,
    title: 'Impresión 3D por encargo',
    description: 'Impresión de alta calidad en múltiples materiales y acabados',
    emoji: '🖨️',
    cta: 'Ver más',
    href: '#gallery',
  },
  {
    icon: Star,
    title: 'Acabado profesional',
    description:
      'Postprocesado y acabados premium para resultados excepcionales',
    emoji: '✨',
    cta: 'Explorar',
    href: '#gallery',
  },
  {
    icon: Zap,
    title: 'Prototipado rápido',
    description: 'Desarrollo acelerado de prototipos para validar tus ideas',
    emoji: '⚡',
    cta: 'Cotizar',
    href: '/contact',
  },
  {
    icon: Award,
    title: 'Trofeos 3D temáticos',
    description:
      'Trofeos únicos y personalizados para eventos y reconocimientos',
    emoji: '🏆',
    cta: 'Ver ejemplos',
    href: '#gallery',
  },
];

export default function ServicesOffering() {
  return (
    <section
      className="mb-16 sm:mb-20 lg:mb-24"
      aria-labelledby="main-services"
    >
      <div className="text-center mb-10 sm:mb-12">
        <h2
          id="main-services"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-neutral-900 dark:text-white"
        >
          Servicios que{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            ofrecemos
          </span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Soluciones completas en tecnología 3D para materializar tus ideas con
          la más alta calidad
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <article
              key={index}
              className={`group bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-5 border border-neutral-100 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-700 animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                    <service.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <a
                    href={service.href}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium text-sm rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {service.cta}
                    <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
