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
import { PHONE_BUSINESS } from '@/shared/constants/infoBusiness';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, total, updateQuantity, removeFromCart, isLoading } =
    useCart();

  // Detectar tema oscuro
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Observar cambios en el tema
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // No bloquear el scroll del body - permitir scroll natural

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
        className={`fixed right-0 top-0 h-full w-full max-w-md shadow-2xl z-50 transform transition-all duration-300 ease-out border-l flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: isDarkMode
            ? 'rgb(31, 41, 55)'
            : 'rgb(255, 255, 255)',
          borderLeftColor: isDarkMode
            ? 'rgb(75, 85, 99)'
            : 'rgb(229, 231, 235)',
          boxShadow: isDarkMode
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200/30 dark:border-neutral-700/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Mi Carrito
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 dark:hover:bg-neutral-700/50 rounded-full transition-all duration-200 hover:scale-105"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-neutral-100 dark:bg-neutral-600 flex-1 flex flex-col min-h-[55vh]">
          <div
            className="flex-1 overflow-y-auto min-h-100"
            style={{ scrollbarWidth: 'thin' }}
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6">
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-6">
                  <ShoppingCart className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                  Tu carrito está vacío
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm">
                  Descubre nuestros increíbles productos y comienza a llenar tu
                  carrito
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Explorar Productos
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 rounded-xl overflow-hidden shadow-sm">
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
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
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
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={isLoading}
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-l-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
                            >
                              <Minus className="h-3 w-3 text-neutral-600 dark:text-neutral-300" />
                            </button>
                            <span className="px-4 py-2 font-semibold text-sm min-w-[3rem] text-center text-neutral-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              disabled={isLoading}
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-r-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
                            >
                              <Plus className="h-3 w-3 text-neutral-600 dark:text-neutral-300" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            disabled={isLoading}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
          <div className="p-6 space-y-6 bg-neutral-100 dark:bg-neutral-600">
            {/* Price Summary */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-100 dark:border-neutral-700 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Subtotal ({itemCount}{' '}
                  {itemCount === 1 ? 'producto' : 'productos'}):
                </span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  S/ {total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Envío:
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Gratis
                </span>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-600 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    S/ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Finalizar pedido en WhatsApp
              </button>

              <Link
                href="/cart"
                onClick={onClose}
                className="w-full flex items-center justify-center px-6 py-3 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition-all duration-200 font-medium group shadow-sm"
              >
                Ver Carrito Completo
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* Security Badge */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-3 shadow-sm border border-neutral-100 dark:border-neutral-700">
              <div className="flex items-center justify-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
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
