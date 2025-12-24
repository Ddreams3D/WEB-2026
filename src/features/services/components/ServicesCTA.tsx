import React from 'react';
import Link from 'next/link';

import { WHATSAPP_REDIRECT } from '@/shared/constants/infoBusiness';
import ButtonRedirectWhatsapp from '@/shared/components/ButtonRedirectWhatsapp';
import ButtonPrincipal from '@/shared/components/ButtonPrincipal';

export default function ServicesCTA() {
  return (
    <section className="mt-12 sm:mt-16 lg:mt-20" aria-labelledby="cta">
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 via- to-primary-900 rounded-xl shadow-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h2
            id="cta"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 drop-shadow-lg text-white"
          >
            ¿Listo para comenzar tu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-300">
              proyecto
            </span>
            ?
          </h2>
          <p className="text-sm sm:text-base mb-6 sm:mb-8 opacity-95 leading-relaxed">
            Contáctanos hoy mismo y descubre cómo podemos hacer realidad tus
            ideas
          </p>
          <nav
            className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-center"
            aria-label="Opciones de contacto"
          >
            <Link href="/contact">
              <ButtonPrincipal msgLg="Solicitar Cotización" />
            </Link>
            <ButtonRedirectWhatsapp />
          </nav>
        </div>
      </div>
    </section>
  );
}
