'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw, ArrowLeft } from '@/lib/icons';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Error en la página
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Ha ocurrido un error al cargar esta página. Por favor, intenta de nuevo.
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
            className="w-full px-6 py-3 h-auto text-base text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            <Link href="/">
              <Home className="h-5 w-5 mr-2" />
              Ir al inicio
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Si el problema persiste, por favor{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contáctanos
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}