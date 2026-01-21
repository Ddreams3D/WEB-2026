import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';
import { WhatsAppService } from '@/services/whatsapp.service';

interface PropsButtonRedirectWhatsapp {
  message?: string; // Plain text message
  className?: string;
  text?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'glass' | 'success';
}

export default function ButtonRedirectWhatsapp({
  message,
  className,
  text,
  variant = 'success',
}: PropsButtonRedirectWhatsapp) {
  // Use 'custom' template if message is provided, otherwise default to 'general_contact'
  const whatsappUrl = message 
    ? WhatsAppService.getLink('custom', { message })
    : WhatsAppService.getLink('general_contact');

  return (
    <Button
      asChild
      variant={variant}
      size="lg"
      className={`shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 gap-2 ${className || ''}`}
    >
      <a
        href={whatsappUrl}
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
