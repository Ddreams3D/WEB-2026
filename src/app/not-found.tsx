'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, MessageCircle } from 'lucide-react'; // Using Lucide icons consistently
import { Button } from '@/components/ui/button';
import ButtonRedirectWhatsapp from '@/shared/components/ButtonRedirectWhatsapp';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background overflow-hidden relative">
      
      {/* Background decoration elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
         <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary blur-3xl" />
         <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="max-w-2xl w-full mx-auto text-center relative z-10">
        
        {/* Fun 3D Print Failure Image/Illustration */}
        <div className="mb-6 relative h-64 w-64 mx-auto animate-float">
          {/* We use a placeholder div that looks like a spaghetti monster/failed print 
              In a real scenario, you'd use a real image like StoragePathBuilder.ui.placeholders('failed-print.png')
          */}
          <div className="w-full h-full relative flex items-center justify-center">
             <svg 
               viewBox="0 0 200 200" 
               className="w-full h-full text-primary drop-shadow-xl"
               fill="currentColor"
             >
                <path d="M40,160 C20,150 10,130 20,110 C30,90 20,70 40,60 C60,50 70,30 90,40 C110,50 130,40 150,60 C170,80 180,100 170,120 C160,140 170,160 150,170 C130,180 110,170 90,180 C70,190 50,170 40,160 Z" className="text-muted/20" />
                <path d="M50,150 Q70,130 90,150 T130,150 T170,150 M40,120 Q80,100 120,120 T180,120 M30,90 Q70,110 110,90 T170,90 M50,60 Q90,80 130,60" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-primary animate-pulse" />
                <circle cx="70" cy="80" r="5" className="text-background fill-current" />
                <circle cx="130" cy="80" r="5" className="text-background fill-current" />
                <path d="M80,110 Q100,100 120,110" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-background" />
             </svg>
             <div className="absolute -bottom-4 bg-background/80 backdrop-blur-sm px-4 py-1 rounded-full border border-border text-xs font-mono text-muted-foreground shadow-sm">
                Error: Desplazamiento de capa en altura Z=404
             </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            ¡Ups! Impresión fallida
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Parece que el extrusor se atascó y creamos un monstruo de espagueti. La página que buscas no se pudo &quot;imprimir&quot; correctamente.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full sm:w-auto min-w-[200px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <Link href="/">
              <Home className="h-5 w-5 mr-2" />
              Volver al inicio
            </Link>
          </Button>
          
          <ButtonRedirectWhatsapp 
            text="Reportar error"
            className="w-full sm:w-auto min-w-[200px]"
            message="Hola, encontré un error 404 (página no encontrada) en su sitio web."
          />
        </div>

        {/* Footer Links */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground">
           <button onClick={() => window.history.back()} className="hover:text-primary transition-colors flex items-center gap-1">
             <ArrowLeft className="w-4 h-4" /> Regresar
           </button>
           <span>•</span>
           <Link href="/contact" className="hover:text-primary transition-colors">
             Contactar soporte
           </Link>
        </div>
      </div>
    </div>
  );
}
