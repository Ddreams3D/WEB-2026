'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw, Mail } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className={cn(
          "min-h-screen flex items-center justify-center px-4",
          colors.gradients.backgroundError
        )}>
          <div className="max-w-md w-full mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className={cn("mx-auto w-20 h-20 rounded-full flex items-center justify-center", colors.status.error.bg)}>
                <AlertTriangle className={cn("h-10 w-10", colors.status.error.text)} />
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                ¡Algo salió mal!
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                Ha ocurrido un error inesperado en la aplicación. Nuestro equipo ha sido notificado.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-sm">
                  <summary className="cursor-pointer font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Detalles del error (desarrollo)
                  </summary>
                  <pre className="text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
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
                className="w-full h-auto px-6 py-3 text-base font-medium"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Intentar de nuevo
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="w-full h-auto px-6 py-3 text-base font-medium justify-center"
              >
                <Link href="/">
                  <Home className="h-5 w-5 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
              
              <Button
                asChild
                variant="ghost"
                className="w-full h-auto px-6 py-3 text-base font-medium justify-center text-primary-600 dark:text-primary-400"
              >
                <Link href="/contact">
                  <Mail className="h-5 w-5 mr-2" />
                  Reportar problema
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Si el problema persiste, por favor contacta a nuestro equipo de soporte.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}