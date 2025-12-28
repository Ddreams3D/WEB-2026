import React, { useState } from 'react';

import { MessageCircle, Plus, Minus, HelpCircle } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { colors } from '@/shared/styles/colors';
import ButtonPrincipal from '@/shared/components/ButtonPrincipal';

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

export default function ContactFAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section className="mt-12 sm:mt-16" aria-labelledby="faq">
      <header className="text-center mb-6 sm:mb-8">
        <h2
          id="faq"
          className={`text-2xl sm:text-3xl font-bold ${colors.gradients.textPrimary}`}
        >
          Preguntas Frecuentes
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Encuentra respuestas a las preguntas más comunes sobre nuestros
          servicios
        </p>
      </header>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200/50 dark:border-neutral-700/50"
          >
            <Button
              onClick={() =>
                setOpenFaqIndex(openFaqIndex === index ? null : index)
              }
              variant="ghost"
              className="w-full px-4 py-4 sm:px-6 sm:py-5 text-left flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200 h-auto rounded-none"
              aria-expanded={openFaqIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white pr-4 flex items-center">
                <HelpCircle
                  className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500"
                  aria-hidden="true"
                />
                {faq.question}
              </h3>
              {openFaqIndex === index ? (
                <Minus
                  className="w-5 h-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <Plus
                  className="w-5 h-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </Button>
            {openFaqIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="px-4 pb-4 sm:px-6 sm:pb-5"
              >
                <div className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {faq.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-8 sm:mt-12 text-center">
        <div className={`rounded-xl p-6 sm:p-8 border border-primary-200/50 dark:border-primary-700/30 ${colors.gradients.boxHighlight}`}>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4">
            ¿No encontraste lo que buscabas?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4 sm:mb-6 text-sm sm:text-base">
            Nuestro equipo está aquí para ayudarte con cualquier pregunta
            específica
          </p>
          <a href="#contact-form">
            <ButtonPrincipal
              icon={
                <MessageCircle
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                  aria-hidden="true"
                />
              }
              msgLg="Contáctanos Directamente"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
