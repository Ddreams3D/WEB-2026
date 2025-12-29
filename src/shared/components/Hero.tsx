'use client';

import React from 'react';
import Link from 'next/link';
import { heroImages } from '../../config/images';
import Image from 'next/image';
import { useIntersectionAnimation, getAnimationClasses } from '../hooks/useIntersectionAnimation';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

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
  
  const getAnimClass = (delay: number) => cn(
    "transform transition-all duration-1000 ease-out",
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
  );

  const getDelayStyle = (delay: number) => ({ transitionDelay: `${delay}ms` });
  
  return (
    <section 
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
      role="banner"
      aria-label="Sección principal de Ddreams 3D"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Top Gradient to blend with Navbar */}
        <div className={cn("absolute top-0 left-0 w-full h-40 z-20 pointer-events-none", "bg-gradient-to-b from-black/90 to-transparent")} />
        {/* Visual Separator - Gradient to blend with next section */}
        <div className={cn("absolute bottom-0 left-0 w-full h-24 z-20 pointer-events-none", "bg-gradient-to-t from-background to-transparent")} />
        <Image
          src={heroContent.image}
          alt={heroContent.title}
          fill
          className={cn(
            "object-cover w-full h-full object-center transition-opacity duration-1000",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 pb-12 sm:pb-20">
          <div 
            className="text-center text-white max-w-5xl px-4 sm:px-6 lg:px-8"
          >
            <h1 
              className={cn("text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-lg leading-tight text-white", getAnimClass(0))}
              style={getDelayStyle(0)}
            >
              Tus ideas. Nuestro arte.
              <span 
                className={cn("block mt-2", getAnimClass(200))}
                style={getDelayStyle(200)}
              >
                En 3D.
              </span>
            </h1>
            
            {/* Semantic Subtitle - Visible for SEO & Users */}
            <p 
              className={cn("text-xl sm:text-2xl font-medium mb-6 text-white/90 max-w-3xl mx-auto drop-shadow-md tracking-wide", getAnimClass(300))}
              style={getDelayStyle(300)}
            >
              Estudio de diseño e impresión 3D en Arequipa · Envíos a todo el Perú
            </p>

            <p 
              className={cn("text-lg sm:text-xl md:text-2xl mb-8 text-white/80 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md", getAnimClass(400))}
              style={getDelayStyle(400)}
            >
              {heroContent.description}
            </p>
            <div 
              className={cn("flex flex-col sm:flex-row gap-4 justify-center items-center", getAnimClass(600))}
              style={getDelayStyle(600)}
            >
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
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
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
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Separador visual suave - Minimizado extremo */}
      <div className={cn("absolute bottom-0 left-0 w-full h-8 z-20 pointer-events-none", "bg-gradient-to-t from-background to-transparent")} />
    </section>
  );
}
