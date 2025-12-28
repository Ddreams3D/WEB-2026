'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
import { useCounterAnimation, getAnimationClasses } from '@/shared/hooks/useIntersectionAnimation';

interface StatCardProps {
  icon: React.ElementType;
  endValue: number;
  label: string;
  suffix?: string;
  description?: string;
  duration?: number;
  className?: string;
  valueClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  /* 
   * Si se proporciona, se usa para controlar la animación de entrada desde fuera (ej. staggered).
   * Si no, el componente usa su propia detección de intersección.
   */
  isVisible?: boolean; 
  /*
   * Delay para la animación de entrada CSS (ms).
   */
  animationDelay?: number;
}

export function StatCard({
  icon: Icon,
  endValue,
  label,
  suffix = '',
  description,
  duration = 2000,
  className,
  valueClassName,
  iconClassName,
  labelClassName,
  isVisible: externalIsVisible,
  animationDelay = 0,
}: StatCardProps) {
  // El hook controla el conteo numérico
  const { ref, value, isVisible: internalIsVisible } = useCounterAnimation(endValue, duration, { threshold: 0.3 });
  
  // Determinamos si el componente debe mostrarse (entrada CSS)
  // Si externalIsVisible está definido (no undefined), lo usamos. Si no, usamos el interno.
  const shouldShow = externalIsVisible !== undefined ? externalIsVisible : internalIsVisible;

  const formatValue = (val: number) => {
    if (Number.isInteger(endValue)) {
      return Math.floor(val);
    }
    return val.toFixed(1);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-6 text-center transition-all duration-300 group cursor-pointer transform",
        // Fondo y bordes: Visible en light mode, transparente y sin borde en dark mode
        "bg-white dark:bg-transparent shadow-lg dark:shadow-none border border-primary-100 dark:border-none hover:shadow-xl hover:-translate-y-1",
        getAnimationClasses(shouldShow, 0),
        className
      )}
      style={{
        transitionDelay: `${animationDelay}ms`,
      }}
    >
      <div className="flex justify-center mb-4">
        <Icon className={cn(
          "h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
          iconClassName
        )} />
      </div>
      <div
        className={cn(
          "text-2xl sm:text-3xl font-bold mb-2 transition-colors tabular-nums",
          // Color base: Oscuro en light, Blanco en dark (luego sobreescrito por el gradiente si se aplica)
          "text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400",
          valueClassName
        )}
      >
        {formatValue(value)}
        {suffix}
      </div>
      <div className={cn(
        "text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1",
        labelClassName
      )}>
        {label}
      </div>
      {description && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block mt-2">
          {description}
        </div>
      )}
    </div>
  );
}
