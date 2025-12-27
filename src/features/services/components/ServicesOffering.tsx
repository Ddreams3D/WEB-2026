import React from 'react';
import Link from 'next/link';
import { colors } from '@/shared/styles/colors';
import { Printer, Palette, Award, Star, Zap, ChevronRight } from '@/lib/icons';
import InfoCard from '@/shared/components/InfoCard';

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
          <span className={colors.gradients.textHighlight}>
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
            <InfoCard
              key={index}
              title={service.title}
              icon={service.icon}
              index={index}
              description={
                <div className="flex flex-col h-full">
                  <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                    {service.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-700/50">
                    <Link
                      href={service.href}
                      className="inline-flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group-hover:translate-x-1 duration-300"
                    >
                      {service.cta}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
