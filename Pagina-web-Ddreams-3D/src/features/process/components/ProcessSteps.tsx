import React from 'react';
import { Lightbulb } from '@/lib/icons';
import { colors } from '@/shared/styles/colors';
import { cn } from '@/lib/utils';
import { processSteps } from '@/shared/data/processData';

const ProcessStepItem = ({ step, index }: { step: typeof processSteps[0], index: number }) => {
  const isRightSide = index % 2 !== 0;

  return (
    <div
      className={`flex flex-col md:flex-row items-start md:items-center relative ${
        isRightSide ? 'md:flex-row-reverse' : ''
      } group`}
    >
      {/* Contenido */}
      <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isRightSide ? 'md:pl-10' : 'md:pr-10'} py-3`}>
        <div
          className={cn(
            "backdrop-blur-sm p-5 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700/50 transition-all duration-300 hover:shadow-md hover:border-primary-500/20 hover:bg-white dark:hover:bg-neutral-800 relative overflow-hidden text-left group-hover:-translate-y-0.5",
            colors.backgrounds.card
          )}
        >
          <div className={cn(
            "absolute top-0 left-0 w-0.5 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            colors.gradients.primaryVertical
          )} />

          <div className="flex items-center gap-3 mb-2">
            <span className={cn(
              "flex md:hidden items-center justify-center w-6 h-6 rounded-full text-primary-600 dark:text-primary-400 font-bold text-xs shrink-0 border border-primary-100 dark:border-primary-800",
              colors.backgrounds.primary
            )}>
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
};

export default function ProcessSteps() {
  return (
    <section className="py-20" aria-labelledby="process-heading">
      <header className="text-center mb-16">
        <span className="block text-neutral-500 dark:text-white/60 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
          Nuestra Metodología
        </span>
        <h2
          id="process-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6"
        >
          Proceso de{' '}
          <span className={colors.gradients.textHighlight}>
            Trabajo
          </span>
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          De la idea a la realidad en 5 pasos simples y transparentes
        </p>
      </header>

      <div className="relative max-w-5xl mx-auto px-4">
        {/* Línea vertical continua con efecto de gradiente más visible */}
        <div className={cn(
          "absolute left-4 md:left-1/2 transform -translate-x-1/2 h-full w-0.5 rounded-full",
          "bg-gradient-to-b from-primary-500/20 via-primary-500/40 to-primary-500/20"
        )} />

        <div className="space-y-8 md:space-y-12">
          {processSteps.map((step, index) => (
            <ProcessStepItem key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
