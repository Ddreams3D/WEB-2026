import React from 'react';
import Link from 'next/link';

import { Printer, Star, Zap } from '@/lib/icons';

import { WHATSAPP_REDIRECT } from '@/shared/constants/infoBusiness';

import {
  getButtonClasses,
  getTransitionClasses,
  getIconClasses,
  getGradientClasses,
} from '../../../shared/styles';

const industries = [
  {
    name: 'Medicina',
    description:
      'Prótesis personalizadas y modelos anatómicos de precisión médica',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
        />
      </svg>
    ),
    gradient:
      'from-danger-100 via-danger-50 to-danger-100 dark:from-danger-500/20 dark:via-danger-400/20 dark:to-danger-600/20',
    borderColor: 'border-danger-200 dark:border-danger-400/30',
    hoverColor:
      'group-hover:border-danger-300 dark:group-hover:border-danger-400/60',
  },
  {
    name: 'Arquitectura',
    description:
      'Maquetas arquitectónicas detalladas y visualización de proyectos',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18m2.25-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.75m-.75 3h.75m-.75 3h.75m-3.75-16.5h.75m-.75 3h.75m-.75 3h.75m-3.75-6h.75"
        />
      </svg>
    ),
    gradient:
      'from-warning-100 via-warning-50 to-warning-100 dark:from-warning-500/20 dark:via-warning-400/20 dark:to-warning-600/20',
    borderColor: 'border-warning-200 dark:border-warning-400/30',
    hoverColor:
      'group-hover:border-warning-300 dark:group-hover:border-warning-400/60',
  },
  {
    name: 'Educación',
    description:
      'Material didáctico interactivo y modelos educativos innovadores',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
        />
      </svg>
    ),
    gradient:
      'from-success-100 via-success-50 to-success-100 dark:from-success-500/20 dark:via-success-400/20 dark:to-success-600/20',
    borderColor: 'border-success-200 dark:border-success-400/30',
    hoverColor:
      'group-hover:border-success-300 dark:group-hover:border-success-400/60',
  },
  {
    name: 'Ingeniería',
    description:
      'Prototipos funcionales y componentes técnicos de alta precisión',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
    gradient:
      'from-secondary-100 via-secondary-50 to-secondary-100 dark:from-secondary-500/20 dark:via-secondary-400/20 dark:to-secondary-600/20',
    borderColor: 'border-secondary-200 dark:border-secondary-400/30',
    hoverColor:
      'group-hover:border-secondary-300 dark:group-hover:border-secondary-400/60',
  },
  {
    name: 'Arte y Diseño',
    description: 'Esculturas únicas y objetos decorativos personalizados',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
        />
      </svg>
    ),
    gradient:
      'from-accent-100 via-accent-50 to-accent-100 dark:from-accent-500/20 dark:via-accent-400/20 dark:to-accent-600/20',
    borderColor: 'border-accent-200 dark:border-accent-400/30',
    hoverColor:
      'group-hover:border-accent-300 dark:group-hover:border-accent-400/60',
  },
  // {
  //   name: 'Joyería',
  //   description: 'Piezas exclusivas y modelos para fundición de alta calidad',
  //   icon: (
  //     <svg
  //       className="w-8 h-8"
  //       fill="none"
  //       stroke="currentColor"
  //       viewBox="0 0 24 24"
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={1.5}
  //         d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
  //       />
  //     </svg>
  //   ),
  //   gradient:
  //     'from-primary-100 via-primary-50 to-primary-100 dark:from-primary-500/20 dark:via-primary-400/20 dark:to-primary-600/20',
  //   borderColor: 'border-primary-200 dark:border-primary-400/30',
  //   hoverColor:
  //     'group-hover:border-primary-300 dark:group-hover:border-primary-400/60',
  // },
];

const pricingPlans = [
  {
    name: 'Básico',
    icon: Printer,
    price: 'S/. 25',
    period: 'por pieza pequeña',
    description: 'Perfecto para proyectos personales y prototipos simples',
    features: [
      'Impresión en PLA estándar',
      'Resolución 0.2mm',
      'Hasta 10cm³',
      '1 revisión incluida',
      'Entrega en 3-5 días',
    ],
    popular: false,
    color: 'from-neutral-500 to-neutral-600',
  },
  {
    name: 'Profesional',
    icon: Star,
    price: 'S/. 45',
    period: 'por pieza mediana',
    description: 'Ideal para empresas y proyectos comerciales',
    features: [
      'Múltiples materiales (PLA, PETG, ABS)',
      'Resolución 0.1mm',
      'Hasta 50cm³',
      '3 revisiones incluidas',
      'Acabados profesionales',
      'Entrega en 2-3 días',
      'Soporte técnico',
    ],
    popular: true,
    color: 'from-primary-500 to-secondary-500',
  },
  {
    name: 'Premium',
    icon: Zap,
    price: 'S/. 85',
    period: 'por pieza grande',
    description: 'Para proyectos complejos y de alta precisión',
    features: [
      'Todos los materiales disponibles',
      'Resolución ultra-alta 0.05mm',
      'Sin límite de tamaño',
      'Revisiones ilimitadas',
      'Post-procesado incluido',
      'Entrega express 24-48h',
      'Consultoría personalizada',
      'Garantía extendida',
    ],
    popular: false,
    color: 'from-secondary-500 to-primary-600',
  },
];

export default function ServicesIndustries() {
  return (
    <section
      aria-labelledby="industries"
      className="py-20 sm:py-24 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400/20 to-secondary-500/20 rounded-2xl mb-6 backdrop-blur-sm border border-primary-400/20">
            <svg
              className="w-10 h-10 text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18m2.25-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.75m-.75 3h.75m-.75 3h.75m-3.75-16.5h.75m-.75 3h.75m-.75 3h.75m-3.75-6h.75"
              />
            </svg>
          </div>
          <h2
            id="industries"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 text-neutral-900 dark:text-white font-sans"
          >
            Industrias que{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Servimos
            </span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base max-w-3xl mx-auto font-light leading-relaxed font-sans">
            Transformamos ideas en realidad para sectores especializados
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent mx-auto mt-8" />
        </div>

        {/* Industries Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {industries.map((industry, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${industry.gradient} backdrop-blur-sm border ${industry.borderColor} ${industry.hoverColor} rounded-2xl p-6 sm:p-8 lg:p-6 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl" />
                </div>

                <div className="relative z-10 flex items-start space-x-4 lg:space-x-5">
                  {/* Icon Container */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-14 lg:h-14 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-neutral-700 dark:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-neutral-200 dark:border-white/20">
                      {industry.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl lg:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 lg:mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-100 transition-colors duration-300 font-sans">
                      {industry.name}
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-200 text-sm sm:text-base lg:text-sm leading-relaxed font-light opacity-90 group-hover:opacity-100 transition-opacity duration-300 font-sans">
                      {industry.description}
                    </p>

                    {/* Decorative line */}
                    <div className="w-0 group-hover:w-16 h-0.5 bg-gradient-to-r from-primary-400 to-secondary-400 mt-4 transition-all duration-500" />
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <svg
                      className="w-6 h-6 text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
