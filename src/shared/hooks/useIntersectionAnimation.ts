'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

interface AnimationState {
  isVisible: boolean;
  hasTriggered: boolean;
}

/**
 * Hook personalizado para manejar animaciones con IntersectionObserver
 * Proporciona una forma consistente de animar elementos cuando entran en el viewport
 */
export function useIntersectionAnimation({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  delay = 0
}: UseIntersectionAnimationOptions = {}) {
  const [state, setState] = useState<AnimationState>({
    isVisible: false,
    hasTriggered: false
  });
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === 'undefined') return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting && (!triggerOnce || !state.hasTriggered)) {
          if (delay > 0) {
            setTimeout(() => {
              setState(() => ({
            isVisible: true,
            hasTriggered: true
          }));
            }, delay);
          } else {
            setState(() => ({
              isVisible: true,
              hasTriggered: true
            }));
          }
        } else if (!triggerOnce && !isIntersecting) {
          setState(prev => ({
            ...prev,
            isVisible: false
          }));
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current = observer;
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, state.hasTriggered]);

  return {
    ref: elementRef,
    isVisible: state.isVisible,
    hasTriggered: state.hasTriggered
  };
}

/**
 * Hook especializado para animaciones de números/contadores
 */
export function useCounterAnimation(
  targetValue: number,
  duration: number = 2000,
  options?: UseIntersectionAnimationOptions
) {
  const [currentValue, setCurrentValue] = useState(0);
  const { ref, isVisible } = useIntersectionAnimation(options);
  const animationRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    const startTime = Date.now();
    const startValue = 0;
    const difference = targetValue - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.round(startValue + (difference * easeOut));
      
      setCurrentValue(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, targetValue, duration]);

  return {
    ref,
    value: currentValue,
    isVisible
  };
}

/**
 * Hook para animaciones escalonadas con múltiples elementos (staggered animations)
 */
export function useStaggeredItemsAnimation(
  itemCount: number,
  staggerDelay: number = 100,
  options?: UseIntersectionAnimationOptions
) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const { ref, isVisible } = useIntersectionAnimation(options);

  useEffect(() => {
    if (!isVisible) return;

    const timeouts: NodeJS.Timeout[] = [];

    for (let i = 0; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => {
          const newState = [...prev];
          newState[i] = true;
          return newState;
        });
      }, i * staggerDelay);
      
      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isVisible, itemCount, staggerDelay]);

  return {
    ref,
    visibleItems,
    isVisible
  };
}

/**
 * Clases CSS predefinidas para animaciones comunes
 */
export const animationClasses = {
  fadeIn: 'opacity-0 transition-all duration-700 ease-out',
  fadeInVisible: 'opacity-100',
  
  slideUp: 'opacity-0 translate-y-8 transition-all duration-700 ease-out',
  slideUpVisible: 'opacity-100 translate-y-0',
  
  slideLeft: 'opacity-0 translate-x-8 transition-all duration-700 ease-out',
  slideLeftVisible: 'opacity-100 translate-x-0',
  
  slideRight: 'opacity-0 -translate-x-8 transition-all duration-700 ease-out',
  slideRightVisible: 'opacity-100 translate-x-0',
  
  scale: 'opacity-0 scale-95 transition-all duration-700 ease-out',
  scaleVisible: 'opacity-100 scale-100',
  
  rotate: 'opacity-0 rotate-12 transition-all duration-700 ease-out',
  rotateVisible: 'opacity-100 rotate-0'
};

/**
 * Función helper para combinar clases de animación con tipos
 */
export function getAnimationClassesByType(
  animationType: keyof typeof animationClasses,
  isVisible: boolean
): string {
  const baseClass = animationClasses[animationType];
  const visibleClass = animationClasses[`${animationType}Visible` as keyof typeof animationClasses];
  
  return isVisible ? `${baseClass} ${visibleClass}` : baseClass;
}

/**
 * Función helper simplificada para animaciones con delay escalonado
 */
export function getAnimationClasses(isVisible: boolean, index: number = 0): string {
  const delay = index * 100; // 100ms delay between each element
  
  return `transform transition-all duration-700 ease-out ${
    isVisible 
      ? 'translate-y-0 opacity-100' 
      : 'translate-y-8 opacity-0'
  }` + (delay > 0 ? ` delay-[${delay}ms]` : '');
}

/**
 * Hook simplificado para animaciones básicas
 */
export function useStaggeredAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
}