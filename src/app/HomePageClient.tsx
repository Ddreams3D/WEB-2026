'use client';

import React, { useState, useEffect } from 'react';
import Hero from '../shared/components/Hero';
import SocialShare from '../shared/components/SocialShare';
import BenefitsSection from '../shared/components/BenefitsSection';
import {
  LazyStats,
  LazyProjectGallery,
} from '../shared/components/LazyComponents';
import { ArrowRight } from '@/lib/icons';
import Link from 'next/link';
import {
  getButtonClasses,
  getTransitionClasses,
  getIconClasses,
  getGradientClasses,
} from '../shared/styles';
import ButtonPrincipal from '@/shared/components/ButtonPrincipal';

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
        className="py-20 bg-surface dark:bg-neutral-800"
        aria-labelledby="projects-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h2
              id="projects-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-6"
            >
              Proyectos Destacados
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Explora algunos de nuestros trabajos más innovadores y creativos
            </p>
          </header>
          <LazyProjectGallery />

          <div className="text-center mt-12">
            <Link
              href="/services#gallery"
              className="inline-flex items-center bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-secondary-500 hover:to-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Ver Todos los Proyectos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" aria-labelledby="cta-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`${getGradientClasses(
              'primary'
            )} rounded-xl shadow-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden`}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2
                id="cta-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg"
              >
                ¿Listo para dar vida a tus ideas?
              </h2>
              <p className="text-sm sm:text-base text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed opacity-95">
                Nuestro equipo de expertos está preparado para ayudarte a
                convertir tus ideas en realidad con la más alta calidad en
                impresión 3D y tecnología de vanguardia.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact" aria-describedby="cta-heading">
                  <ButtonPrincipal
                    msgLg=" Comenzar Proyecto"
                    iconRight={
                      <ArrowRight
                        className={` text-white ml-2  ${getIconClasses('md')}`}
                        aria-hidden="true"
                      />
                    }
                  />
                </Link>
                <Link href="/marketplace">
                  <ButtonPrincipal
                    msgLg=" Explorar Productos"
                    iconRight={
                      <ArrowRight
                        className={` text-white ml-2  ${getIconClasses('md')}`}
                        aria-hidden="true"
                      />
                    }
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
