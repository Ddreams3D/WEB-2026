import React from 'react';

import { Mail, Phone, MapPin, Clock, MessageCircle } from '@/lib/icons';
import ButtonPrincipal from '@/shared/components/ButtonPrincipal';
import {
  PHONE_BUSINESS,
  WHATSAPP_REDIRECT,
} from '@/shared/constants/infoBusiness';
import Link from 'next/link';
import ButtonRedirectWhatsapp from '@/shared/components/ButtonRedirectWhatsapp';

const contactInfo = [
  {
    icon: Phone,
    title: 'Teléfono',
    value: '+51 901 843 288',
    link: `tel:+${PHONE_BUSINESS}`,
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'dreamings.desings.3d@gmail.com',
    link: 'mailto:dreamings.desings.3d@gmail.com',
  },
  {
    icon: MapPin,
    title: 'Dirección',
    value: 'Urb. Chapi Chico Mz. A Lt 5 Miraflores, Arequipa, Perú',
    link: 'https://maps.google.com',
  },
  {
    icon: Clock,
    title: 'Horario',
    value: 'Lun - Vie: 9:00 AM - 6:00 PM',
    link: null,
  },
];

export default function ContactInfoBusiness() {
  return (
    <section aria-labelledby="contact-info">
      <h2
        id="contact-info"
        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
      >
        Información de Contacto
      </h2>
      <address className="space-y-4 sm:space-y-6 not-italic">
        {contactInfo.map((info, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
                <info.icon
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 text-neutral-800 dark:text-neutral-200">
                {info.title}
              </h3>
              {info.link ? (
                <a
                  href={info.link}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500 transition-colors duration-300 font-medium"
                  {...(info.link.startsWith('http') && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                >
                  {info.value}
                </a>
              ) : (
                <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                  {info.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </address>

      {/* WhatsApp */}
      <aside className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl border border-primary-200/50 dark:border-primary-700/30 shadow-lg">
        <div className="flex items-start space-x-3 sm:space-x-4 my-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
            <MessageCircle
              className="h-5 w-5 sm:h-6 sm:w-6 text-white"
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-green-700 dark:text-green-400">
              WhatsApp
            </h3>
            <p className="text-sm sm:text-base text-green-600/80 dark:text-green-400/70">
              Respuesta inmediata
            </p>
          </div>
        </div>
        <ButtonRedirectWhatsapp />
      </aside>
    </section>
  );
}
