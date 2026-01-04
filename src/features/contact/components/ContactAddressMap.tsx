import React from 'react';
import { cn } from '@/lib/utils';
import { ADDRESS_BUSINESS } from '@/shared/constants/contactInfo';

export default function ContactAddressMap() {
  return (
    <section className="mt-20 sm:mt-24" aria-labelledby="location">
      <div className="text-center mb-12 sm:mb-16">
        <span className="block text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
          NUESTRA UBICACIÓN
        </span>
        <h2
          id="location"
          className="text-3xl sm:text-4xl font-bold mb-4 text-foreground"
        >
          Visítanos en{' '}
          <span className="text-highlight-theme">
            Arequipa
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Estamos ubicados en {ADDRESS_BUSINESS} para atenderte mejor.
        </p>
      </div>

      <div className="bg-card backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-border p-2 sm:p-3">
        <div className="aspect-video rounded-xl overflow-hidden relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.7441919338503!2d-71.52180552385893!3d-16.386988437828066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424bfccf1daeed%3A0x3cec70bdc7e2518d!2sDesings%20%26%20Dreamings%203D!5e0!3m2!1ses-419!2spe!4v1755376329520!5m2!1ses-419!2spe"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Desings & Dreamings 3D - Miraflores, Arequipa"
            className="w-full h-full min-h-[400px] grayscale hover:grayscale-0 transition-all duration-700"
            aria-label="Mapa interactivo mostrando la ubicación de Ddreams 3D en Miraflores, Arequipa"
          />
          {/* Overlay gradient for better integration in dark mode */}
          <div className="absolute inset-0 pointer-events-none border-inset border-2 border-transparent dark:border-border/10 rounded-xl"></div>
        </div>
      </div>
    </section>
  );
}
