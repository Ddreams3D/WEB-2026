import React, { useState } from 'react';

import { Clock, Eye, Filter, Grid, X, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const galleryCategories = [
  'Medicina',
  'Arquitectura',
  'Educación',
  'Trofeos, Merchandising & Regalos',
  'Arte, Diseño & Modelado 3D',
  'Industria & Prototipado Funcional',
];

const categoryDescriptions: Record<string, string> = {
  Medicina:
    'Modelos médicos impresos en 3D para visualización, estudio y demostración. Trabajos realizados a partir de referencias reales para apoyo educativo y explicativo.',
  Arquitectura:
    'Maquetas arquitectónicas impresas en 3D para presentación y visualización de ideas. Modelos a escala enfocados en forma, volumen y distribución de proyectos.',
  Educación:
    'Modelos didácticos y maquetas educativas impresas en 3D para aprendizaje visual y práctico. Piezas pensadas para entornos académicos, escolares y universitarios.',
  'Trofeos, Merchandising & Regalos':
    'Trofeos, regalos personalizados y merchandising impreso en 3D para empresas y eventos. Piezas únicas diseñadas para reconocimiento, branding y uso cotidiano.',
  'Arte, Diseño & Modelado 3D':
    'Piezas artísticas, objetos decorativos y proyectos creativos impresos en 3D. Incluye modelado personalizado, esculturas, máscaras y diseños conceptuales.',
  'Industria & Prototipado Funcional':
    'Prototipos funcionales y piezas impresas en 3D para pruebas y validación de ideas. Soluciones orientadas a prototipado, adaptación y uso funcional.',
};

const galleryItems = [
  {
    id: 1,
    title: 'Modelos anatómicos impresos en 3D',
    category: 'Medicina',
    image: '/images/placeholder-medical.svg',
    description:
      'Modelos anatómicos realizados a partir de referencias reales para visualización, estudio y demostración.',
    material: 'PLA / Resina',
    duration: '3-5 días',
  },
  {
    id: 9,
    title: 'Modelos del aparato reproductor',
    category: 'Medicina',
    image: '/images/placeholder-medical.svg',
    description:
      'Modelos anatómicos enfocados en el estudio y explicación del sistema reproductor y salud femenina.',
    material: 'Resina / Silicona',
    duration: '4-6 días',
  },
  {
    id: 10,
    title: 'Prototipos médicos personalizados',
    category: 'Medicina',
    image: '/images/placeholder-prototype.svg',
    description:
      'Maquetas médicas desarrolladas a medida para explicar procedimientos y casos específicos.',
    material: 'Multimaterial',
    duration: '5-7 días',
  },
  {
    id: 11,
    title: 'Modelos médicos para educación',
    category: 'Medicina',
    image: '/images/placeholder-educational.svg',
    description:
      'Piezas impresas en 3D orientadas a enseñanza, formación académica y demostración médica.',
    material: 'PLA Resistente',
    duration: '3-5 días',
  },
  {
    id: 20,
    title: 'Maquetas arquitectónicas a escala',
    category: 'Arquitectura',
    image: '/images/placeholder-modeling.svg',
    description: 'Maquetas impresas en 3D para representar proyectos arquitectónicos de forma clara y visual.',
    material: 'PLA',
    duration: '7 días',
  },
  {
    id: 21,
    title: 'Modelos de viviendas y edificaciones',
    category: 'Arquitectura',
    image: '/images/placeholder-modeling.svg',
    description: 'Representaciones físicas de casas y edificaciones para mostrar volumen, distribución y concepto espacial.',
    material: 'PLA',
    duration: '7 días',
  },
  {
    id: 22,
    title: 'Maquetas para presentación de proyectos',
    category: 'Arquitectura',
    image: '/images/placeholder-modeling.svg',
    description: 'Modelos arquitectónicos orientados a exposiciones, entregas académicas y presentación de ideas.',
    material: 'PLA',
    duration: '5-7 días',
  },
  {
    id: 23,
    title: 'Modelos arquitectónicos conceptuales',
    category: 'Arquitectura',
    image: '/images/placeholder-modeling.svg',
    description: 'Maquetas impresas en 3D para exploración de formas, propuestas iniciales y estudios de diseño.',
    material: 'PLA',
    duration: '3-5 días',
  },
  {
    id: 30,
    title: 'Modelos didácticos impresos en 3D',
    category: 'Educación',
    image: '/images/placeholder-educational.svg',
    description: 'Modelos educativos diseñados para facilitar el aprendizaje visual y práctico en distintos niveles académicos.',
    material: 'PLA Multicolor',
    duration: '3-5 días',
  },
  {
    id: 31,
    title: 'Maquetas educativas para enseñanza',
    category: 'Educación',
    image: '/images/placeholder-educational.svg',
    description: 'Piezas impresas en 3D utilizadas como apoyo visual en clases, talleres y procesos de aprendizaje.',
    material: 'PLA',
    duration: '3-5 días',
  },
  {
    id: 32,
    title: 'Modelos científicos y académicos',
    category: 'Educación',
    image: '/images/placeholder-innovation.svg',
    description: 'Representaciones físicas de conceptos científicos para comprensión y demostración en entornos educativos.',
    material: 'PLA / Resina',
    duration: '4-6 días',
  },
  {
    id: 33,
    title: 'Proyectos académicos personalizados',
    category: 'Educación',
    image: '/images/placeholder-innovation.svg',
    description: 'Modelos impresos en 3D desarrollados a medida para trabajos universitarios y proyectos educativos.',
    material: 'Multimaterial',
    duration: '5-7 días',
  },
  {
    id: 40,
    title: 'Trofeos personalizados impresos en 3D',
    category: 'Trofeos, Merchandising & Regalos',
    image: '/images/placeholder-artistic.svg',
    description: 'Trofeos diseñados a medida para eventos, competencias y reconocimientos especiales.',
    material: 'PLA Silk / Resina',
    duration: '5-7 días',
  },
  {
    id: 41,
    title: 'Merchandising corporativo personalizado',
    category: 'Trofeos, Merchandising & Regalos',
    image: '/images/placeholder-artistic.svg',
    description: 'Objetos personalizados impresos en 3D para branding, promociones y uso empresarial.',
    material: 'PLA',
    duration: '3-5 días',
  },
  {
    id: 42,
    title: 'Regalos personalizados a medida',
    category: 'Trofeos, Merchandising & Regalos',
    image: '/images/placeholder-artistic.svg',
    description: 'Piezas únicas diseñadas según la idea del cliente para ocasiones especiales y regalos personalizados.',
    material: 'PLA / Resina',
    duration: '4-6 días',
  },
  {
    id: 43,
    title: 'Objetos funcionales y decorativos',
    category: 'Trofeos, Merchandising & Regalos',
    image: '/images/placeholder-artistic.svg',
    description: 'Soportes, coolers, llaveros y objetos de uso cotidiano impresos en 3D con diseño personalizado.',
    material: 'PLA',
    duration: '2-4 días',
  },
  {
    id: 50,
    title: 'Piezas artísticas impresas en 3D',
    category: 'Arte, Diseño & Modelado 3D',
    image: '/images/placeholder-artistic.svg',
    description: 'Objetos artísticos y decorativos creados mediante impresión 3D con enfoque estético y creativo.',
    material: 'Resina / PLA',
    duration: '5-10 días',
  },
  {
    id: 51,
    title: 'Modelado 3D personalizado',
    category: 'Arte, Diseño & Modelado 3D',
    image: '/images/placeholder-artistic.svg',
    description: 'Diseño y modelado de piezas desde cero según ideas, referencias o conceptos del cliente.',
    material: 'Digital / Impreso',
    duration: 'Variable',
  },
  {
    id: 52,
    title: 'Máscaras y piezas decorativas',
    category: 'Arte, Diseño & Modelado 3D',
    image: '/images/placeholder-artistic.svg',
    description: 'Piezas impresas en 3D orientadas a exhibición, decoración y proyectos creativos.',
    material: 'PLA / Resina',
    duration: '5-7 días',
  },
  {
    id: 53,
    title: 'Diseños conceptuales y esculturas',
    category: 'Arte, Diseño & Modelado 3D',
    image: '/images/placeholder-artistic.svg',
    description: 'Proyectos de diseño y esculturas impresas en 3D para exploración formal y conceptual.',
    material: 'Resina',
    duration: '7-14 días',
  },
  {
    id: 60,
    title: 'Prototipos funcionales impresos en 3D',
    category: 'Industria & Prototipado Funcional',
    image: '/images/placeholder-prototype.svg',
    description: 'Prototipos desarrollados para probar ideas, validar diseños y evaluar soluciones funcionales.',
    material: 'ABS / PETG',
    duration: '3-5 días',
  },
  {
    id: 61,
    title: 'Piezas técnicas personalizadas',
    category: 'Industria & Prototipado Funcional',
    image: '/images/placeholder-precision.svg',
    description: 'Piezas impresas en 3D diseñadas a medida para resolver necesidades técnicas específicas.',
    material: 'Nylon / ABS',
    duration: '4-6 días',
  },
  {
    id: 62,
    title: 'Herramientas y adaptadores funcionales',
    category: 'Industria & Prototipado Funcional',
    image: '/images/placeholder-precision.svg',
    description: 'Herramientas, soportes y adaptadores impresos en 3D para uso práctico y funcional.',
    material: 'PETG',
    duration: '3-5 días',
  },
  {
    id: 63,
    title: 'Prototipado para proyectos de ingeniería',
    category: 'Industria & Prototipado Funcional',
    image: '/images/placeholder-prototype.svg',
    description: 'Modelos y piezas impresas en 3D orientadas a pruebas, ajustes y desarrollo de proyectos técnicos.',
    material: 'Materiales Técnicos',
    duration: '5-7 días',
  },
];

export default function ServicesGalery() {
  const [selectedCategory, setSelectedCategory] = useState('Medicina');
  const [selectedProject, setSelectedProject] = useState<(typeof galleryItems)[0] | null>(null);

  const filteredGalleryItems = galleryItems.filter(
    (item) => item.category === selectedCategory
  );
  return (
    <section className="mb-12 sm:mb-16 lg:mb-20" aria-labelledby="gallery">
      <div className="text-center mb-8 sm:mb-12">
        <h2
          id="gallery"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
        >
          Industrias que{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            servimos
          </span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Aplicamos impresión 3D en distintos sectores, adaptándonos a cada necesidad.
        </p>
      </div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
        {galleryCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-md hover:shadow-lg'
            }`}
          >
            <Filter
              className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2"
              aria-hidden="true"
            />
            {category}
          </button>
        ))}
      </div>

      {/* Descripción de categoría dinámica */}
      <div className="text-center mb-10 max-w-4xl mx-auto px-4 animate-fade-in">
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
          {categoryDescriptions[selectedCategory]}
        </p>
      </div>

      {/* Grid de galería */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {filteredGalleryItems.map((item, index) => (
          <article
            key={item.id}
            className={`group bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 hover-lift hover-glow animate-fade-in-up stagger-${
              (index % 3) + 1
            }`}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <figure className="relative overflow-hidden">
              <Image
                src={item.image}
                alt={`Proyecto: ${item.title} - ${item.description}`}
                width={400}
                height={300}
                className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                  {item.category}
                </span>
              </div>
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setSelectedProject(item)}
                  className="w-full bg-white/90 backdrop-blur-sm text-neutral-900 py-2 px-4 rounded-lg font-medium hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg btn-enhanced hover:scale-105"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                  Ver Detalles
                </button>
              </div>
            </figure>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm sm:text-base line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              <Link
                href="/contact"
                className="mt-4 w-full bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white py-2 px-4 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FileText className="w-4 h-4" />
                Cotizar proyecto similar
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredGalleryItems.length === 0 && (
        <div className="text-center py-12">
          <Grid
            className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-400">
            No hay proyectos en esta categoría
          </p>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors z-10"
              aria-label="Cerrar detalles"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-80 w-full">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  {selectedProject.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                {selectedProject.title}
              </h3>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto bg-primary-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-primary-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FileText className="w-5 h-5" />
                  Cotizar proyecto similar
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
