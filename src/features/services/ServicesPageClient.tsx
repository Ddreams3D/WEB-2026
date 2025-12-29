'use client';
import React from 'react';
import './animations.css';
import ServicesHero from '@/features/services/components/ServicesHero';
import ServicesBenefits from '@/features/services/components/ServicesBenefits';
import ServicesCTA from '@/features/services/components/ServicesCTA';
import { BusinessServicesView } from '@/features/services/components/BusinessServicesView';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

export default function ServicesPageClient() {
  // Enable scroll restoration for services page
  // Assuming services load statically or fast enough, we can set contentReady to true
  useScrollRestoration(true, true);

  return (
    <main className="min-h-screen bg-background">
      <ServicesHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        
        {/* Contenido: Servicios Generales y B2B */}
        <div className="space-y-6">
          <BusinessServicesView />
        </div>

        {/* Beneficios */}
        <div className="mt-20 lg:mt-24">
          <ServicesBenefits />
        </div>
      </div>
      
      {/* CTA */}
      <ServicesCTA />
    </main>
  );
}
