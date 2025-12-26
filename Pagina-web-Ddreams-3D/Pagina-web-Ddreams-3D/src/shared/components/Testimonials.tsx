'use client';

import React, { useState } from 'react';
import { Star, Quote, Filter, Share2, ExternalLink } from '@/lib/icons';
import {
  useStaggeredItemsAnimation,
  getAnimationClasses,
} from '../hooks/useIntersectionAnimation';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  industry: string;
  projectType?: string;
  caseStudyUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    role: 'Director de Innovación',
    company: 'TechPro Industries',
    content:
      'El servicio de Ddreams 3D superó nuestras expectativas. La calidad de los prototipos y la atención al detalle fueron excepcionales. Redujimos nuestro tiempo de desarrollo en un 40% gracias a sus prototipos precisos.',
    rating: 5,
    industry: 'Tecnología',
    projectType: 'Prototipos Funcionales',
    caseStudyUrl: '/casos-estudio/techpro-industries',
  },
  {
    id: '2',
    name: 'Ana García',
    role: 'Arquitecta',
    company: 'Studio Design',
    content:
      'Las maquetas arquitectónicas que realizaron para nuestro proyecto fueron fundamentales para ganar la licitación. La precisión milimétrica y los acabados profesionales impresionaron a nuestros clientes.',
    rating: 5,
    industry: 'Arquitectura',
    projectType: 'Maquetas Arquitectónicas',
    caseStudyUrl: '/casos-estudio/studio-design',
  },
  {
    id: '3',
    name: 'Miguel Torres',
    role: 'Diseñador Industrial',
    content:
      'La precisión y rapidez en la entrega de los prototipos nos permitió optimizar nuestro proceso de desarrollo de productos. Su asesoramiento técnico fue invaluable para seleccionar los materiales correctos.',
    rating: 4,
    industry: 'Diseño Industrial',
    projectType: 'Prototipos de Producto',
  },
  {
    id: '4',
    name: 'Laura Mendoza',
    role: 'Directora Médica',
    company: 'Clínica Innovación',
    content:
      'Los modelos anatómicos impresos en 3D han revolucionado nuestras cirugías. La precisión es extraordinaria y nos ha permitido planificar procedimientos complejos con total confianza.',
    rating: 5,
    industry: 'Medicina',
    projectType: 'Modelos Anatómicos',
    caseStudyUrl: '/casos-estudio/clinica-innovacion',
  },
  {
    id: '5',
    name: 'Roberto Silva',
    role: 'Ingeniero Mecánico',
    company: 'AutoTech Solutions',
    content:
      'Trabajar con Ddreams 3D ha sido excepcional. Sus prototipos funcionales nos permitieron validar nuestros diseños antes de la producción en masa, ahorrando tiempo y costos significativos.',
    rating: 5,
    industry: 'Automotriz',
    projectType: 'Prototipos Industriales',
  },
  {
    id: '6',
    name: 'Patricia Vega',
    role: 'Diseñadora de Joyas',
    company: 'Atelier Vega',
    content:
      'La calidad de impresión para mis diseños de joyería es impecable. Cada detalle se reproduce fielmente, permitiendo crear piezas únicas que mis clientes adoran.',
    rating: 5,
    industry: 'Joyería',
    projectType: 'Diseño de Joyas',
  },
];

export default function Testimonials() {
  const { ref, visibleItems } = useStaggeredItemsAnimation(
    testimonials.length,
    200
  );
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Todos');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique industries
  const industries = [
    'Todos',
    ...Array.from(new Set(testimonials.map((t) => t.industry))),
  ];

  // Filter testimonials by industry
  const filteredTestimonials =
    selectedIndustry === 'Todos'
      ? testimonials
      : testimonials.filter((t) => t.industry === selectedIndustry);

  const shareTestimonial = (testimonial: Testimonial) => {
    if (navigator.share) {
      navigator.share({
        title: `Testimonio de ${testimonial.name}`,
        text: testimonial.content,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `"${testimonial.content}" - ${testimonial.name}, ${testimonial.role}${
          testimonial.company ? ` en ${testimonial.company}` : ''
        }`
      );
    }
  };

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"
      role="region"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4"
          >
            Lo que dicen nuestros{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              clientes
            </span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Descubre cómo hemos transformado las ideas de nuestros clientes en
            soluciones digitales exitosas
          </p>
        </div>

        <div
          className="relative"
          role="region"
          aria-label="Carrusel de testimonios"
        >
          {/* Industry Filter */}
          <div className="mb-6 sm:mb-8 hidden">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:shadow-md transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                aria-expanded={showFilters}
                aria-controls="filter-options"
                aria-label="Alternar filtros de testimonios"
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-medium">
                  Filtrar por industria
                </span>
              </button>
            </div>
            {showFilters && (
              <div
                id="filter-options"
                className="mt-4 flex flex-wrap justify-center gap-2"
                role="group"
                aria-label="Filtros por industria"
              >
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => setSelectedIndustry(industry)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
                      selectedIndustry === industry
                        ? 'bg-primary-500 text-white shadow-md scale-105 hover:shadow-lg'
                        : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-sm'
                    }`}
                    aria-pressed={selectedIndustry === industry}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Status */}
        <div className="flex justify-center mb-6">
          <div
            className="text-sm text-neutral-600 dark:text-neutral-400"
            aria-live="polite"
          >
            Mostrando {filteredTestimonials.length} testimonio
            {filteredTestimonials.length !== 1 ? 's' : ''}
            {selectedIndustry !== 'Todos' && ` de ${selectedIndustry}`}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
          aria-live="polite"
        >
          {filteredTestimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className={`group bg-gradient-to-br from-white via-neutral-50 to-neutral-25 dark:from-neutral-800 dark:via-neutral-750 dark:to-neutral-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-4 sm:p-5 relative transform hover:scale-[1.005] hover:-translate-y-0.5 border border-neutral-300 dark:border-neutral-600 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-neutral-900 ${getAnimationClasses(
                visibleItems?.[index] || false,
                index
              )}`}
              tabIndex={0}
              role="article"
              aria-labelledby={`testimonial-${testimonial.id}-name`}
              aria-describedby={`testimonial-${testimonial.id}-content`}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />
              <Quote
                className="absolute top-3 sm:top-4 right-3 sm:right-4 h-6 w-6 sm:h-8 sm:w-8 text-primary-200 dark:text-primary-700 group-hover:text-primary-400 transition-colors duration-300 group-hover:scale-110 transform"
                aria-hidden="true"
              />

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 ring-2 ring-primary-100 dark:ring-primary-800 group-hover:ring-primary-300 dark:group-hover:ring-primary-600">
                  {testimonial.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="flex items-center gap-0.5 sm:gap-1 mb-2"
                    role="img"
                    aria-label={`Calificación: ${testimonial.rating} de 5 estrellas`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <blockquote
                    id={`testimonial-${testimonial.id}-content`}
                    className="text-neutral-800 dark:text-neutral-200 mb-3 text-sm sm:text-base leading-relaxed font-medium group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors duration-300 line-clamp-3 italic"
                  >
                    &quot;{testimonial.content}&quot;
                  </blockquote>

                  <footer>
                    <cite className="not-italic">
                      <h4
                        id={`testimonial-${testimonial.id}-name`}
                        className="font-bold text-sm sm:text-base lg:text-lg bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-secondary-700 transition-all duration-300 leading-tight"
                      >
                        {testimonial.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors duration-300 font-medium leading-tight">
                        {testimonial.role}
                        {testimonial.company && (
                          <span className="block sm:inline">
                            <span className="hidden sm:inline"> - </span>
                            <span className="text-primary-600 dark:text-primary-400 font-semibold">
                              {testimonial.company}
                            </span>
                          </span>
                        )}
                      </p>

                      {/* Project Type and Industry Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                          {testimonial.industry}
                        </span>
                        {testimonial.projectType && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded-full">
                            {testimonial.projectType}
                          </span>
                        )}
                      </div>
                    </cite>

                    {/* Action Buttons */}
                    {/* <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                       <button
                         onClick={() => shareTestimonial(testimonial)}
                         className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950 hover:shadow-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                         title="Compartir testimonio"
                         aria-label={`Compartir testimonio de ${testimonial.name}`}
                       >
                         <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                         <span className="font-semibold">Compartir</span>
                       </button>
                       
                       {testimonial.caseStudyUrl && (
                         <a
                           href={testimonial.caseStudyUrl}
                           className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-secondary-700 dark:hover:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-950 hover:shadow-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                           title="Ver caso de estudio completo"
                           aria-label={`Ver caso de estudio de ${testimonial.name}`}
                           target="_blank"
                           rel="noopener noreferrer"
                         >
                           <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                           <span className="font-semibold">Caso de Estudio</span>
                         </a>
                       )}
                     </div> */}
                  </footer>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
