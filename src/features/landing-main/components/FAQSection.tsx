import React from 'react';

export const FAQSection = () => {
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          {[
            { 
              q: "¿Qué tipos de archivos aceptan para impresión 3D?", 
              a: "Aceptamos archivos en formato STL, OBJ y STEP. Los archivos deben estar correctamente modelados y ser imprimibles. Para asegurar la mejor calidad, recomendamos una resolución mínima de 0.1mm. También ofrecemos servicio de optimización de archivos si es necesario." 
            },
            { 
              q: "¿Cuál es el tiempo de entrega promedio?", 
              a: "Los tiempos de entrega varían según la complejidad y tamaño del proyecto. Para piezas simples, el tiempo estimado es de 2-3 días hábiles. Para proyectos más complejos o producción en serie, proporcionamos un cronograma detallado al momento de la cotización. Siempre mantenemos comunicación constante sobre el avance de tu proyecto." 
            },
            { 
              q: "¿Qué materiales utilizan y cuáles son sus características?", 
              a: "Trabajamos con una amplia gama de materiales, cada uno con propiedades específicas:\n- PLA: Ideal para prototipos y modelos decorativos\n- PETG: Excelente resistencia y durabilidad\n- ABS: Perfecto para piezas funcionales y resistentes al calor\n- TPU: Material flexible para aplicaciones especiales\n- Resinas: Alta precisión y acabado superficial superior" 
            },
            { 
              q: "¿Ofrecen servicio de modelado 3D?", 
              a: "Sí, contamos con un equipo especializado en modelado 3D. Podemos crear modelos desde cero basados en tus especificaciones, convertir bocetos o planos en modelos 3D, o modificar archivos existentes para optimizarlos para impresión. Trabajamos con software profesional y garantizamos la calidad del modelado." 
            },
            { 
              q: "¿Cómo se determina el precio de un proyecto?", 
              a: "El precio se calcula considerando varios factores:\n- Volumen y complejidad del modelo\n- Material seleccionado\n- Tiempo de impresión\n- Acabados requeridos\n- Cantidad de unidades\nProporcionamos cotizaciones detalladas y transparentes, sin costos ocultos." 
            },
            { 
              q: "¿Qué garantía ofrecen?", 
              a: "Todos nuestros productos tienen garantía de calidad por 7 días contra defectos de fabricación. Si encuentras algún problema relacionado con la calidad de impresión, ofrecemos reimpresión gratuita o reembolso según el caso. La garantía no cubre daños por mal uso o modificaciones realizadas por el cliente." 
            }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card hover:bg-accent/5 transition-colors">
              <h3 className="font-bold text-lg mb-2">{item.q}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
