import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from '@/lib/icons';

interface CartHeaderProps {
  itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="bg-surface dark:bg-neutral-800 border-b border-soft dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Link
            href="/catalogo-impresion-3d"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Catálogo
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
  );
}
