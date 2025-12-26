import React from 'react';
import { WHATSAPP_REDIRECT } from '../constants/infoBusiness';
import ButtonPrincipal from './ButtonPrincipal';
import { MessageCircle } from 'lucide-react';

interface PropsButtonRedirectWhatsapp {
  msgRedirect?: string;
}

export default function ButtonRedirectWhatsapp({
  msgRedirect,
}: PropsButtonRedirectWhatsapp) {
  return (
    <ButtonPrincipal
      href={`${WHATSAPP_REDIRECT}?text=${
        msgRedirect
          ? msgRedirect
          : 'Hola,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios%20de%20impresión%203D'
      }`}
      target="_blank"
      rel="noopener noreferrer"
      icon={
        <MessageCircle
          className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
          aria-hidden="true"
        />
      }
      msgSm="WhatsApp"
      msgLg="Chatear por WhatsApp"
    />
  );
}
