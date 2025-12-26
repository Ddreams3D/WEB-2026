'use client';
import Testimonials from '../../shared/components/Testimonials';

import './animations.css';
import ServicesHero from '@/features/services/components/ServicesHero';
import ServicesOffering from '@/features/services/components/ServicesOffering';
import ServicesBenefits from '@/features/services/components/ServicesBenefits';
import ServicesGalery from '@/features/services/components/ServicesGalery';
import ServicesCalculatorPrice from '@/features/services/components/ServicesCalculatorPrice';
import ServicesFAQ from '@/features/services/components/ServicesFAQ';
import ServicesCTA from '@/features/services/components/ServicesCTA';

export default function ServicesPageClient() {
  return (
    <main className="min-h-screen bg-background">
      <ServicesHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Servicios que ofrecemos */}
        <ServicesOffering />

        {/* Beneficios */}
        <ServicesBenefits />

        {/* Galería */}
        <ServicesGalery />

        {/* Price Calculator */}
        {/* <ServicesCalculatorPrice /> */}

        {/* Testimonials Section */}
        <Testimonials />



        {/* FAQ Section */}
        <ServicesFAQ />

        {/* CTA */}
        <ServicesCTA />
      </div>
    </main>
  );
}
