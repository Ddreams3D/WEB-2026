'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw, Mail } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
          <div className="max-w-md w-full mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-destructive/10">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                ¡Algo salió mal!
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ha ocurrido un error inesperado en la aplicación. Nuestro equipo ha sido notificado.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left bg-muted p-4 rounded-lg text-sm">
                  <summary className="cursor-pointer font-medium text-foreground mb-2">
                    Detalles del error (desarrollo)
                  </summary>
                  <pre className="text-destructive whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                  {error.digest && (
                    <p className="mt-2 text-muted-foreground">
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
                variant="default"
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
                className="w-full h-auto px-6 py-3 text-base font-medium justify-center text-primary hover:text-primary/80"
              >
                <Link href="/contact">
                  <Mail className="h-5 w-5 mr-2" />
                  Reportar problema
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Si el problema persiste, por favor contacta a nuestro equipo de soporte.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}