'use client';

import React from 'react';
import Link from 'next/link';
import { heroImages } from '@/config/images';
import Image from 'next/image';
import { useIntersectionAnimation, getAnimationClasses } from '@/shared/hooks/useIntersectionAnimation';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { FileText, ChevronDown } from 'lucide-react';

const heroContent = {
  title: "Servicios de Modelado e Impresión 3D",
  subtitle: "Cotiza, ordena y sigue tus pedidos en línea.",
  seoTitle: "Servicios de Impresión 3D y Gestión de Pedidos | Ddreams 3D",
  description: "Desde la conceptualización hasta la fabricación final. Gestiona tus proyectos de impresión 3D desde nuestra nueva plataforma unificada de pedidos y seguimiento.",
  image: heroImages.services // Using the specific services hero image
};

export default function ServicesHero() {
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
      aria-label="Encabezado de Servicios Ddreams 3D"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Top Gradient to blend with Navbar */}
        <div className={cn("absolute top-0 left-0 w-full h-40 z-20 pointer-events-none", "bg-gradient-to-b from-black/80 to-transparent")} />
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
              className={cn("text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-10 tracking-tight drop-shadow-lg leading-none text-white", getAnimClass(0))}
              style={getDelayStyle(0)}
            >
              Servicio de
              <span 
                className={cn("block mt-2", getAnimClass(200))}
                style={getDelayStyle(200)}
              >
                Modelado e Impresión 3D
              </span>
            </h1>

            <p 
              className={cn("text-lg sm:text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md", getAnimClass(400))}
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
                  aria-label="Solicitar cotización de servicio"
                >
                  Solicitar Cotización
                  <FileText className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="glass"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[200px] justify-center group"
              >
                <Link 
                  href="#servicios-generales"
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('servicios-generales')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-label="Explorar nuestros servicios"
                >
                  Explorar Servicios
                  <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
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
