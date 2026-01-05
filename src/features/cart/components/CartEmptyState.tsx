import React from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageSquare } from '@/lib/icons';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';
import { trackEvent } from '@/lib/analytics';

export function CartEmptyState() {
  const handleWhatsAppQuote = () => {
    trackEvent('whatsapp_click', { location: 'cart_page', type: 'quote' });
    const message = "Hola Ddreams3D, estoy interesado en cotizar un diseño único y personalizado. ¿Podrían brindarme más información?";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_BUSINESS}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="text-center py-16">
      <ShoppingBag className="h-24 w-24 text-gray-300 dark:text-neutral-600 mx-auto mb-6" />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Tu carrito está vacío
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        ¡Descubre nuestros increíbles productos 3D o solicita uno a medida!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/catalogo-impresion-3d"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Explorar Productos
        </Link>
        <button
          onClick={handleWhatsAppQuote}
          className="inline-flex items-center px-6 py-3 bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors shadow-sm"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Cotizar Diseño Único
        </button>
      </div>
    </div>
  );
}
