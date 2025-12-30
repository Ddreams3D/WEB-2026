'use client';
 
 import React from 'react';
 import Hero from '@/shared/components/Hero';
import BenefitsSection from '@/shared/components/BenefitsSection';
import {
  LazyStats,
  LazyProjectGallery,
} from '@/shared/components/LazyComponents';
import { ArrowRight } from '@/lib/icons';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import CallToAction from '@/shared/components/CallToAction';
import { ctaData } from '@/shared/data/ctaData';

export default function HomePageClient() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />

      {/* Stats Section */}
      <LazyStats />

      <BenefitsSection />

      {/* Projects Section */}
      <section
        className="py-20"
        aria-labelledby="projects-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span className="text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-6 block">
              Innovación & Detalle
            </span>
            <h2
              id="projects-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6"
            >
              Proyectos{' '}
              <span className="text-primary">
                Destacados
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
              Explora algunos de nuestros trabajos más innovadores y creativos
            </p>
          </header>
          <LazyProjectGallery />

          <div className="text-center mt-12">
            <Button
              asChild
              variant="gradient"
              size="lg"
              className="text-base sm:text-lg px-8"
            >
              <Link
                href="/catalogo-impresion-3d"
                className="flex items-center gap-2"
              >
                Explorar más proyectos y trabajos en el catálogo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CallToAction
        title={ctaData.home.title}
        description={ctaData.home.description}
        primaryButtonText={ctaData.home.primaryButtonText}
        primaryButtonLink={ctaData.home.primaryButtonLink}
      />
    </main>
  );
}
