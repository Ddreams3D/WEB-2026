import { useState, useEffect, useRef } from 'react';


export function useIntersectionAnimation<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit & { triggerOnce?: boolean } = {}
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.triggerOnce) {
            observer.disconnect();
          }
        } else if (!options.triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold: options.threshold || 0.1, root: options.root, rootMargin: options.rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.root, options.rootMargin, options.triggerOnce]);

  return { ref, isVisible };
}

export function useStaggeredItemsAnimation<T extends HTMLElement = HTMLDivElement>(
  count: number,
  delay: number = 100,
  options: IntersectionObserverInit & { triggerOnce?: boolean } = {}
) {
  const ref = useRef<T>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.triggerOnce) {
            observer.disconnect();
          }
        } else if (!options.triggerOnce) {
          setIsVisible(false);
          setVisibleItems(new Array(count).fill(false));
        }
      },
      { threshold: options.threshold || 0.1, root: options.root, rootMargin: options.rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.triggerOnce, count]);

  useEffect(() => {
    if (isVisible) {
      const timeouts: NodeJS.Timeout[] = [];
      for (let i = 0; i < count; i++) {
        const timeout = setTimeout(() => {
          setVisibleItems((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * delay);
        timeouts.push(timeout);
      }
      return () => timeouts.forEach(clearTimeout);
    }
  }, [isVisible, count, delay]);

  return { ref, visibleItems };
}

export function useCounterAnimation<T extends HTMLElement = HTMLDivElement>(
  end: number,
  duration: number = 2000,
  options: IntersectionObserverInit & { triggerOnce?: boolean } = {}
) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: options.threshold || 0.1, root: options.root, rootMargin: options.rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.triggerOnce, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setValue(percentage * end);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return { ref, value, isVisible: hasStarted };
}

export function getAnimationClasses(isVisible: boolean, index: number) {
  return `transition-all duration-700 transform ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`;
}
