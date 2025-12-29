'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Quote, Filter, Share2, ExternalLink } from '@/lib/icons';
import {
  useStaggeredItemsAnimation,
  getAnimationClasses,
} from '../hooks/useIntersectionAnimation';
import { cn } from '@/lib/utils';

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

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 lg:py-20"
      role="region"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4"
          >
            Lo que dicen nuestros{' '}
            <span className={cn(
              "bg-clip-text text-transparent bg-primary",
            )}>
              clientes
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                aria-expanded={showFilters}
                aria-controls="filter-options"
                aria-label="Alternar filtros de testimonios"
              >
                <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                <span className="text-sm font-medium">
                  Filtrar por industria
                </span>
              </Button>
            </div>
            {showFilters && (
              <div
                id="filter-options"
                className="mt-4 flex flex-wrap justify-center gap-2"
                role="group"
                aria-label="Filtros por industria"
              >
                {industries.map((industry) => (
                  <Button
                    key={industry}
                    onClick={() => setSelectedIndustry(industry)}
                    variant={selectedIndustry === industry ? 'gradient' : 'outline'}
                    className="rounded-full h-auto py-1.5 px-3"
                    aria-pressed={selectedIndustry === industry}
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Status */}
        <div className="flex justify-center mb-6">
          <div
            className="text-sm text-muted-foreground"
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
              className={cn(
                "group rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-4 sm:p-5 relative transform hover:scale-[1.005] hover:-translate-y-0.5 border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                "bg-card text-card-foreground",
                getAnimationClasses(visibleItems?.[index] || false, index)
              )}
              tabIndex={0}
              role="article"
              aria-labelledby={`testimonial-${testimonial.id}-name`}
              aria-describedby={`testimonial-${testimonial.id}-content`}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  "bg-accent/50"
                )}
                aria-hidden="true"
              />
              <Quote
                className="absolute top-3 sm:top-4 right-3 sm:right-4 h-6 w-6 sm:h-8 sm:w-8 text-primary/20 group-hover:text-primary/40 transition-colors duration-300 group-hover:scale-110 transform"
                aria-hidden="true"
              />

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary text-sm sm:text-base font-bold flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 ring-2 ring-primary/20">
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
                            : 'text-muted'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <blockquote
                    id={`testimonial-${testimonial.id}-content`}
                    className="text-foreground mb-3 text-sm sm:text-base leading-relaxed font-medium group-hover:text-foreground transition-colors duration-300 line-clamp-3 italic"
                  >
                    &quot;{testimonial.content}&quot;
                  </blockquote>

                  <footer>
                    <cite className="not-italic">
                      <h4
                        id={`testimonial-${testimonial.id}-name`}
                        className={cn(
                          "font-bold text-sm sm:text-base lg:text-lg bg-clip-text text-transparent transition-all duration-300 leading-tight",
                          "bg-primary",
                          "group-hover:text-primary"
                        )}
                      >
                        {testimonial.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium leading-tight">
                        {testimonial.role}
                        {testimonial.company && (
                          <span className="block sm:inline">
                            <span className="hidden sm:inline"> - </span>
                            <span className="text-primary font-semibold">
                              {testimonial.company}
                            </span>
                          </span>
                        )}
                      </p>

                      {/* Project Type and Industry Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                          {testimonial.industry}
                        </span>
                        {testimonial.projectType && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-secondary/10 text-secondary-foreground rounded-full">
                            {testimonial.projectType}
                          </span>
                        )}
                      </div>
                    </cite>


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
