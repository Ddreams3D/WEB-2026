'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Printer, ArrowRight, Clock, Box, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

interface OutOfSeasonProps {
  themeName?: string;
  nextStartDate?: Date;
}

export default function OutOfSeasonLanding({ themeName, nextStartDate }: OutOfSeasonProps) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const { user } = useAuth();
  const pathname = usePathname();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (nextStartDate) {
      const diff = nextStartDate.getTime() - new Date().getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    }
  }, [nextStartDate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center bg-background relative overflow-hidden">
      
      {/* Background Decor - Blueprint grid effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />

      <div className="max-w-2xl w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Admin Preview Shortcut */}
        {isAdmin && (
          <div className="absolute top-4 right-4 animate-in fade-in duration-500">
            <Button asChild variant="outline" size="sm" className="bg-background/80 backdrop-blur border-dashed border-primary/50 text-primary hover:bg-primary/10">
              <Link href={`${pathname}?preview=true`}>
                <Lock className="w-3 h-3 mr-2" />
                Admin Preview
              </Link>
            </Button>
          </div>
        )}
        
        {/* Icon Animation Wrapper */}
        <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
            <div className="relative w-full h-full bg-primary/5 rounded-full flex items-center justify-center border border-primary/20">
                <Printer className="w-16 h-16 text-primary animate-pulse" />
            </div>
            {/* Floating particles */}
            <Box className="absolute -top-2 -right-2 w-8 h-8 text-muted-foreground/40 animate-bounce delay-100" />
            <Clock className="absolute -bottom-2 -left-2 w-8 h-8 text-muted-foreground/40 animate-bounce delay-700" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {themeName ? `Imprimiendo: ${themeName}...` : 'Calibrando Impresora...'}
        </h1>
        
        <div className="space-y-4 mb-10">
          <p className="text-xl font-medium text-foreground">
             Estamos preparando los modelos 3D para la próxima campaña.
          </p>
          
          {daysLeft !== null && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg text-secondary-foreground border border-secondary">
              <Clock className="w-5 h-5" />
              <span className="font-bold">
                Faltan aproximadamente {daysLeft} {daysLeft === 1 ? 'día' : 'días'} para el lanzamiento
              </span>
            </div>
          )}
          
          <p className="text-muted-foreground">
            Nuestras impresoras están trabajando a máxima velocidad para traerte diseños exclusivos. 
            Mientras tanto, ¡no dejes que se enfríe la cama caliente!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto text-base h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            <Link href="/catalogo-impresion-3d">
              <Box className="mr-2 h-5 w-5" />
              Explorar Catálogo Actual
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto text-base h-12">
            <Link href="/">
              Volver al Inicio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Technical Footer Decoration */}
        <div className="mt-12 pt-6 border-t border-border/50 flex justify-between text-xs font-mono text-muted-foreground">
            <span>NOZZLE_TEMP: 210°C</span>
            <span>BED_TEMP: 60°C</span>
            <span>STATUS: PREPARING</span>
        </div>
      </div>
    </div>
  );
}
