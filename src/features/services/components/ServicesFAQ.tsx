import React, { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
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

import { WHATSAPP_REDIRECT } from '@/shared/constants/contactInfo';
const faqData = [
  {
    question: '¿Qué materiales utilizamos?',
    answer:
      'Imprimimos en PLA, PETG, ABS entre otras, seleccionando el material adecuado según el uso y acabado que necesite tu proyecto. Si no sabes cuál elegir, nosotros te asesoramos.',
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
      'Sí. Tenemos experiencia desarrollando proyectos para los sectores médico e industrial. En el área médica realizamos modelos anatómicos, maquetas y prototipos impresos en 3D para visualización, educación y demostración. Para aplicaciones industriales, desarrollamos prototipos funcionales y piezas personalizadas según los requerimientos de cada proyecto.',
  },
  {
    question: '¿Cómo funciona el proceso de cotización?',
    answer:
      'Puedes solicitar una cotización a través de nuestro formulario o contactándonos directamente por WhatsApp. Una vez recibida la información del proyecto (archivos, referencias o descripción), evaluamos los requerimientos y te enviamos una propuesta personalizada según el tipo de trabajo.',
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
            className={cn(
              "rounded-xl p-6 text-center shadow-lg border border-neutral-200 dark:border-neutral-600 hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1",
              colors.backgrounds.card,
              visibleItems?.[index]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            )}
            style={{
              animationDelay: `${index * 150}ms`,
              transition: 'all 0.7s ease-out',
            }}
          >
            <div className="flex justify-center mb-4">
              <IconComponent className="h-10 w-10 text-primary-600 dark:text-primary-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
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
    <section className={cn("py-20", colors.backgrounds.neutral)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-neutral-500 dark:text-white/60 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-6 block">
            Soporte & Claridad
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Preguntas{' '}
            <span className={cn(
              "bg-clip-text text-transparent",
              colors.gradients.textPrimary
            )}>
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
              className={cn(
                "rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover-lift border border-neutral-200 dark:border-neutral-700",
                colors.backgrounds.card
              )}
            >
              <Button
                onClick={() => toggleFaq(index)}
                variant="ghost"
                className={cn(
                  "w-full px-6 py-5 text-left flex items-center justify-between",
                  "h-auto rounded-none"
                )}
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
              </Button>
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
