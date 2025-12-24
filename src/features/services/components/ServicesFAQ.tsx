import React, { useState } from 'react';
import Link from 'next/link';

import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
} from '@/lib/icons';

import {
  useCounterAnimation,
  useStaggeredItemsAnimation,
} from '../../../shared/hooks/useIntersectionAnimation';

import { WHATSAPP_REDIRECT } from '@/shared/constants/infoBusiness';
const faqData = [
  {
    question: '¿Qué materiales utilizan para la impresión 3D?',
    answer:
      'Trabajamos con una amplia variedad de materiales incluyendo PLA, ABS, PETG, TPU, resinas fotopoliméricas, y materiales especializados como fibra de carbono, metal y cerámicas. Cada material tiene propiedades específicas que se adaptan a diferentes aplicaciones y requisitos del proyecto.',
  },
  {
    question: '¿Cuánto tiempo toma completar un proyecto?',
    answer:
      'El tiempo de entrega depende de la complejidad del proyecto, el tamaño, la cantidad de piezas y el material seleccionado. Proyectos simples pueden completarse en 24-48 horas, mientras que proyectos complejos o de gran volumen pueden tomar de 1-2 semanas. Ofrecemos servicio express para entregas urgentes.',
  },
  {
    question: '¿Ofrecen servicios de diseño desde cero?',
    answer:
      'Sí, nuestro equipo de diseñadores especializados puede crear modelos 3D completamente desde cero basándose en sus especificaciones, bocetos o ideas. Incluimos revisiones ilimitadas hasta que el diseño cumpla exactamente con sus expectativas.',
  },
  {
    question: '¿Cuál es la precisión de sus impresiones 3D?',
    answer:
      'Nuestras impresoras de alta precisión pueden alcanzar resoluciones de hasta 0.05mm en el eje Z y 0.1mm en los ejes X e Y. Para aplicaciones que requieren tolerancias extremadamente precisas, utilizamos tecnologías de post-procesado y acabado especializado.',
  },
  {
    question: '¿Pueden imprimir piezas de gran tamaño?',
    answer:
      'Sí, contamos con impresoras de gran formato que pueden manejar piezas de hasta 400x400x500mm. Para proyectos aún más grandes, podemos dividir el diseño en secciones que se ensamblan posteriormente, manteniendo la integridad estructural del producto final.',
  },
  {
    question: '¿Ofrecen servicios de post-procesado?',
    answer:
      'Absolutamente. Ofrecemos una gama completa de servicios de post-procesado incluyendo lijado, pintura, tratamientos químicos, curado UV, soldadura ultrasónica, y acabados especializados. Esto garantiza que el producto final tenga la calidad y apariencia profesional que necesita.',
  },
  {
    question: '¿Trabajan con proyectos médicos o industriales?',
    answer:
      'Sí, tenemos experiencia en aplicaciones médicas e industriales. Utilizamos materiales biocompatibles certificados para aplicaciones médicas y seguimos estrictos protocolos de calidad. Para aplicaciones industriales, trabajamos con materiales de alta resistencia y precisión dimensional.',
  },
  {
    question: '¿Cómo funciona el proceso de cotización?',
    answer:
      'Puede obtener una cotización inicial usando nuestra calculadora en línea. Para cotizaciones precisas, envíenos sus archivos 3D o especificaciones del proyecto. Analizamos los requisitos técnicos, materiales, tiempo de producción y post-procesado para proporcionar un presupuesto detallado en 24 horas.',
  },
];

// FAQ Statistics Component
function FAQStats() {
  const { ref: statsRef, visibleItems } = useStaggeredItemsAnimation(3, 150, {
    threshold: 0.3,
    triggerOnce: true,
  });

  const counter1 = useCounterAnimation(150, 2000, { threshold: 0.3 });
  const counter2 = useCounterAnimation(24, 2000, { threshold: 0.3 });
  const counter3 = useCounterAnimation(98, 2000, { threshold: 0.3 });

  const counters = [counter1, counter2, counter3];

  const stats = [
    {
      id: 1,
      icon: HelpCircle,
      label: 'Preguntas Respondidas',
      suffix: '+',
    },
    {
      id: 2,
      icon: Clock,
      label: 'Horas de Soporte',
      suffix: 'h',
    },
    {
      id: 3,
      icon: CheckCircle,
      label: 'Satisfacción',
      suffix: '%',
    },
  ];

  return (
    <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => {
        const counter = counters[index];
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.id}
            ref={counter.ref}
            className={`bg-white dark:bg-neutral-700 rounded-xl p-6 text-center shadow-lg border border-neutral-200 dark:border-neutral-600 hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 ${
              visibleItems?.[index]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{
              animationDelay: `${index * 150}ms`,
              transition: 'all 0.7s ease-out',
            }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md group-hover:scale-110 transition-transform duration-300">
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {counter.value}
              {stat.suffix}
            </div>
            <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ServicesFAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Preguntas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Frecuentes
            </span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12">
            Encuentra respuestas a las preguntas más comunes sobre nuestros
            servicios de impresión 3D
          </p>

          {/* FAQ Stats */}
          <FAQStats />
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover-lift animate-fade-in-up border border-neutral-200 dark:border-neutral-700`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                aria-expanded={openFaqIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-semibold text-neutral-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-600 dark:text-primary-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-500 dark:text-neutral-400 transition-transform duration-200" />
                  )}
                </div>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaqIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
