'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCheckout } from '@/features/checkout/hooks/useCheckout';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { OrderSummary } from '@/features/checkout/components/OrderSummary';

export default function CheckoutPage() {
  const {
    items,
    isLoading,
    totalPrice,
    formData,
    errors,
    handleInputChange,
    handleWhatsAppOrder,
    formatPrice
  } = useCheckout();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Cargando tu pedido...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background/50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al carrito
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Finalizar Pedido</h1>
          <p className="text-muted-foreground mt-2">Completa tus datos para enviar tu pedido por WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna Izquierda: Formulario */}
          <CheckoutForm 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          {/* Columna Derecha: Resumen */}
          <OrderSummary 
            items={items}
            totalPrice={totalPrice}
            formatPrice={formatPrice}
            handleWhatsAppOrder={handleWhatsAppOrder}
            formData={formData}
          />

        </div>
      </div>
    </div>
  );
}
