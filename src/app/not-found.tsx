'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { colors } from '@/shared/styles/colors';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className={cn("min-h-screen flex items-center justify-center px-4", colors.gradients.backgroundPage)}>
      <div className="max-w-md w-full mx-auto text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className={cn("text-9xl font-bold", colors.gradients.textPrimary)}>
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
          <Button
            asChild
            variant="gradient"
            className="w-full px-6 py-3 h-auto text-base rounded-lg font-medium shadow-lg hover:shadow-xl"
          >
            <Link href="/">
              <Home className="h-5 w-5 mr-2" />
              Volver al inicio
            </Link>
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full px-6 py-3 h-auto text-base"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver atrás
          </Button>
          
          <Button
            asChild
            variant="ghost"
            className="w-full px-6 py-3 h-auto text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/10"
          >
            <Link href="/marketplace">
              <Search className="h-5 w-5 mr-2" />
              Explorar marketplace
            </Link>
          </Button>
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