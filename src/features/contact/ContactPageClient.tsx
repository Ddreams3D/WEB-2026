'use client';

import ContactHero from './components/ContactHero';
import ContactInfoBusiness from './components/ContactInfoBusiness';
import ContactFormBusiness from './components/ContactFormBusiness';
import ContactAddressMap from './components/ContactAddressMap';
import ContactFAQ from './components/ContactFAQ';
import CallToAction from '@/shared/components/CallToAction';
import { ctaData } from '@/shared/data/ctaData';

export default function ContactPageClient() {
  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <ContactHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Información de contacto - ocupa 5 columnas */}
          <div className="lg:col-span-5 space-y-8">
            <ContactInfoBusiness />
          </div>
          
          {/* Formulario de contacto - ocupa 7 columnas */}
          <div className="lg:col-span-7" id="contact-form">
            <ContactFormBusiness />
          </div>
        </div>

        {/* Mapa */}
        <ContactAddressMap />
        {/* Sección FAQ */}
        <ContactFAQ />

        {/* CTA Section */}
        <CallToAction
          title={ctaData.process.title}
          description={ctaData.process.description}
          primaryButtonText={ctaData.process.primaryButtonText}
          primaryButtonLink="#contact-form"
        />
      </div>
    </main>
  );
}
