import React from 'react';
import { WHATSAPP_REDIRECT } from '../constants/infoBusiness';
import ButtonPrincipal from './ButtonPrincipal';
import { MessageCircle } from 'lucide-react';
import { getIconClasses } from '@/shared/styles';

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
          className={getIconClasses('md', 'white')}
          aria-hidden="true"
        />
      }
      msgSm="WhatsApp"
      msgLg="Chatear por WhatsApp"
    />
  );
}
