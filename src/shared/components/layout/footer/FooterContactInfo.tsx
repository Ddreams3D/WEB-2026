import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import {
  PHONE_BUSINESS,
  WHATSAPP_REDIRECT,
  PHONE_DISPLAY,
  EMAIL_BUSINESS,
  ADDRESS_BUSINESS,
  SCHEDULE_BUSINESS,
} from '@/shared/constants/contactInfo';

export function FooterContactInfo() {
  return (
    <>
      {/* Información de contacto - Centrada */}
      <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
        <a
          href={`${WHATSAPP_REDIRECT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1"
        >
          <Phone className="w-4 h-4" />
          {PHONE_DISPLAY}
        </a>
        <span className="text-white/40 hidden sm:inline">•</span>
        <a
          href={`mailto:${EMAIL_BUSINESS}`}
          className="text-white/60 hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1"
        >
          <Mail className="w-4 h-4" />
          {EMAIL_BUSINESS}
        </a>
      </div>

      {/* Dirección y horarios - Horizontal */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-sm sm:text-base">
        <div className="flex items-center gap-1 text-white/60">
          <MapPin className="w-4 h-4" />
          <span>{ADDRESS_BUSINESS}</span>
        </div>

        <div className="flex items-center gap-1 text-white/60">
          <Clock className="w-4 h-4" />
          <span>{SCHEDULE_BUSINESS}</span>
        </div>
      </div>
    </>
  );
}
