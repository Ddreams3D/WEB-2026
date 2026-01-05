import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Wrench, Clock } from 'lucide-react';
import { Printer3DIcon } from '@/components/icons/Printer3DIcon';

const BenefitCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <Card className="border-none shadow-none bg-transparent animate-fade-in-up group perspective-1000" style={{ animationDelay: `${delay}ms` }}>
    <CardContent className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-background transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:border-primary/20">
      {/* Bubble Icon Container */}
      <div className="relative w-16 h-16 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110">
        {/* Bubble Glass Body */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_10px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4),inset_0_2px_8px_rgba(255,255,255,0.5)] transition-all duration-500"></div>
        
        {/* Bubble Reflection (Shine) */}
        <div className="absolute top-[15%] left-[15%] w-[25%] h-[15%] rounded-[50%] bg-gradient-to-b from-white/80 to-transparent rotate-45 blur-[0.5px]"></div>
        
        {/* Icon */}
        <Icon className="relative w-7 h-7 text-primary transition-all duration-500 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.6)] z-10" />
      </div>
      <h3 className="font-bold text-lg mb-3 text-foreground transition-colors duration-300 group-hover:text-primary">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed font-medium group-hover:text-foreground/80 transition-colors duration-300">
        {description}
      </p>
    </CardContent>
  </Card>
);

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: MapPin,
      title: "Local en Arequipa",
      description: "Estamos en Arequipa. Entregas rápidas en todos los distritos y atención personalizada, presencial o virtual."
    },
    {
      icon: Printer3DIcon,
      title: "Tecnología Avanzada",
      description: "Trabajamos con impresoras 3D FDM de alto rendimiento y un flujo optimizado de producción para lograr acabados limpios, precisión y tiempos de entrega confiables."
    },
    {
      icon: Wrench,
      title: "Diseño y Modelado",
      description: "¿No tienes el archivo 3D? No hay problema. Diseñamos tu idea desde cero y la convertimos en un modelo listo para imprimir."
    },
    {
      icon: Clock,
      title: "Rapidez y Garantía",
      description: "Cumplimos los plazos acordados. Si la pieza no cumple nuestros estándares, la reimprimimos sin costo."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">¿Por qué elegir Ddreams 3D?</h2>
          <p className="text-muted-foreground text-lg">
            Convertimos tus ideas en objetos reales con tecnología avanzada y atención personalizada en Arequipa.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <BenefitCard 
              key={idx}
              {...benefit}
              delay={idx * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
