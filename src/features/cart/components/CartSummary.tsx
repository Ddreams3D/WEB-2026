import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { MessageSquare } from '@/lib/icons';
import { CartItem, CartItemCustomization } from '@/shared/types';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';
import { trackEvent } from '@/lib/analytics';

interface CartSummaryProps {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  isLoading: boolean;
}

export function CartSummary({ items, itemCount, subtotal, total, isLoading }: CartSummaryProps) {
  const handleWhatsAppCheckout = () => {
    trackEvent('whatsapp_click', { location: 'cart_page', type: 'checkout', value: total });
    let message = "Hola Ddreams3D, me gustaría realizar el siguiente pedido:\n\n";
    items.forEach(item => {
      message += `* ${item.product.name} (x${item.quantity}) - S/ ${(item.product.price * item.quantity).toFixed(2)}\n`;
      
      // Incluir personalizaciones si existen
      if (item.customizations && item.customizations.length > 0) {
        item.customizations.forEach((cust: CartItemCustomization) => {
          message += `  - ${cust.name}: ${cust.value}\n`;
        });
      }
      
      // Incluir notas si existen
      if (item.notes) {
        message += `  - Nota: ${item.notes}\n`;
      }
    });
    message += `\n*Total a pagar: S/ ${total.toFixed(2)}*\n\n`;
    message += "Quedo atento para coordinar el pago y envío. ¡Gracias!";

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_BUSINESS}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-surface dark:bg-neutral-800 rounded-lg shadow-soft border border-gray-100 dark:border-neutral-700 sticky top-8">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Resumen del pedido
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>
              Subtotal ({itemCount}{' '}
              {itemCount === 1 ? 'producto' : 'productos'})
            </span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Envío</span>
            <span className="text-green-600 dark:text-green-400">Gratis</span>
          </div>

          <div className="border-t border-gray-200 dark:border-neutral-700 pt-4">
            <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleWhatsAppCheckout}
          disabled={isLoading || items.length === 0}
          variant="success"
          className="w-full mt-6"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Finalizar pedido en WhatsApp
        </Button>

        <Button
          asChild
          variant="link"
          className="w-full mt-3 font-medium"
        >
          <Link
            href="/catalogo-impresion-3d"
          >
            Continuar Comprando
          </Link>
        </Button>
      </div>
    </div>
  );
}
