import React from 'react';

import { MessageSquare, Star } from '@/lib/icons';
import ButtonPrincipal from '@/shared/components/ButtonPrincipal';
import Link from 'next/link';
import ButtonRedirectWhatsapp from '@/shared/components/ButtonRedirectWhatsapp';

export default function ProcessCallAction() {
  return (
    <section
      className="text-center animate-fade-in-up"
      aria-labelledby="cta-heading"
    >
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-lg p-6 border border-primary-200 dark:border-primary-800 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <MessageSquare className="h-4 w-4 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h2
              id="cta-heading"
              className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
            >
              ¿Listo para comenzar tu proyecto?
            </h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-300">
            Contáctanos hoy y descubre cómo podemos hacer realidad tu visión con
            nuestro proceso probado
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" aria-label="Ir a la página de contacto">
              <ButtonPrincipal
                icon={
                  <MessageSquare
                    className="h-4 w-4 mr-2 hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                }
                msgLg="Contactar Ahora"
              />
            </Link>

            <ButtonRedirectWhatsapp />
          </div>
        </div>
      </div>
    </section>
  );
}
