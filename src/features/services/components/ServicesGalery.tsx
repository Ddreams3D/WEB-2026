import React, { useState } from 'react';

import { Clock, Eye, Filter, Grid } from 'lucide-react';
import Image from 'next/image';

const galleryCategories = [
  'Todos',
  'Medicina',
  'Arquitectura',
  'Educación',
  'Arte y Diseño',
  'Industria',
  'Automotriz',
];

const galleryItems = [
  {
    id: 1,
    title: 'Prótesis de Mano Funcional',
    category: 'Medicina',
    image: '/images/placeholder-prototype.svg',
    description: 'Prótesis personalizada con articulaciones móviles',
    material: 'PETG',
    duration: '5 días',
  },
  {
    id: 2,
    title: 'Maqueta Residencial',
    category: 'Arquitectura',
    image: '/images/placeholder-modeling.svg',
    description: 'Modelo arquitectónico detallado a escala 1:100',
    material: 'PLA',
    duration: '7 días',
  },
  {
    id: 3,
    title: 'Modelo Molecular',
    category: 'Educación',
    image: '/images/placeholder-innovation.svg',
    description: 'Estructura molecular para enseñanza universitaria',
    material: 'PLA Multicolor',
    duration: '3 días',
  },
  {
    id: 4,
    title: 'Joyería Personalizada',
    category: 'Arte y Diseño',
    image: '/images/placeholder-artistic.svg',
    description: 'Anillo con diseño geométrico único',
    material: 'Resina',
    duration: '2 días',
  },
  {
    id: 5,
    title: 'Herramienta Industrial',
    category: 'Industria',
    image: '/images/placeholder-precision.svg',
    description: 'Plantilla de montaje para línea de producción',
    material: 'ABS',
    duration: '4 días',
  },
  {
    id: 6,
    title: 'Pieza Automotriz',
    category: 'Automotriz',
    image: '/images/placeholder-precision.svg',
    description: 'Repuesto personalizado para vehículo clásico',
    material: 'PETG',
    duration: '6 días',
  },
  {
    id: 7,
    title: 'Implante Dental',
    category: 'Medicina',
    image: '/images/placeholder-prototype.svg',
    description: 'Guía quirúrgica para implante dental',
    material: 'Resina Biocompatible',
    duration: '3 días',
  },
  {
    id: 8,
    title: 'Escultura Artística',
    category: 'Arte y Diseño',
    image: '/images/placeholder-artistic.svg',
    description: 'Escultura abstracta para exposición',
    material: 'PLA Premium',
    duration: '8 días',
  },
];

export default function ServicesGalery() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredGalleryItems =
    selectedCategory === 'Todos'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);
  return (
    <section className="mb-12 sm:mb-16 lg:mb-20" aria-labelledby="gallery">
      <div className="text-center mb-8 sm:mb-12">
        <h2
          id="gallery"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-neutral-900 dark:text-white"
        >
          Galería de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Trabajos
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          Explora algunos de nuestros proyectos más destacados y descubre la
          calidad y precisión de nuestro trabajo
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
                <button className="w-full bg-white/90 backdrop-blur-sm text-neutral-900 py-2 px-4 rounded-lg font-medium hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg btn-enhanced hover:scale-105">
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
              <div className="flex justify-between items-center text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <Grid className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                  <span>{item.material}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                  <span>{item.duration}</span>
                </div>
              </div>
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
    </section>
  );
}
