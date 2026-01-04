import React from 'react';
import { Lightbulb } from 'lucide-react';
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
            "backdrop-blur-sm p-5 rounded-xl shadow-sm border border-border/50 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-card/80 relative overflow-hidden text-left group-hover:-translate-y-0.5",
            "bg-card"
          )}
        >
          <div className={cn(
            "absolute top-0 left-0 w-0.5 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            "bg-gradient-to-b from-primary/50 to-transparent"
          )} />

          <div className="flex items-center gap-3 mb-2">
            <span className={cn(
              "flex md:hidden items-center justify-center w-6 h-6 rounded-full text-primary font-bold text-xs shrink-0 border border-primary/20",
              "bg-primary/10"
            )}>
              {step.id}
            </span>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {step.title}
            </h3>
          </div>

          <p className="text-muted-foreground mb-0 font-medium text-sm leading-relaxed">
            {step.description}
          </p>

          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
            <div className="overflow-hidden">
              <p className="text-xs text-muted-foreground pt-3 border-t border-border/50 mt-3">
                {step.details}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Icono central / Timeline Node */}
      <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 md:translate-x-[-50%] flex items-center justify-center">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border-2 border-border shadow-sm flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:border-primary transition-all duration-300">
          <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="hidden md:flex text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors duration-300">
            {step.id}
          </span>
          <div className="md:hidden w-2 h-2 rounded-full bg-primary" />
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
        <span className="block text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
          Nuestra Metodología
        </span>
        <h2
          id="process-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6"
        >
          Proceso de{' '}
          <span className="text-highlight-theme">
            Trabajo
          </span>
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          De la idea a la realidad en 5 pasos simples y transparentes
        </p>
      </header>

      <div className="relative max-w-5xl mx-auto px-4">
        {/* Línea vertical continua con efecto de gradiente más visible */}
        <div className={cn(
          "absolute left-4 md:left-1/2 transform -translate-x-1/2 h-full w-0.5 rounded-full",
          "bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"
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
