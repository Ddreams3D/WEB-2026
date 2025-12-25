'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from '@/lib/icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 px-4">
      <div className="max-w-md w-full mx-auto text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Página no encontrada
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver atrás
          </button>
          
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center w-full text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Explorar marketplace
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            Enlaces útiles:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/services" className="text-primary-600 dark:text-primary-400 hover:underline">
              Servicios
            </Link>
            <Link href="/about" className="text-primary-600 dark:text-primary-400 hover:underline">
              Nosotros
            </Link>
            <Link href="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}