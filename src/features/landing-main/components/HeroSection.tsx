import React from 'react';
import Link from 'next/link';
import { Button, MainLogo } from '@/components/ui';
import { LandingMainConfig } from '@/shared/types/landing';
import { ArrowRight, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { RealisticBubbles } from './RealisticBubbles';

interface HeroSectionProps {
  initialConfig: LandingMainConfig | null;
  bubbleImages: string[];
}

export const HeroSection = ({ initialConfig, bubbleImages }: HeroSectionProps) => {
  const visualDefaults = {
    title: 'Tu imaginación\nno tiene límites.\nNosotros\nle damos forma.',
    subtitle: 'Impresión 3D en Arequipa',
    description: 'Impresión 3D personalizada en Arequipa. Diseñamos y fabricamos piezas únicas a partir de tu idea.',
    cta: 'Cotiza tu idea',
    link: '/cotizaciones'
  };

  let heroTitle = initialConfig?.heroTitle;
  let heroSubtitle = initialConfig?.heroSubtitle;
  
  // Detección de datos legacy (Título antiguo en lugar del nuevo formato)
  // Esto asegura que la web pública coincida con la corrección del editor
  const isLegacyTitle = heroTitle === 'Impresión 3D en Arequipa';
  const hasOldMultilineFormat = heroTitle?.includes('Tu imaginación') && !heroTitle?.includes('Nosotros\nle damos forma');
  
  // Si es legacy o no hay título, usar default visual
  if (!heroTitle || isLegacyTitle || hasOldMultilineFormat) {
    heroTitle = visualDefaults.title;
  }
  
  // Si es legacy, el título antiguo pasa a ser subtítulo
  if (isLegacyTitle) {
    heroSubtitle = visualDefaults.subtitle;
  } else {
    heroSubtitle = heroSubtitle || visualDefaults.subtitle;
  }
  
  const heroDescription = initialConfig?.heroDescription || visualDefaults.description;
  const ctaText = initialConfig?.ctaText || visualDefaults.cta;
  const ctaLink = initialConfig?.ctaLink || visualDefaults.link;

  // Función para procesar saltos de línea en el título y mantener el estilo visual
  const renderTitle = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Aplicar color principal a la última línea si hay más de una (patrón "Título / Remate")
      // O si es el formato específico de 4 líneas, resaltar las dos últimas ("Nosotros" y "le damos forma")
      let isHighlight = false;
      
      if (lines.length === 4 && (line.includes('Nosotros') || line.includes('le damos forma'))) {
         isHighlight = true;
      } else {
         isHighlight = index === lines.length - 1 && lines.length > 1;
      }
      
      return (
        <span 
          key={index} 
          className={`block ${isHighlight ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600' : 'text-foreground'}`}
        >
          {line}
        </span>
      );
    });
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden py-12 lg:py-0 bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
            style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        {/* Realistic Bubbles */}
        <RealisticBubbles productImages={bubbleImages} />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex items-center justify-start h-full">
        
        {/* Floating Logo (Mobile & Desktop) */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50" style={{ animation: 'float 6s ease-in-out infinite' }}>
          <MainLogo variant="white" className="w-32 md:w-48 h-auto" ignoreTheme />
        </div>

        {/* Text Content */}
        <div className="text-left flex flex-col justify-center h-full space-y-6 lg:space-y-8 py-8 lg:py-0 animate-fade-in-up max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-primary/20 text-sm font-medium shadow-sm w-fit mt-12 md:mt-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 font-bold">
              {heroSubtitle}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] whitespace-pre-line">
            {renderTitle(heroTitle)}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed whitespace-pre-line">
            {heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
            <Button size="lg" className="h-14 px-8 text-base font-bold tracking-wide rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105" asChild>
              <a href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-full border-primary/20 hover:bg-primary/5 transition-colors" asChild>
              <Link href="/catalogo-impresion-3d">
                Ver ejemplos
              </Link>
            </Button>
          </div>
          
          {/* Quick stats or trust badges */}
          <div className="flex flex-wrap items-center justify-start gap-y-2 gap-x-6 pt-0 text-sm text-muted-foreground font-medium !mt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Calidad garantizada</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Atención en Arequipa</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span>Envíos a todo el Perú</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
