import React, { useState } from 'react';

import { MessageCircle, Plus, Minus, HelpCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StatCard } from '@/shared/components/StatCard';
import { useStaggeredItemsAnimation } from '@/shared/hooks/useIntersectionAnimation';

const faqs = [
  {
    question: '¿Qué tipos de archivos aceptan para impresión 3D?',
    answer:
      'Aceptamos archivos en formato STL, OBJ y STEP. Los archivos deben estar correctamente modelados y ser imprimibles. Para asegurar la mejor calidad, recomendamos una resolución mínima de 0.1mm. También ofrecemos servicio de optimización de archivos si es necesario.',
  },
  {
    question: '¿Cuál es el tiempo de entrega promedio?',
    answer:
      'Los tiempos de entrega varían según la complejidad y tamaño del proyecto. Para piezas simples, el tiempo estimado es de 2-3 días hábiles. Para proyectos más complejos o producción en serie, proporcionamos un cronograma detallado al momento de la cotización. Siempre mantenemos comunicación constante sobre el avance de tu proyecto.',
  },
  {
    question: '¿Qué materiales utilizan y cuáles son sus características?',
    answer:
      'Trabajamos con una amplia gama de materiales, cada uno con propiedades específicas:\n- PLA: Ideal para prototipos y modelos decorativos\n- PETG: Excelente resistencia y durabilidad\n- ABS: Perfecto para piezas funcionales y resistentes al calor\n- TPU: Material flexible para aplicaciones especiales\n- Resinas: Alta precisión y acabado superficial superior',
  },
  {
    question: '¿Ofrecen servicio de modelado 3D?',
    answer:
      'Sí, contamos con un equipo especializado en modelado 3D. Podemos crear modelos desde cero basados en tus especificaciones, convertir bocetos o planos en modelos 3D, o modificar archivos existentes para optimizarlos para impresión. Trabajamos con software profesional y garantizamos la calidad del modelado.',
  },
  {
    question: '¿Cómo se determina el precio de un proyecto?',
    answer:
      'El precio se calcula considerando varios factores:\n- Volumen y complejidad del modelo\n- Material seleccionado\n- Tiempo de impresión\n- Acabados requeridos\n- Cantidad de unidades\nProporcionamos cotizaciones detalladas y transparentes, sin costos ocultos.',
  },
  {
    question: '¿Qué garantía ofrecen?',
    answer:
      'Todos nuestros productos tienen garantía de calidad por 7 días contra defectos de fabricación. Si encuentras algún problema relacionado con la calidad de impresión, ofrecemos reimpresión gratuita o reembolso según el caso. La garantía no cubre daños por mal uso o modificaciones realizadas por el cliente.',
  },
];

// FAQ Statistics Component
function FAQStats() {
  const { ref: statsRef, visibleItems } = useStaggeredItemsAnimation(3, 150, {
    threshold: 0.3,
    triggerOnce: true,
  });

  const stats = [
    {
      id: 1,
      icon: HelpCircle,
      label: 'Preguntas Respondidas',
      value: 150,
      suffix: '+',
    },
    {
      id: 2,
      icon: Clock,
      label: 'Horas de Soporte',
      value: 24,
      suffix: 'h',
    },
    {
      id: 3,
      icon: CheckCircle,
      label: 'Satisfacción',
      value: 98,
      suffix: '%',
    },
  ];

  return (
    <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          endValue={stat.value}
          label={stat.label}
          suffix={stat.suffix}
          isVisible={visibleItems[index]}
          animationDelay={index * 150}
          className="bg-transparent border-none shadow-none hover:shadow-none hover:translate-y-0 p-0 sm:p-0"
          iconClassName="w-16 h-16 text-primary mb-6"
          valueClassName={cn(
            "text-4xl sm:text-5xl font-bold mb-3",
            "text-primary"
          )}
          labelClassName="text-muted-foreground text-base font-medium"
        />
      ))}
    </div>
  );
}

export default function ContactFAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section className="mt-12 sm:mt-16" aria-labelledby="faq">
      <div className="text-center mb-16">
        <span className="text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-6 block">
          Soporte & Claridad
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Preguntas{' '}
          <span className="text-primary">
            Frecuentes
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-12">
          Encuentra respuestas a las preguntas más comunes sobre nuestros servicios de impresión 3D
        </p>

        {/* FAQ Stats */}
        <FAQStats />
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-card rounded-xl shadow-lg overflow-hidden border border-border"
          >
            <Button
              onClick={() =>
                setOpenFaqIndex(openFaqIndex === index ? null : index)
              }
              variant="ghost"
              className="w-full px-4 py-4 sm:px-6 sm:py-5 text-left flex justify-between items-center hover:bg-accent transition-colors duration-200 h-auto rounded-none"
              aria-expanded={openFaqIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground pr-4 flex items-center">
                <HelpCircle
                  className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary"
                  aria-hidden="true"
                />
                {faq.question}
              </h3>
              {openFaqIndex === index ? (
                <Minus
                  className="w-5 h-5 text-muted-foreground flex-shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <Plus
                  className="w-5 h-5 text-muted-foreground flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </Button>
            {openFaqIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="px-4 pb-4 sm:px-6 sm:pb-5"
              >
                <div className="text-muted-foreground leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {faq.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
