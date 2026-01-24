'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';
import { CartItem } from '@/shared/types';
import { useAuth } from '@/contexts/AuthContext';

interface CartDrawerFooterProps {
  items: CartItem[];
  itemCount: number;
  total: number;
  onClose: () => void;
}

export function CartDrawerFooter({ items, itemCount, total, onClose }: CartDrawerFooterProps) {
  const { user } = useAuth();

  const handleWhatsAppCheckout = () => {
    let message = "Hola Ddreams3D, me gustaría realizar el siguiente pedido:\n\n";
    items.forEach(item => {
      message += `* ${item.product.name} (x${item.quantity}) - S/ ${(item.product.price * item.quantity).toFixed(2)}\n`;
      
      // Incluir personalizaciones si existen
      if (item.customizations && item.customizations.length > 0) {
        item.customizations.forEach(cust => {
          message += `  - ${cust.name}: ${cust.value}\n`;
        });
      }
      
      // Incluir notas si existen
      if (item.notes) {
        message += `  - Nota: ${item.notes}\n`;
      }
    });
    message += `\n*Total a pagar: S/ ${total.toFixed(2)}*\n\n`;

    // Incluir datos del usuario si están disponibles
    if (user) {
      message += "*Datos de Contacto:*\n";
      if (user.name) message += `Nombre: ${user.name}\n`;
      if (user.email) message += `Email: ${user.email}\n`;
      if (user.phone || user.phoneNumber) message += `Teléfono: ${user.phone || user.phoneNumber}\n`;
      if (user.address) message += `Dirección: ${user.address}\n`;
      message += "\n";
    }

    message += "Quedo atento para coordinar el pago y envío. ¡Gracias!";

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_BUSINESS}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className={cn("p-4 sm:p-6 space-y-4 sm:space-y-6 pb-8 sm:pb-6", "bg-muted/50")}>
      {/* Price Summary */}
      <div className={cn(
        "rounded-xl p-4 shadow-sm border border-border space-y-3",
        "bg-card"
      )}>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount}{' '}
            {itemCount === 1 ? 'producto' : 'productos'}):
          </span>
          <span className="font-medium text-foreground">
            S/ {total.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            Envío:
          </span>
          <span className="font-medium text-success">
            Gratis
          </span>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-foreground">
              Total:
            </span>
            <span className="text-2xl font-bold text-primary">
              S/ {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleWhatsAppCheckout}
          variant="success"
          className="w-full h-auto flex items-center justify-center px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 group"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Finalizar pedido en WhatsApp
        </Button>

        <Button
          asChild
          onClick={onClose}
          variant="outline"
          className="w-full h-auto flex items-center justify-center px-6 py-3 rounded-xl font-medium group shadow-sm active:scale-95"
        >
          <Link href="/cart">
            Ver Carrito Completo
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </Button>
      </div>

      {/* Security Badge */}
      <div className={cn(
        "rounded-xl p-3 shadow-sm border border-border",
        "bg-card"
      )}>
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 bg-success rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
          </div>
          <span>Compra 100% segura y protegida</span>
        </div>
      </div>
    </div>
  );
}
