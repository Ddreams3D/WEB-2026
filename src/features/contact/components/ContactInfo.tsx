import React from 'react';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

import { Mail, Phone, MapPin, Clock, HelpCircle } from '@/lib/icons';
import {
  PHONE_BUSINESS,
  PHONE_DISPLAY,
  EMAIL_BUSINESS,
  ADDRESS_BUSINESS,
  SCHEDULE_BUSINESS,
} from '@/shared/constants/contactInfo';
import ButtonRedirectWhatsapp from '@/shared/components/ButtonRedirectWhatsapp';
import InfoCard from '@/shared/components/InfoCard';

const contactInfo = [
  {
    icon: Phone,
    title: 'Teléfono',
    value: PHONE_DISPLAY,
    link: `tel:+${PHONE_BUSINESS}`,
  },
  {
    icon: Mail,
    title: 'Email',
    value: EMAIL_BUSINESS,
    link: `mailto:${EMAIL_BUSINESS}`,
  },
  {
    icon: MapPin,
    title: 'Dirección',
    value: ADDRESS_BUSINESS,
    link: 'https://maps.google.com',
  },
  {
    icon: Clock,
    title: 'Horario',
    value: SCHEDULE_BUSINESS,
    link: null,
  },
];

export default function ContactInfo() {
  return (
    <section aria-labelledby="contact-info">
      <h2
        id="contact-info"
        className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8", colors.gradients.textPrimary)}
      >
        Información de Contacto
      </h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600 dark:text-primary-400">
                <info.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500 transition-colors duration-300"
                    {...(info.link.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {info.value}
                  </p>
                )}
                {info.title === 'Dirección' && (
                  <span className="block mt-1 text-sm text-primary-600 dark:text-primary-400 font-medium">
                    Si no te encuentras en Arequipa, realizamos envíos a todo el Perú.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-800/30">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-2 bg-white dark:bg-primary-800 rounded-lg text-primary-600 dark:text-primary-300">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Nuestro equipo está aquí para ayudarte con cualquier pregunta específica
              </p>
              <ButtonRedirectWhatsapp
                text="Chatear por WhatsApp"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}