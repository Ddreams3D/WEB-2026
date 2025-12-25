import React from 'react';
import {
  MessageSquare,
  Search,
  PenTool,
  Printer,
  Package,
  Lightbulb,
} from '@/lib/icons';

const processSteps = [
  {
    id: 1,
    title: 'Solicitud del proyecto',
    description: 'El cliente nos contacta y nos cuenta su idea, referencia o necesidad.',
    details: 'Puede enviar archivos 3D, imágenes, bocetos o una descripción del proyecto.',
    icon: MessageSquare,
  },
  {
    id: 2,
    title: 'Análisis y propuesta',
    description: 'Evaluamos la viabilidad del proyecto y definimos el enfoque más adecuado.',
    details: 'Preparamos una propuesta clara según el tipo de trabajo.',
    icon: Search,
  },
  {
    id: 3,
    title: 'Diseño y preparación',
    description: 'Modelamos o ajustamos el diseño y lo preparamos para impresión 3D.',
    details: 'Se realizan validaciones y correcciones antes de fabricar.',
    icon: PenTool,
  },
  {
    id: 4,
    title: 'Impresión y acabado',
    description: 'Fabricamos la pieza mediante impresión 3D y aplicamos los acabados necesarios según el proyecto.',
    details: 'Utilizamos materiales de alta calidad y técnicas precisas según el proyecto.',
    icon: Printer,
  },
  {
    id: 5,
    title: 'Entrega',
    description: 'El proyecto se entrega terminado o se envía según lo acordado.',
    details: 'Brindamos seguimiento final y soporte básico posterior.',
    icon: Package,
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-12 sm:py-16 relative overflow-hidden mb-16" aria-labelledby="process-heading">
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          <h2
            id="process-heading"
            className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white"
          >
            Proceso de{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Trabajo
            </span>
          </h2>
        </div>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          De la idea a la realidad en 5 pasos simples y transparentes
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto px-4">
        {/* Línea vertical continua con efecto de gradiente más visible */}
        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-4 bottom-4 w-0.5 md:w-0.5 bg-gradient-to-b from-primary-500/10 via-primary-500/40 to-primary-500/10" />

        <div className="space-y-6 md:space-y-0 relative">
          {processSteps.map((step, index) => {
            const isRightSide = index % 2 !== 0;

            return (
              <div
                key={step.id}
                className={`flex flex-col md:flex-row items-start md:items-center relative ${
                  isRightSide ? 'md:flex-row-reverse' : ''
                } group`}
              >
                {/* Contenido */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isRightSide ? 'md:pl-10' : 'md:pr-10'} py-3`}>
                  <div
                    className={`bg-white dark:bg-neutral-800/50 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700/50 transition-all duration-300 hover:shadow-md hover:border-primary-500/20 hover:bg-white dark:hover:bg-neutral-800 relative overflow-hidden text-left group-hover:-translate-y-0.5`}
                  >
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-primary-400 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex md:hidden items-center justify-center w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold text-xs shrink-0 border border-primary-100 dark:border-primary-800">
                        {step.id}
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-neutral-600 dark:text-neutral-300 mb-0 font-medium text-sm leading-relaxed">
                      {step.description}
                    </p>

                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                      <div className="overflow-hidden">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-700/50 mt-3">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Icono central / Timeline Node */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 md:translate-x-[-50%] flex items-center justify-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-neutral-900 border-2 border-primary-100 dark:border-neutral-700 shadow-sm flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:border-primary-500 transition-all duration-300">
                    <div className="absolute inset-0 rounded-full bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="hidden md:flex text-sm font-bold text-neutral-400 dark:text-neutral-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      {step.id}
                    </span>
                    <div className="md:hidden w-2 h-2 rounded-full bg-primary-500" />
                  </div>
                </div>

                {/* Espacio vacío para balancear */}
                <div className="w-full md:w-1/2 hidden md:block" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
