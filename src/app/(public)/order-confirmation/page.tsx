'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Package, Truck, MessageCircle, Download, ArrowLeft, Copy } from '@/lib/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { CartItem } from '@/shared/types';

interface OrderCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  postalCode: string;
  reference?: string;
  paymentMethod: string;
  notes?: string;
}

interface OrderData {
  id: string;
  items: CartItem[];
  customerData: OrderCustomerData;
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
        router.push('/catalogo-impresion-3d');
      }
    } else {
      // Si no hay pedido, redirigir al catálogo
      router.push('/catalogo-impresion-3d');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de Confirmación */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">¡Pedido Confirmado!</h1>
          <p className="text-muted-foreground text-lg">
            Tu pedido ha sido recibido y está siendo procesado
          </p>
        </div>

        {/* Información del Pedido */}
        <div className="bg-card rounded-lg shadow-sm mb-8 overflow-hidden border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Pedido #{orderData.id}</h2>
                <p className="text-muted-foreground mt-1">
                  Realizado el {new Date(orderData.createdAt).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <Button
                onClick={copyOrderId}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copiado!' : 'Copiar ID'}
              </Button>
            </div>
          </div>

          {/* Estado del Pedido */}
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Estado del Pedido</h3>
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="ml-3 text-sm font-medium text-neutral-900 dark:text-white">Confirmado</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-neutral-900 dark:text-white">En Preparación</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                </div>
                <span className="ml-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">En Camino</span>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Productos Pedidos</h3>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={cn(
                    "w-16 h-16 rounded-lg flex items-center justify-center bg-muted"
                  )}>
                    <Package className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 dark:text-white">{item.product.name}</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">SKU: {item.product.sku}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900 dark:text-white">
                      S/ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      S/ {item.product.price.toFixed(2)} c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de Envío */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Información de Envío</h3>
            <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-4">
              <p className="font-medium text-neutral-900 dark:text-white">
                {orderData.customerData.firstName} {orderData.customerData.lastName}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300 mt-1">{orderData.customerData.address}</p>
              <p className="text-neutral-600 dark:text-neutral-300">
                {orderData.customerData.district}, {orderData.customerData.city}
              </p>
              {orderData.customerData.postalCode && (
                <p className="text-neutral-600 dark:text-neutral-300">CP: {orderData.customerData.postalCode}</p>
              )}
              {orderData.customerData.reference && (
                <p className="text-neutral-600 dark:text-neutral-300 mt-2">
                  <span className="font-medium">Referencia:</span> {orderData.customerData.reference}
                </p>
              )}
            </div>
          </div>

          {/* Resumen de Pago */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Resumen de Pago</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span>S/ {orderData.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Envío</span>
                <span className="text-green-600 dark:text-green-400">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-700 pt-2">
                <span>Total</span>
                <span>S/ {orderData.totals.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
              <p className="text-sm text-primary-800 dark:text-primary-200">
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
          <Button
            onClick={downloadOrderSummary}
            variant="gradient"
            className="flex items-center justify-center px-4 py-3 h-auto"
          >
            <Download className="h-5 w-5 mr-2" />
            Descargar Resumen
          </Button>
          
          <Button
            onClick={contactWhatsApp}
            variant="success"
            className="flex items-center justify-center px-4 py-3 h-auto"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Contactar por WhatsApp
          </Button>
          
          <Button
            asChild
            variant="secondary"
            className="flex items-center justify-center px-4 py-3 h-auto"
          >
            <Link
              href="/catalogo-impresion-3d"
            >
              Seguir Comprando
            </Link>
          </Button>
        </div>

        {/* Información Adicional */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 mb-8 border border-primary-100 dark:border-primary-800">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-3">¿Qué sigue?</h3>
          <div className="space-y-2 text-primary-800 dark:text-primary-200">
            <p>• Recibirás un email de confirmación en {orderData.customerData.email}</p>
            <p>• Te contactaremos por WhatsApp para coordinar los detalles de tu pedido</p>
            <p>• El tiempo de producción es de 3-5 días hábiles</p>
            <p>• El envío es gratuito dentro de Lima Metropolitana</p>
          </div>
        </div>

        {/* Botón Volver */}
        <div className="text-center mt-8">
          <Button 
            asChild
            variant="link"
            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            <Link href="/catalogo-impresion-3d">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Catálogo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}