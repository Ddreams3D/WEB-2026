import React from 'react';
import { WHATSAPP_REDIRECT } from '@/shared/constants/contactInfo';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';

interface PropsButtonRedirectWhatsapp {
  msgRedirect?: string;
  className?: string;
  text?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'glass' | 'success';
}

export default function ButtonRedirectWhatsapp({
  msgRedirect,
  className,
  text,
  variant = 'success',
}: PropsButtonRedirectWhatsapp) {
  return (
    <Button
      asChild
      variant={variant}
      size="lg"
      className={`shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 gap-2 ${className || ''}`}
    >
      <a
        href={`${WHATSAPP_REDIRECT}?text=${
          msgRedirect
            ? msgRedirect
            : 'Hola,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios%20de%20impresión%203D'
        }`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
        onClick={() => trackEvent(AnalyticsEvents.WHATSAPP_CLICK, { location: AnalyticsLocations.CALL_TO_ACTION, label: text || 'default' })}
      >
        <span className="hidden sm:inline">{text || 'Chatear por WhatsApp'}</span>
        <span className="sm:hidden">{text || 'WhatsApp'}</span>
        <MessageCircle className="w-5 h-5 text-white" aria-hidden="true" />
      </a>
    </Button>
  );
}
