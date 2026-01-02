'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';

export default function OutOfSeasonLanding() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center bg-background">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <Calendar className="w-12 h-12 text-muted-foreground" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
        Campaña no disponible
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-8 text-lg">
        Esta campaña estacional no está activa en este momento. 
        ¡Pero no te preocupes! Nuestro catálogo completo sigue disponible.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="group">
          <Link href="/catalogo-impresion-3d">
            Ver Catálogo General
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            Volver al Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
