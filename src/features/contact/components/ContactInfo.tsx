import React from 'react';
import { cn } from '@/lib/utils';

import { Mail, Phone, MapPin, Clock, HelpCircle } from 'lucide-react';
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
        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-foreground"
      >
        Información de Contacto
      </h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl text-primary">
                <info.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    {...(info.link.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-muted-foreground">
                    {info.value}
                  </p>
                )}
                {info.title === 'Dirección' && (
                  <span className="block mt-1 text-sm text-muted-foreground/80 font-medium">
                    Si no te encuentras en Arequipa, realizamos envíos a todo el Perú.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-2 bg-background rounded-lg text-primary shadow-sm">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-muted-foreground mb-4">
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