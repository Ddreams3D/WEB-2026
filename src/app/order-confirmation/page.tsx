'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Package, Truck, MessageCircle, Download, ArrowLeft, Copy } from '@/lib/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderData {
  id: string;
  items: any[];
  customerData: any;
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Cargar datos del pedido desde localStorage
    const savedOrder = localStorage.getItem('ddreams-last-order');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        setOrderData(order);
      } catch (error) {
        console.error('Error parsing order data:', error);
        router.push('/marketplace');
      }
    } else {
      // Si no hay pedido, redirigir al marketplace
      router.push('/marketplace');
    }
  }, [router]);

  const copyOrderId = () => {
    if (orderData) {
      navigator.clipboard.writeText(orderData.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadOrderSummary = () => {
    if (!orderData) return;

    const orderSummary = `
RESUMEN DE PEDIDO - DDREAMS 3D
================================

Número de Pedido: ${orderData.id}
Fecha: ${new Date(orderData.createdAt).toLocaleDateString('es-PE')}

CLIENTE:
--------
Nombre: ${orderData.customerData.firstName} ${orderData.customerData.lastName}
Email: ${orderData.customerData.email}
Teléfono: ${orderData.customerData.phone}

DIRECCIÓN DE ENVÍO:
------------------
${orderData.customerData.address}
${orderData.customerData.district}, ${orderData.customerData.city}
Código Postal: ${orderData.customerData.postalCode}
${orderData.customerData.reference ? `Referencia: ${orderData.customerData.reference}` : ''}

PRODUCTOS:
----------
${orderData.items.map((item, index) => 
  `${index + 1}. ${item.product.name}
   Cantidad: ${item.quantity}
   Precio unitario: S/ ${item.product.price.toFixed(2)}
   Subtotal: S/ ${(item.product.price * item.quantity).toFixed(2)}`
).join('\n\n')}

TOTALES:
--------
Subtotal: S/ ${orderData.totals.subtotal.toFixed(2)}
Envío: Gratis
TOTAL: S/ ${orderData.totals.total.toFixed(2)}

MÉTODO DE PAGO: ${orderData.customerData.paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' : 
                   orderData.customerData.paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 
                   'Contacto por WhatsApp'}

${orderData.customerData.notes ? `NOTAS ADICIONALES:\n${orderData.customerData.notes}\n\n` : ''}
¡Gracias por tu compra!
DDreams 3D - Impresión 3D Personalizada
    `;

    const blob = new Blob([orderSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedido-${orderData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const contactWhatsApp = () => {
    if (!orderData) return;

    let message = `🛒 *Consulta sobre Pedido - DDreams 3D*\n\n`;
    message += `📋 *Número de Pedido:* ${orderData.id}\n`;
    message += `👤 *Cliente:* ${orderData.customerData.firstName} ${orderData.customerData.lastName}\n\n`;
    message += `Hola, tengo una consulta sobre mi pedido. ¿Podrían ayudarme?\n\n`;
    message += `¡Gracias! 😊`;

    const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de Confirmación */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
          <p className="text-gray-600 text-lg">
            Tu pedido ha sido recibido y está siendo procesado
          </p>
        </div>

        {/* Información del Pedido */}
        <div className="bg-surface rounded-lg shadow-soft mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pedido #{orderData.id}</h2>
                <p className="text-gray-600 mt-1">
                  Realizado el {new Date(orderData.createdAt).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={copyOrderId}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copiado!' : 'Copiar ID'}
              </button>
            </div>
          </div>

          {/* Estado del Pedido */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Pedido</h3>
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Confirmado</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">En Preparación</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-gray-600" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-500">En Camino</span>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Pedidos</h3>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      S/ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      S/ {item.product.price.toFixed(2)} c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de Envío */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Envío</h3>
            <div className="bg-background rounded-lg p-4">
              <p className="font-medium text-gray-900">
                {orderData.customerData.firstName} {orderData.customerData.lastName}
              </p>
              <p className="text-gray-600 mt-1">{orderData.customerData.address}</p>
              <p className="text-gray-600">
                {orderData.customerData.district}, {orderData.customerData.city}
              </p>
              {orderData.customerData.postalCode && (
                <p className="text-gray-600">CP: {orderData.customerData.postalCode}</p>
              )}
              {orderData.customerData.reference && (
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Referencia:</span> {orderData.customerData.reference}
                </p>
              )}
            </div>
          </div>

          {/* Resumen de Pago */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Pago</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>S/ {orderData.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-2">
                <span>Total</span>
                <span>S/ {orderData.totals.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Método de pago:</span>{' '}
                {orderData.customerData.paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' :
                 orderData.customerData.paymentMethod === 'transfer' ? 'Transferencia Bancaria' :
                 'Contacto por WhatsApp'}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={downloadOrderSummary}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Descargar Resumen
          </button>
          
          <button
            onClick={contactWhatsApp}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Contactar por WhatsApp
          </button>
          
          <Link
            href="/marketplace"
            className="flex items-center justify-center px-4 py-3 bg-neutral-600 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Seguir Comprando
          </Link>
        </div>

        {/* Información Adicional */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">¿Qué sigue?</h3>
          <div className="space-y-2 text-blue-800">
            <p>• Recibirás un email de confirmación en {orderData.customerData.email}</p>
            <p>• Te contactaremos por WhatsApp para coordinar los detalles de tu pedido</p>
            <p>• El tiempo de producción es de 3-5 días hábiles</p>
            <p>• El envío es gratuito dentro de Lima Metropolitana</p>
          </div>
        </div>

        {/* Botón Volver */}
        <div className="text-center mt-8">
          <Link 
            href="/marketplace" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}