'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_REDIRECT } from '@/shared/constants/infoBusiness';

export default function WhatsAppFloatingButton() {
  const defaultMessage = "Hola, vengo de su página web y me gustaría cotizar un proyecto.";
  const whatsappUrl = `${WHATSAPP_REDIRECT}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-fade-in"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-neutral-100 dark:border-neutral-700">
        ¡Cotiza tu proyecto!
      </span>
      
      {/* Ping effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>
    </a>
  );
}
