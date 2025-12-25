'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw, Mail } from '@/lib/icons';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-4">
          <div className="max-w-md w-full mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
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
              <button
                onClick={reset}
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Intentar de nuevo
              </button>
              
              <Link
                href="/"
                className="inline-flex items-center justify-center w-full border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Volver al inicio
              </Link>
              
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Reportar problema
              </Link>
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