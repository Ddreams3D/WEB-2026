'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw, ArrowLeft } from '@/lib/icons';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center px-4",
      colors.gradients.backgroundWarning
    )}>
      <div className="max-w-md w-full mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Error en la página
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
            Ha ocurrido un error al cargar esta página. Por favor, intenta de nuevo.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-sm">
              <summary className="cursor-pointer font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Detalles del error (desarrollo)
              </summary>
              <pre className="text-orange-600 dark:text-orange-400 whitespace-pre-wrap break-words">
                {error.message}
              </pre>
              {error.digest && (
                <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                  Error ID: {error.digest}
                </p>
              )}
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={reset}
            variant="gradient"
            className="w-full px-6 py-3 h-auto text-base"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Intentar de nuevo
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
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
            <Link href="/">
              <Home className="h-5 w-5 mr-2" />
              Ir al inicio
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Si el problema persiste, por favor{' '}
            <Link href="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">
              contáctanos
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}