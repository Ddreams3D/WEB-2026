'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuthMock } from '../../contexts/AuthMockContext';
import { ArrowLeft, CreditCard, Truck, MapPin, Phone, Mail, User, MessageCircle } from '@/lib/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CheckoutFormData {
  // Datos personales
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Dirección de envío
  address: string;
  city: string;
  district: string;
  postalCode: string;
  reference: string;
  
  // Método de pago
  paymentMethod: 'card' | 'transfer' | 'whatsapp';
  
  // Notas adicionales
  notes: string;
}

export default function CheckoutPage() {
  const { items, itemCount, subtotal, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuthMock();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    reference: '',
    paymentMethod: 'card',
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [isAuthenticated, items.length, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular procesamiento del pedido
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crear objeto del pedido
      const orderData = {
        id: `ORDER-${Date.now()}`,
        items,
        customerData: formData,
        totals: {
          subtotal,
          shipping: 0,
          total
        },
        createdAt: new Date().toISOString()
      };

      // Guardar pedido en localStorage para la página de confirmación
      localStorage.setItem('ddreams-last-order', JSON.stringify(orderData));
      
      // Limpiar carrito
      await clearCart();
      
      // Redirigir según método de pago
      if (formData.paymentMethod === 'whatsapp') {
        // Crear mensaje para WhatsApp
        const whatsappMessage = createWhatsAppMessage(orderData);
        const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
      }
      
      // Redirigir a página de confirmación
      router.push('/order-confirmation');
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const createWhatsAppMessage = (orderData: any) => {
    let message = `🛒 *Nuevo Pedido - DDreams 3D*\n\n`;
    message += `📋 *Pedido:* ${orderData.id}\n`;
    message += `👤 *Cliente:* ${formData.firstName} ${formData.lastName}\n`;
    message += `📧 *Email:* ${formData.email}\n`;
    message += `📱 *Teléfono:* ${formData.phone}\n\n`;
    
    message += `📦 *Productos:*\n`;
    orderData.items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: S/ ${item.product.price.toFixed(2)}\n`;
      message += `   Subtotal: S/ ${(item.product.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `🏠 *Dirección de Envío:*\n`;
    message += `${formData.address}\n`;
    message += `${formData.district}, ${formData.city}\n`;
    message += `Código Postal: ${formData.postalCode}\n`;
    if (formData.reference) {
      message += `Referencia: ${formData.reference}\n`;
    }
    
    message += `\n💰 *Total: S/ ${orderData.totals.total.toFixed(2)}*\n\n`;
    
    if (formData.notes) {
      message += `📝 *Notas adicionales:*\n${formData.notes}\n\n`;
    }
    
    message += `¡Gracias por tu pedido! 🎉`;
    
    return message;
  };

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
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
            href="/cart" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Carrito
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Completa tu información para finalizar la compra</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-8">
              {/* Información Personal */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingresa tus nombres"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingresa tus apellidos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="999 999 999"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de Envío */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Dirección de Envío
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Av. Principal 123"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Distrito *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Miraflores"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Lima"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="15074"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referencia
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Frente al parque, casa azul"
                    />
                  </div>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Método de Pago
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="card" className="ml-3 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">Tarjeta de Crédito/Débito</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="transfer"
                      name="paymentMethod"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="transfer" className="ml-3 flex items-center">
                      <div className="h-5 w-5 mr-2 bg-green-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">Transferencia Bancaria</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="whatsapp"
                      name="paymentMethod"
                      value="whatsapp"
                      checked={formData.paymentMethod === 'whatsapp'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="whatsapp" className="ml-3 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">Contactar por WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notas Adicionales */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notas Adicionales</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instrucciones especiales para tu pedido..."
                />
              </div>
            </div>

            {/* Resumen del Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-lg shadow-soft sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h2>
                  
                  {/* Productos */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">{item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × S/ {item.product.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          S/ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Totales */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Envío</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-3">
                      <span>Total</span>
                      <span>S/ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Botón de Finalizar Compra */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      'Finalizar Compra'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}