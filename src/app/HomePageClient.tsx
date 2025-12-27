'use client';

import React, { useState, useEffect } from 'react';
import Hero from '../shared/components/Hero';
import BenefitsSection from '../shared/components/BenefitsSection';
import {
  LazyStats,
  LazyProjectGallery,
} from '../shared/components/LazyComponents';
import { ArrowRight } from '@/lib/icons';
import Link from 'next/link';
import { Button } from '@/components/ui';
import {
  getTransitionClasses,
  getIconClasses,
} from '../shared/styles';
import { colors } from '@/shared/styles/colors';
import { cn } from '@/lib/utils';
import CallToAction from '@/shared/components/CallToAction';
import { ctaData } from '@/shared/data/ctaData';

export default function HomePageClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-300">Cargando...</p>
        </div>
      </main>
    );
  }

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
            <h2
              id="projects-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6"
            >
              Proyectos{' '}
              <span className={colors.gradients.textHighlight}>
                Destacados
              </span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Explora algunos de nuestros trabajos más innovadores y creativos
            </p>
          </header>
          <LazyProjectGallery />

          <div className="text-center mt-12">
            <Button
              asChild
              variant="gradient"
              size="lg"
              className="text-lg px-8 py-6 h-auto"
            >
              <Link
                href="/services#gallery"
                className="flex items-center gap-2"
              >
                Ver Todos los Proyectos
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
