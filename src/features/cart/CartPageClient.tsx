'use client';

import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageSquare } from '@/lib/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';
import { Button } from '@/components/ui';
import { ProductImage } from '@/shared/components/ui/DefaultImage';

export default function CartPageClient() {
  const {
    items,
    itemCount,
    subtotal,
    total,
    updateQuantity,
    removeFromCart,
    isLoading,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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
        item.customizations.forEach((cust: any) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 pt-20 lg:pt-24">
      {/* Header consistente con Marketplace */}
      <div className="bg-surface dark:bg-neutral-800 border-b border-soft dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link
              href="/marketplace"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Marketplace
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <ShoppingBag className="h-8 w-8 mr-3" />
                  Mi Carrito <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">({itemCount} {itemCount === 1 ? 'producto' : 'productos'})</span>
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Revisa y gestiona los productos que has seleccionado
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {items.length === 0 ? (
          /* Carrito vacío */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 dark:text-neutral-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              ¡Descubre nuestros increíbles productos 3D!
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Explorar Productos
            </Link>
          </div>
        ) : (
          /* Carrito con productos */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-surface dark:bg-neutral-800 rounded-lg shadow-soft border border-gray-100 dark:border-neutral-700">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Productos en tu carrito
                  </h2>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800/50"
                      >
                        {/* Grupo Superior Móvil: Imagen + Info */}
                        <div className="flex items-start space-x-4 w-full sm:w-auto flex-1">
                          {/* Imagen del producto */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-gray-200 dark:bg-neutral-700 rounded-lg overflow-hidden relative">
                              <ProductImage
                                src={item.product.images?.[0]?.url}
                                alt={item.product.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          {/* Información del producto */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              SKU: {item.product.sku}
                            </p>
                            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2 sm:hidden">
                              S/{' '}
                              {item.product.price
                                ? item.product.price.toFixed(2)
                                : '0.00'}
                            </p>
                            <p className="hidden sm:block text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2">
                              S/{' '}
                              {item.product.price
                                ? item.product.price.toFixed(2)
                                : '0.00'}
                            </p>
                          </div>
                        </div>

                        {/* Grupo Inferior Móvil: Controles + Subtotal + Eliminar */}
                        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 mt-2 sm:mt-0">
                          {/* Controles de cantidad */}
                          <div className="flex items-center space-x-3">
                            <Button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
                              disabled={isLoading}
                            >
                              <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </Button>
                            <span className="w-8 sm:w-12 text-center font-medium text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              variant="default"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              disabled={isLoading}
                            >
                              <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </Button>
                          </div>

                          {/* Subtotal del producto */}
                          <div className="text-right flex-1 sm:flex-none">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              S/{' '}
                              {item.product.price
                                ? (item.product.price * item.quantity).toFixed(2)
                                : '0.00'}
                            </p>
                          </div>

                          {/* Botón eliminar */}
                          <Button
                            onClick={() => removeFromCart(item.productId)}
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
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
                      href="/marketplace"
                    >
                      Continuar Comprando
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
