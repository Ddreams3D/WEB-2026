import { Rocket, TrendingUp } from 'lucide-react';
import React from 'react';

export default function AboutHistory() {
  return (
    <section className="mb-20">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            ¿Cómo nace Ddreams3D?
          </span>
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-8 space-y-4">
            <p>
              Ddreams3D nace en Arequipa como un estudio creativo enfocado en modelado e impresión 3D, con el objetivo de desarrollar piezas funcionales, educativas y personalizadas para necesidades reales.
            </p>
            <p>
              A lo largo de más de 3 años, el proyecto ha evolucionado desde trabajos pequeños y experimentales hasta proyectos médicos, prototipos funcionales, trofeos y soluciones a medida para distintos sectores.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-surface dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-neutral-700 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <Rocket className="h-5 w-5 text-primary-600 mr-2" />
                Nuestros inicios
              </h3>
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm space-y-2">
                <p>
                  Comenzamos con equipos básicos, aprendizaje constante y proyectos reales.
                </p>
                <p>
                  Desde el inicio, el enfoque fue claro: hacer piezas bien pensadas, funcionales y adaptadas a cada cliente, sin soluciones genéricas.
                </p>
              </div>
            </div>
            
            <div className="bg-surface dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-neutral-700 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 text-secondary-600 mr-2" />
                Evolución del estudio
              </h3>
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm space-y-2">
                <p>
                  Con el tiempo, Ddreams3D fue ampliando capacidades en modelado 3D, impresión, materiales y acabados, manteniendo siempre un trato directo y control total del proceso.
                </p>
                <p>
                  Hoy trabajamos como un estudio creativo unipersonal, apoyado por colaboradores cuando el proyecto lo requiere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
