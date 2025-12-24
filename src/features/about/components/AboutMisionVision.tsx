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
            <p className="text-primary-100 leading-relaxed text-base">
              <strong>Democratizar el acceso a la tecnología 3D</strong> para
              todos. Creamos soluciones innovadoras y de máxima calidad que{' '}
              <em>impulsan el crecimiento</em> y fortalecen la competitividad de
              nuestros clientes, convirtiendo cada idea en una realidad
              extraordinaria.
            </p>
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
            <p className="text-secondary-100 leading-relaxed text-base">
              <strong>Ser la empresa líder en tecnología 3D</strong> de América
              Latina. Aspiramos a ser reconocidos mundialmente por nuestra{' '}
              <em>excelencia excepcional</em>, innovación disruptiva y
              compromiso inquebrantable con el desarrollo tecnológico sostenible
              de toda la región.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
