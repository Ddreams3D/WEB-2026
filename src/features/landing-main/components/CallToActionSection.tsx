import React from 'react';
import { Button } from '@/components/ui';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';

export const CallToActionSection = () => {
  const whatsappMessage = encodeURIComponent("Hola, estoy interesado en sus servicios de impresión 3D en Arequipa.");
  const whatsappUrl = `https://wa.me/${PHONE_BUSINESS}?text=${whatsappMessage}`;

  return (
    <section className="py-32 relative overflow-hidden bg-slate-200 text-slate-900">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-200 to-blue-200/50 opacity-100" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">¿Listo para crear algo increíble?</h2>
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium">
          Cotiza tu proyecto hoy mismo y recibe un descuento especial en tu primer pedido online.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
           <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full shadow-xl hover:scale-105 transition-transform bg-slate-900 text-white hover:bg-slate-800" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Descubre como podemos ayudarte
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
