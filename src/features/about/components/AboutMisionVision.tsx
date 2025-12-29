import { Rocket, Target } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import InfoCard from '@/shared/components/InfoCard';

export default function AboutMisionVision() {
  return (
    <section className="py-20" aria-labelledby="mission-vision-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <span className="block text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
            Nuestro Propósito
          </span>
          <h2
            id="mission-vision-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6"
          >
            Lo Que Nos{' '}
            <span className="text-primary">
              Impulsa
            </span>
          </h2>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            title="Nuestra Misión"
            icon={Target}
            description={
              <div className="space-y-4">
                <p>
                  Materializar ideas a través del diseño y la impresión 3D, desarrollando piezas funcionales, educativas, médicas y creativas, adaptadas a las necesidades reales de cada proyecto y cliente.
                </p>
                <p>
                  Trabajamos con enfoque técnico, atención personalizada y procesos claros para convertir cada idea en un resultado concreto y bien ejecutado.
                </p>
              </div>
            }
          />

          <InfoCard
            title="Nuestra Visión"
            icon={Rocket}
            description={
              <div className="space-y-4">
                <p>
                  Consolidarnos como un estudio creativo de referencia en impresión y modelado 3D, reconocido por la calidad de sus proyectos, la cercanía con sus clientes y la capacidad de adaptarse a distintos sectores y desafíos técnicos.
                </p>
                <p>
                  Apostamos por crecer de forma responsable, ampliando nuestras capacidades y colaboraciones sin perder el trato directo ni el control del proceso.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
