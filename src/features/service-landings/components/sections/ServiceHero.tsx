import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button, IsotypeLogo } from '@/components/ui';
import { ServiceLandingConfig } from '@/shared/types/service-landing';

import Image from 'next/image';

interface ServiceHeroProps {
  config: ServiceLandingConfig;
  heroSection: any;
  primaryColor: string;
}

export function ServiceHero({ config, heroSection, primaryColor }: ServiceHeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20 lg:py-0 bg-muted/10">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute rounded-full opacity-20 blur-[100px] w-[500px] h-[500px] -top-[10%] -right-[10%] bg-[var(--primary-color)]" />
          <div className="absolute rounded-full opacity-20 blur-[100px] w-[500px] h-[500px] -bottom-[10%] -left-[10%] bg-[var(--primary-color)]" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
      </div>

      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left flex flex-col justify-center h-full animate-fade-in-up space-y-6 lg:space-y-8">
              {/* Logo */}
              <div className="flex justify-center lg:justify-start">
                  <IsotypeLogo 
                      className="w-32 h-12 md:w-40 md:h-16" 
                      primaryColor={primaryColor}
                  />
              </div>

              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-border/50 text-sm font-medium shadow-sm w-fit mx-auto lg:mx-0">
                  <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="bg-clip-text text-transparent font-bold bg-gradient-to-r from-foreground to-foreground/70">
                      {heroSection?.subtitle || config.name}
                  </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-foreground">
                  {heroSection?.title || config.name}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {heroSection?.content || config.metaDescription}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 pb-4">
                  <Button 
                      size="lg" 
                      className="h-12 px-8 text-base font-bold tracking-wide rounded-full shadow-lg transition-all hover:scale-105 text-white hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                      asChild
                  >
                      <Link href="#coleccion">
                          Explorar Servicio
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full" asChild>
                      <Link href="/contacto">
                          Solicitar Presupuesto
                      </Link>
                  </Button>
              </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in-up delay-200 group perspective-1000">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-background/50 transform transition-transform duration-700 hover:rotate-y-6 hover:scale-[1.02] aspect-[4/5] lg:aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                  <Image 
                      src={config.heroImage || "https://images.unsplash.com/photo-1633419461186-7d40a2e50594?q=80&w=2069&auto=format&fit=crop"} 
                      alt={config.name}
                      fill
                      className="object-cover"
                      priority
                  />
              </div>
              
              {/* Decorative Elements behind image */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-40 blur-2xl" style={{ backgroundColor: primaryColor }} />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-40 blur-2xl" style={{ backgroundColor: primaryColor }} />
          </div>
      </div>
    </section>
  );
}
