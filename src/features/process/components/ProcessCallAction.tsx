import React from 'react';

import { MessageSquare, ArrowRight } from '@/lib/icons';
import ButtonPrincipal from '@/shared/components/ButtonPrincipal';
import Link from 'next/link';
import ButtonRedirectWhatsapp from '@/shared/components/ButtonRedirectWhatsapp';
import { getGradientClasses, getIconClasses } from '@/shared/styles';

export default function ProcessCallAction() {
  return (
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
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-sm sm:text-base text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed opacity-95">
              Te acompañamos desde la idea hasta la pieza terminada, con un proceso claro y personalizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <ButtonPrincipal
                href="/contact"
                aria-label="Ir a la página de contacto"
                msgLg="Contactar ahora"
                iconRight={
                  <ArrowRight
                    className={` text-white ml-2  ${getIconClasses('md')}`}
                    aria-hidden="true"
                  />
                }
              />
              <ButtonRedirectWhatsapp />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
