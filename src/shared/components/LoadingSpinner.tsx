'use client';

import React from 'react';
import { useIntersectionAnimation, getAnimationClasses } from '../hooks/useIntersectionAnimation';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

const colorClasses = {
  primary: 'text-primary-500',
  secondary: 'text-secondary-500',
  white: 'text-white',
  gray: 'text-neutral-500'
};

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text 
}: LoadingSpinnerProps) {
  const { ref, isVisible } = useIntersectionAnimation({ triggerOnce: false });
  
  return (
    <div ref={ref} className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`rounded-full border-2 border-neutral-200 border-t-current transition-transform duration-1000 ${sizeClasses[size]} ${colorClasses[color]} ${isVisible ? 'animate-spin' : ''}`}></div>
      {text && (
        <p className={`mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 ${getAnimationClasses(isVisible)}`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Componente de pantalla completa
export function FullScreenLoader({ text = 'Cargando...' }: { text?: string }) {
  const { ref, isVisible } = useIntersectionAnimation({ triggerOnce: false });
  
  return (
    <div ref={ref} className={`fixed inset-0 bg-white dark:bg-neutral-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 ${getAnimationClasses(isVisible)}`}>
      <div className="text-center">
        <LoadingSpinner size="xl" color="primary" />
        <p className={`mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-medium ${getAnimationClasses(isVisible)}`}>
          {text}
        </p>
      </div>
    </div>
  );
}

// Componente para secciones
export function SectionLoader({ text = 'Cargando...', className = '' }: { text?: string; className?: string }) {
  const { ref, isVisible } = useIntersectionAnimation();
  
  return (
    <div ref={ref} className={`flex flex-col items-center justify-center py-12 ${className} ${getAnimationClasses(isVisible)}`}>
      <LoadingSpinner size="lg" color="primary" />
      <p className={`mt-4 text-neutral-600 dark:text-neutral-400 ${getAnimationClasses(isVisible)}`}>
        {text}
      </p>
    </div>
  );
}
