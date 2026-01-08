import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button, IsotypeLogo } from '@/components/ui';
import { ServiceLandingConfig } from '@/shared/types/service-landing';

import Image from 'next/image';
import { ImageComparison } from '@/components/ui/ImageComparison';

interface ServiceHeroProps {
  config: ServiceLandingConfig;
  heroSection: any;
  primaryColor: string;
}

export function ServiceHero({ config, heroSection, primaryColor }: ServiceHeroProps) {
  return (
    <section className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-background">
      
      {/* Dynamic Background Elements (Left Side Only) */}
      <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full pointer-events-none overflow-hidden z-0">
          {/* Gradient Orbs */}
          <div className="absolute rounded-full opacity-10 blur-[100px] w-[500px] h-[500px] -top-[10%] -right-[10%] bg-[var(--primary-color)]" />
          <div className="absolute rounded-full opacity-10 blur-[100px] w-[500px] h-[500px] -bottom-[10%] -left-[10%] bg-[var(--primary-color)]" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
      </div>

      {/* Left Column: Text Content */}
      <div className="relative z-10 flex flex-col justify-center p-6 lg:p-16 xl:p-24 order-2 lg:order-1">
          <div className="max-w-xl mx-auto lg:mx-0 w-full space-y-6 lg:space-y-8 animate-fade-in-up">
              {/* Logo */}
              <div className="flex justify-center lg:justify-start">
                  <IsotypeLogo 
                      className="w-24 h-10 md:w-32 md:h-12" 
                      primaryColor={primaryColor}
                  />
              </div>

              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-muted/50 backdrop-blur-md border border-border/50 text-sm font-medium shadow-sm w-fit mx-auto lg:mx-0">
                  <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                  <span 
                    className="font-bold"
                    style={{ color: primaryColor }}
                  >
                      {heroSection?.subtitle || config.name}
                  </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[1.1] text-foreground text-center lg:text-left">
                  {heroSection?.title || config.name}
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed text-center lg:text-left">
                  {heroSection?.content || config.metaDescription}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Button 
                      size="lg" 
                      className="h-12 px-8 text-base font-bold tracking-wide rounded-full shadow-lg transition-all hover:scale-105 text-white hover:opacity-90 w-full sm:w-auto"
                      style={{ backgroundColor: primaryColor }}
                      asChild
                  >
                      <Link href="#coleccion">
                          Explorar Servicio
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full w-full sm:w-auto" asChild>
                      <Link href="/contacto">
                          Solicitar Presupuesto
                      </Link>
                  </Button>
              </div>
          </div>
      </div>

      {/* Right Column: Hero Image / Slider (Full Bleed) */}
      <div className="relative h-[50vh] lg:h-full w-full order-1 lg:order-2 group">
          {config.heroImageComparison ? (
              <ImageComparison 
                beforeImage={config.heroImage || "https://placehold.co/800x800/e2e8f0/475569.png?text=Escultura+Real"}
                afterImage={config.heroImageComparison}
                beforeLabel="Escultura Real"
                afterLabel="Modelo 3D"
                primaryColor={primaryColor}
                className="h-full w-full"
              />
          ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 lg:hidden" />
                <Image 
                    src={config.heroImage || "https://placehold.co/800x800/e2e8f0/475569.png?text=Escultura+Real"} 
                    alt={config.name}
                    fill
                    className="object-cover"
                    priority
                />
              </>
          )}
          
          {/* Overlay gradient for text readability on mobile if needed, or aesthetic */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-background/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-background lg:via-transparent lg:to-transparent opacity-50" />
      </div>
    </section>
  );
}
