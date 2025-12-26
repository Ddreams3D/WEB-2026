import React from 'react';
import Link from 'next/link';

import { WHATSAPP_REDIRECT } from '@/shared/constants/infoBusiness';
import ButtonRedirectWhatsapp from '@/shared/components/ButtonRedirectWhatsapp';
import ButtonPrincipal from '@/shared/components/ButtonPrincipal';
import { getGradientClasses, getIconClasses } from '@/shared/styles';
import { ArrowRight } from '@/lib/icons';

export default function ServicesCTA() {
  return (
    <section className="py-20" aria-labelledby="cta">
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
              id="cta"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg"
            >
              ¿Listo para comenzar tu proyecto?
            </h2>
            <p className="text-sm sm:text-base text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed opacity-95">
              Contáctanos hoy mismo y descubre cómo podemos hacer realidad tus
              ideas
            </p>
            <nav
              className="flex flex-col sm:flex-row gap-6 justify-center"
              aria-label="Opciones de contacto"
            >
              <ButtonPrincipal
                href="/contact"
                msgLg="Solicitar Cotización"
                icon={
                  <ArrowRight
                    className={getIconClasses('md', 'white')}
                    aria-hidden="true"
                  />
                }
              />
              <ButtonRedirectWhatsapp />
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
