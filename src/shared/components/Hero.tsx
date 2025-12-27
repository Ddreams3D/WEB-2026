'use client';

import React from 'react';
import Link from 'next/link';
import { heroImages } from '../../config/images';
import Image from 'next/image';
import { useIntersectionAnimation, getAnimationClasses } from '../hooks/useIntersectionAnimation';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
import { 
  getTransitionClasses, 
  getIconClasses
} from '../styles';

const heroContent = {
  title: "Tus ideas. Nuestro arte. En 3D.",
  seoTitle: "Servicios de Impresión 3D y Diseño en Arequipa | Ddreams 3D",
  description: "Fabricación de prototipos, trofeos y piezas personalizadas con tecnología 3D.",
  image: heroImages.innovation
};

export default function Hero() {
  // Animation hooks
  const { ref: heroRef, isVisible } = useIntersectionAnimation({
    threshold: 0,
    triggerOnce: true
  });
  
  return (
    <section 
      ref={heroRef}
      className={cn("relative h-screen w-full overflow-hidden", getAnimationClasses(isVisible))}
      role="banner"
      aria-label="Sección principal de Ddreams 3D"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Top Gradient to blend with Navbar */}
        <div className={cn("absolute top-0 left-0 w-full h-40 z-20 pointer-events-none", colors.gradients.heroTopOverlay)} />
        {/* Visual Separator - Gradient to blend with next section */}
        <div className={cn("absolute bottom-0 left-0 w-full h-24 z-20 pointer-events-none", colors.gradients.overlayFadeUp)} />
        <Image
          src={heroContent.image}
          alt={heroContent.title}
          fill
          className="object-cover w-full h-full object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 pt-28 sm:pt-36">
          <div 
            className="text-center text-white max-w-5xl px-4 sm:px-6 lg:px-8"
          >
            <h1 className="sr-only">
              {heroContent.seoTitle}
            </h1>
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-lg leading-tight text-white">
              Tus ideas. Nuestro arte.
              <span className="block mt-2">En 3D.</span>
            </p>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
              {heroContent.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[200px] justify-center group"
              >
                <Link 
                  href="/contact"
                  className="flex items-center gap-2"
                  aria-label="Comenzar un nuevo proyecto de impresión 3D"
                >
                  Comenzar Proyecto
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </Button>
              <Button 
                asChild
                variant="glass"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[200px] justify-center group"
              >
                <Link 
                  href="/marketplace"
                  className="flex items-center gap-2"
                  aria-label="Explorar productos disponibles en el marketplace"
                >
                  Ver Productos
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Separador visual suave - Minimizado extremo */}
      <div className={cn("absolute bottom-0 left-0 w-full h-8 z-20 pointer-events-none", colors.gradients.overlayFadeUp)} />
    </section>
  );
}
