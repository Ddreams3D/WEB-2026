import { Rocket, TrendingUp } from 'lucide-react';
import React from 'react';
import InfoCard from '@/shared/components/InfoCard';

export default function AboutHistory() {
  return (
    <section className="py-20" aria-labelledby="history-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <span className="block text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3">
            Nuestra Historia
          </span>
          <h2
            id="history-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6"
          >
            ¿Cómo nace{' '}
            <span className="text-highlight-theme">
              Ddreams3D?
            </span>
          </h2>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-12 space-y-6 text-center">
            <p>
              Ddreams3D nace en Arequipa como un estudio creativo enfocado en modelado e impresión 3D, con el objetivo de desarrollar piezas funcionales, educativas y personalizadas para necesidades reales.
            </p>
            <p>
              A lo largo de más de 3 años, el proyecto ha evolucionado desde trabajos pequeños y experimentales hasta proyectos médicos, prototipos funcionales, trofeos y soluciones a medida para distintos sectores.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <InfoCard
              title="Nuestros inicios"
              icon={Rocket}
              description={
                <div className="space-y-3">
                  <p>
                    Comenzamos con equipos básicos, aprendizaje constante y proyectos reales.
                  </p>
                  <p>
                    Desde el inicio, el enfoque fue claro: hacer piezas bien pensadas, funcionales y adaptadas a cada cliente, sin soluciones genéricas.
                  </p>
                </div>
              }
            />
            
            <InfoCard
              title="Evolución del estudio"
              icon={TrendingUp}
              description={
                <div className="space-y-3">
                  <p>
                    Con el tiempo, Ddreams3D fue ampliando capacidades en modelado 3D, impresión, materiales y acabados, manteniendo siempre un trato directo y control total del proceso.
                  </p>
                  <p>
                    Hoy trabajamos como un estudio creativo unipersonal, apoyado por colaboradores cuando el proyecto lo requiere.
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
