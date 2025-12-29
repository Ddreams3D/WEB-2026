'use client';

import React from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from '@/lib/icons';
import { MessageSquare } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import Link from 'next/link';
import { ProductImage } from './DefaultImage';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, total, updateQuantity, removeFromCart, isLoading } =
    useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

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
    message += "Quedo atento para coordinar el pago y envío. ¡Gracias!";

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_BUSINESS}?text=${encodedMessage}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md shadow-2xl z-50 transform transition-all duration-300 ease-out border-l flex flex-col",
          "bg-card",
          "border-l-border",
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", "bg-accent/50")}>
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Mi Carrito
              </h2>
              <p className="text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/50 dark:hover:bg-neutral-700/50 transition-all duration-200 hover:scale-105"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-[55vh] bg-muted">
          <div
            className="flex-1 overflow-y-auto min-h-100"
            style={{ scrollbarWidth: 'thin' }}
          >
            {items.length === 0 ? (
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
                    onClick={onClose}
                    asChild
                    variant="gradient"
                    className="w-full px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Link href="/marketplace">Explorar Productos</Link>
                  </Button>
                  <Button
                    onClick={onClose}
                    asChild
                    variant="outline"
                    className="w-full px-6 py-3 rounded-xl font-medium"
                  >
                    <Link href="/contact">Cotizar Diseño Único</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "group rounded-xl p-4 shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-all duration-200 bg-card"
                    )}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden shadow-sm bg-muted">
                        <ProductImage
                          src={item.product.images?.[0]?.url}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate mb-1">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            S/.{' '}
                            {item.product.price
                              ? item.product.price.toFixed(2)
                              : '0.00'}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Total: S/.{' '}
                            {item.product.price
                              ? (item.product.price * item.quantity).toFixed(2)
                              : '0.00'}
                          </p>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600">
                            <Button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={isLoading}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none rounded-l-lg hover:bg-neutral-100 dark:hover:bg-neutral-600"
                            >
                              <Minus className="h-3 w-3 text-neutral-600 dark:text-neutral-300" />
                            </Button>
                            <span className="px-4 py-2 font-semibold text-sm min-w-[3rem] text-center text-neutral-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              disabled={isLoading}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none rounded-r-lg hover:bg-neutral-100 dark:hover:bg-neutral-600"
                            >
                              <Plus className="h-3 w-3 text-neutral-600 dark:text-neutral-300" />
                            </Button>
                          </div>

                          <Button
                            onClick={() => removeFromCart(item.productId)}
                            disabled={isLoading}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={cn("p-6 space-y-6", "bg-muted/50")}>
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
        )}
      </div>
    </>
  );
}
