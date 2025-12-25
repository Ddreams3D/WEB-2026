import React from 'react';

export default function ContactAddressMap() {
  return (
    <section className="mt-12 sm:mt-16" aria-labelledby="location">
      <header className="text-center mb-6 sm:mb-8">
        <h2
          id="location"
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
        >
          Nuestra Ubicación
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Visítanos en nuestras instalaciones en Miraflores, Arequipa
        </p>
      </header>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-700/50">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.7441919338503!2d-71.52180552385893!3d-16.386988437828066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424bfccf1daeed%3A0x3cec70bdc7e2518d!2sDesings%20%26%20Dreamings%203D!5e0!3m2!1ses-419!2spe!4v1755376329520!5m2!1ses-419!2spe"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Desings & Dreamings 3D - Miraflores, Arequipa"
            className="sm:h-96 lg:h-[400px]"
            aria-label="Mapa interactivo mostrando la ubicación de Ddreams 3D en Miraflores, Arequipa"
          />
        </div>
      </div>
    </section>
  );
}
