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
} from '@/shared/hooks/useIntersectionAnimation';

import { WHATSAPP_REDIRECT } from '@/shared/constants/contactInfo';

const faqData = [
  {
    question: '¿Qué materiales trabajan?',
    answer:
      'Trabajamos principalmente con PLA, PETG y ABS, entre otros materiales. La elección depende del uso final, resistencia y acabado requerido. Te asesoramos para seleccionar la mejor opción según tu proyecto.',
  },
  {
    question: '¿Cuánto tiempo demora un proyecto?',
    answer:
      'El tiempo de entrega varía según la complejidad, tamaño y cantidad de piezas. Antes de iniciar, definimos plazos claros de producción y entrega según el proyecto.',
  },
  {
    question: '¿Pueden diseñar el modelo si no tengo archivo 3D?',
    answer:
      'Sí. Ofrecemos servicio de modelado 3D personalizado a partir de ideas, bocetos o referencias, adaptando el diseño a los requerimientos técnicos y de fabricación.',
  },
  {
    question: '¿Realizan acabados y postprocesado?',
    answer:
      'Sí. Según el proyecto, podemos ofrecer opciones de postprocesado y acabados para mejorar la apariencia, resistencia o funcionalidad de las piezas.',
  },
  {
    question: '¿Realizan envíos a otras ciudades del Perú?',
    answer:
      'Sí. Realizamos envíos a todo el Perú, incluyendo Lima y provincias, mediante empresas de transporte confiables. El costo y tiempo de envío se definen según el destino y el tipo de proyecto.',
  },
  {
    question: '¿Cómo solicito una cotización?',
    answer:
      'Puedes contactarnos por WhatsApp o completar el formulario de cotización. Con la información del proyecto (archivos, referencias o descripción), evaluamos los requerimientos y te enviamos una propuesta personalizada.',
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

export default function ContactFAQ() {
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
