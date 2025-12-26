import { Rocket, Target } from 'lucide-react';
import React from 'react';

export default function AboutMisionVision() {
  return (
    <section className="mb-20">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-white mr-3" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Nuestra Misión
              </h3>
            </div>
            <div className="text-primary-100 leading-relaxed text-base space-y-4">
              <p>
                Materializar ideas a través del diseño y la impresión 3D, desarrollando piezas funcionales, educativas, médicas y creativas, adaptadas a las necesidades reales de cada proyecto y cliente.
              </p>
              <p>
                Trabajamos con enfoque técnico, atención personalizada y procesos claros para convertir cada idea en un resultado concreto y bien ejecutado.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Rocket className="h-8 w-8 text-white mr-3" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Nuestra Visión
              </h3>
            </div>
            <div className="text-secondary-100 leading-relaxed text-base space-y-4">
              <p>
                Consolidarnos como un estudio creativo de referencia en impresión y modelado 3D, reconocido por la calidad de sus proyectos, la cercanía con sus clientes y la capacidad de adaptarse a distintos sectores y desafíos técnicos.
              </p>
              <p>
                Apostamos por crecer de forma responsable, ampliando nuestras capacidades y colaboraciones sin perder el trato directo ni el control del proceso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
