import { Rocket, TrendingUp } from 'lucide-react';
import React from 'react';

export default function AboutHistory() {
  return (
    <section className="mb-20">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Nuestra Historia de Innovación
          </span>
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            Desde nuestra fundación en 2020, hemos recorrido un camino
            extraordinario de crecimiento y evolución constante. Lo que comenzó
            como una visión audaz para democratizar la tecnología 3D en Perú, se
            ha transformado en una realidad que trasciende fronteras.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-surface dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-neutral-700 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <Rocket className="h-5 w-5 text-primary-600 mr-2" />
                Nuestros Inicios
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                Iniciamos con equipos básicos y grandes sueños. Nuestro primer
                objetivo fue claro: hacer accesible la tecnología 3D para
                pequeñas y medianas empresas que antes no podían permitirse
                estas soluciones innovadoras.
              </p>
            </div>
            <div className="bg-surface dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-neutral-700 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 text-secondary-600 mr-2" />
                Crecimiento Sostenido
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                Con sede en Arequipa, somos una empresa en constante crecimiento
                que se ha ganado la confianza de clientes locales y regionales.
                Aunque somos una empresa pequeña, nuestro compromiso con la
                calidad y la innovación nos impulsa hacia nuevos horizontes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
