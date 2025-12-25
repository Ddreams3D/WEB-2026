'use client';

import ContactHero from './components/ContactHero';
import ContactInfoBusiness from './components/ContactInfoBusiness';
import ContactFormBusiness from './components/ContactFormBusiness';
import ContactAddressMap from './components/ContactAddressMap';
import ContactFAQ from './components/ContactFAQ';

export default function ContactPageClient() {
  return (
    <main className="min-h-screen bg-warm-white dark:bg-neutral-900">
      <ContactHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Información de contacto */}
          <ContactInfoBusiness />
          {/* Formulario de contacto */}
          <ContactFormBusiness />
        </div>

        {/* Mapa */}
        <ContactAddressMap />
        {/* Sección FAQ */}
        <ContactFAQ />
      </div>
    </main>
  );
}
