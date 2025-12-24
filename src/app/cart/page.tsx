'use client';

import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuthMock } from '../../contexts/AuthMockContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageSquare } from '@/lib/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PHONE_BUSINESS } from '@/shared/constants/infoBusiness';
import { ProductImage } from '@/shared/components/ui/DefaultImage';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    total,
    updateQuantity,
    removeFromCart,
    isLoading,
  } = useCart();
  const { isAuthenticated } = useAuthMock();
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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Marketplace
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="h-8 w-8 mr-3" />
            Mi Carrito ({itemCount} {itemCount === 1 ? 'producto' : 'productos'}
            )
          </h1>
        </div>

        {items.length === 0 ? (
          /* Carrito vacío */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              ¡Descubre nuestros increíbles productos 3D!
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explorar Productos
            </Link>
          </div>
        ) : (
          /* Carrito con productos */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-lg shadow-soft">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Productos en tu carrito
                  </h2>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                      >
                        {/* Imagen del producto */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden relative">
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
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            SKU: {item.product.sku}
                          </p>
                          <p className="text-lg font-semibold text-blue-600 mt-2">
                            S/{' '}
                            {item.product.price
                              ? item.product.price.toFixed(2)
                              : '0.00'}
                          </p>
                        </div>

                        {/* Controles de cantidad */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            disabled={isLoading}
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="w-12 text-center font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Subtotal del producto */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            S/{' '}
                            {item.product.price
                              ? (item.product.price * item.quantity).toFixed(2)
                              : '0.00'}
                          </p>
                        </div>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-lg shadow-soft sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Resumen del pedido
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        Subtotal ({itemCount}{' '}
                        {itemCount === 1 ? 'producto' : 'productos'})
                      </span>
                      <span>S/ {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Envío</span>
                      <span className="text-green-600">Gratis</span>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>S/ {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleWhatsAppCheckout}
                    disabled={isLoading || items.length === 0}
                    className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Finalizar pedido en WhatsApp
                  </button>

                  <Link
                    href="/marketplace"
                    className="block w-full mt-3 text-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
