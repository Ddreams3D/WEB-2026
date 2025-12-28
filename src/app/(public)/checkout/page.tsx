'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft } from '@/lib/icons';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoading } = useCart();

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.replace('/cart');
    }
  }, [items, isLoading, router]);

  if (isLoading) {
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
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/cart" 
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al carrito
        </Link>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Proceso de Pago
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Esta funcionalidad está en desarrollo. Por favor, contacta con nosotros para finalizar tu compra.
          </p>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-200">
            Para proceder con tu pedido, puedes usar el botón de WhatsApp en la página del carrito.
          </div>
        </div>
      </div>
    </div>
  );
}