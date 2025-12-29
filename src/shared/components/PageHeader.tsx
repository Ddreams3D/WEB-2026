'use client';

import React from 'react';
import ImageOptimizer from './ImageOptimizer';
import { cn } from '@/lib/utils';
import { useIntersectionAnimation } from '@/shared/hooks/useIntersectionAnimation';

interface PageHeaderProps {
  title: string;
  description: string;
  image: string;
}

export default function PageHeader({ title, description, image }: PageHeaderProps) {
  const { ref, isVisible } = useIntersectionAnimation({
    threshold: 0,
    triggerOnce: true
  });

  const getAnimClass = (delay: number) => cn(
    "transform transition-all duration-1000 ease-out",
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
  );

  const getDelayStyle = (delay: number) => ({ transitionDelay: `${delay}ms` });

  return (
    <div 
      ref={ref}
      className="relative h-[40vh] min-h-[400px] w-full overflow-hidden pt-20"
    >
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Top Gradient to blend with Navbar - Matching Hero style */}
      <div className={cn("absolute top-0 left-0 w-full h-40 z-20 pointer-events-none", "bg-gradient-to-b from-black/50 to-transparent")} />
      {/* Bottom fade - Matching Hero style */}
      <div className={cn("absolute bottom-0 left-0 w-full h-24 z-20 pointer-events-none", "bg-gradient-to-t from-background to-transparent")} />
      
      <ImageOptimizer
        src={image}
        alt={title}
        fill
        className={cn(
          "object-cover transition-opacity duration-1000",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 
            className={cn("text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg leading-tight text-white", getAnimClass(0))}
            style={getDelayStyle(0)}
          >
            {title}
          </h1>
          <p 
            className={cn("text-lg sm:text-xl md:text-2xl text-white/90 font-light leading-relaxed drop-shadow-md", getAnimClass(200))}
            style={getDelayStyle(200)}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
