'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, MessageSquare } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';

interface CartDrawerEmptyProps {
  onClose: () => void;
}

export function CartDrawerEmpty({ onClose }: CartDrawerEmptyProps) {
  const handleWhatsAppQuote = () => {
    const message = "Hola Ddreams3D, estoy interesado en cotizar un diseño único y personalizado. ¿Podrían brindarme más información?";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_BUSINESS}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6">
      <div className="p-4 rounded-full mb-6 bg-card">
        <ShoppingCart className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
        Tu carrito está vacío
      </h3>
      <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm">
        ¿No encuentras lo que buscas? Podemos diseñarlo para ti.
      </p>
      <div className="flex flex-col w-full gap-3">
        <Button
          onClick={() => {
            onClose();
            trackEvent('view_catalog_click', { location: 'cart_drawer' });
          }}
          asChild
          variant="gradient"
          className="w-full px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Link href="/catalogo-impresion-3d">Explorar Catálogo</Link>
        </Button>
        <Button
          onClick={() => {
            onClose();
            handleWhatsAppQuote();
          }}
          variant="outline"
          className="w-full px-6 py-3 rounded-xl font-medium"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Cotizar Diseño Único
        </Button>
      </div>
    </div>
  );
}
