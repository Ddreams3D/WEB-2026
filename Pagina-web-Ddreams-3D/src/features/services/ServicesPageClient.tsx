'use client';
import React, { useState } from 'react';
import Testimonials from '../../shared/components/Testimonials';

import './animations.css';
import ServicesHero from '@/features/services/components/ServicesHero';
import ServicesBenefits from '@/features/services/components/ServicesBenefits';
import ServicesCalculatorPrice from '@/features/services/components/ServicesCalculatorPrice';
import ServicesFAQ from '@/features/services/components/ServicesFAQ';
import ServicesCTA from '@/features/services/components/ServicesCTA';
import GeneralServicesView from '@/features/services/components/GeneralServicesView';
import B2BServicesView from '@/components/marketplace/B2BServicesView';

export default function ServicesPageClient() {
  const [activeTab, setActiveTab] = useState<'general' | 'b2b'>('general');

  return (
    <main className="min-h-screen bg-background">
      <ServicesHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Selector de Tipo de Servicio */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'general'
                  ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Servicios Generales
            </button>
            <button
              onClick={() => setActiveTab('b2b')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'b2b'
                  ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Servicios Empresariales (B2B)
            </button>
          </div>
        </div>

        {/* Contenido según Tab Activo */}
        <div className="animate-fade-in">
          {activeTab === 'general' ? (
            <GeneralServicesView />
          ) : (
            <B2BServicesView />
          )}
        </div>

        {/* Beneficios */}
        <div className="mt-20 lg:mt-24">
          <ServicesBenefits />
        </div>

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
