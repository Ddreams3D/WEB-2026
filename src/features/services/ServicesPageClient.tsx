'use client';
import React, { useState } from 'react';
import './animations.css';
import ServicesHero from '@/features/services/components/ServicesHero';
import ServicesBenefits from '@/features/services/components/ServicesBenefits';
import ServicesFAQ from '@/features/services/components/ServicesFAQ';
import ServicesCTA from '@/features/services/components/ServicesCTA';
import { GeneralServicesView } from '@/features/services/components/GeneralServicesView';
import { BusinessServicesView } from '@/features/services/components/BusinessServicesView';

export default function ServicesPageClient() {
  const [activeTab, setActiveTab] = useState<'general' | 'business'>('general');

  return (
    <main className="min-h-screen bg-background">
      <ServicesHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        
        {/* Toggle de Vistas */}
        <div id="servicios-generales" className="flex justify-center mb-16 scroll-mt-24">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl inline-flex relative shadow-inner">
            {/* Background slider */}
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-neutral-700 rounded-xl shadow-sm transition-all duration-300 ease-spring ${activeTab === 'general' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`} 
            />
             
            <button 
              onClick={() => setActiveTab('general')} 
              className={`relative z-10 px-8 py-3 text-sm md:text-base font-medium transition-colors duration-200 rounded-xl w-48 ${activeTab === 'general' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
            >
              Servicios
            </button>
            <button 
              onClick={() => setActiveTab('business')} 
              className={`relative z-10 px-8 py-3 text-sm md:text-base font-medium transition-colors duration-200 rounded-xl w-48 ${activeTab === 'business' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
            >
              Empresarial B2B
            </button>
          </div>
        </div>

        {/* Contenido Dinámico */}
        <div className="animate-fade-in min-h-[400px]">
          {activeTab === 'general' ? (
            <GeneralServicesView />
          ) : (
            <BusinessServicesView />
          )}
        </div>

        {/* Beneficios */}
        <div className="mt-20 lg:mt-24">
          <ServicesBenefits />
        </div>
      </div>
      
      {/* FAQ Section */}
      <ServicesFAQ />

      {/* CTA */}
      <ServicesCTA />
    </main>
  );
}
