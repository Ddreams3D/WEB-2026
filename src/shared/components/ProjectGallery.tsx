'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Eye, FileText } from '@/lib/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
import { motion, AnimatePresence } from 'framer-motion';
import { useStaggeredItemsAnimation } from '../hooks/useIntersectionAnimation';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  gallery?: string[];
  galleryAlt?: string[];
  client?: string;
  applications?: string;
  date?: string;
  ctaText?: string;
  imageFit?: 'cover' | 'contain';
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Modelos Médicos Anatómicos Personalizados',
    description: 'Desarrollo de modelos anatómicos impresos en 3D a partir de referencias reales para estudio, enseñanza y planificación médica. Cada detalle se define desde el modelado 3D, asegurando coherencia total entre diseño, fabricación y acabados finales, incluidos pintura y postprocesado.',
    category: 'Medicina',
    image: '/images/modelo-anatomico-craneo-3d-corte-lateral.jpg',
    gallery: [
      '/images/modelo-anatomico-craneo-3d-corte-lateral.jpg',
      '/images/modelo-anatomico-craneo-3d-corte-sagital.jpg'
    ],
    galleryAlt: [
      'Modelo anatómico cráneo 3D corte lateral impresión 3D Arequipa',
      'Modelo anatómico cráneo 3D corte sagital impresión 3D Arequipa'
    ],
    applications: 'Enseñanza médica · Estudio anatómico · Planificación quirúrgica · Visualización de procedimientos',
    ctaText: 'Solicitar modelo similar',
    date: '2024'
  },
  {
    id: '2',
    title: 'Trofeos y Premios 3D Personalizados',
    description: 'Diseñamos trofeos y piezas conmemorativas completamente personalizadas, desarrolladas desde el modelado 3D para garantizar coherencia total entre diseño, fabricación y acabados finales.\n\nCada pieza se crea considerando forma, proporción, narrativa visual y uso final, permitiendo integrar logotipos, conceptos temáticos, textos y geometrías únicas que se reflejan fielmente en la impresión y el acabado.',
    category: 'Trofeos y Regalos',
    image: '/images/trofeo-3d-personalizado-evento-deportivo-impresion-3d.png',
    gallery: [
      '/images/trofeo-impresion-3d-premiacion.jpg',
      '/images/trofeo-3d-personalizado-evento-deportivo-impresion-3d.png',
      '/images/trofeo-3d-personalizado-cascos-impresion-3d-premio.jpg',
      '/images/trofeos-3d-personalizados-eventos-deportivos.jpg'
    ],
    galleryAlt: [
      'Trofeo impresión 3D premiación corporativa Arequipa',
      'Trofeo 3D personalizado evento deportivo impresión 3D Arequipa',
      'Trofeo 3D personalizado cascos premio impresión 3D',
      'Trofeos 3D personalizados eventos deportivos Arequipa'
    ],
    applications: 'Eventos corporativos · Campeonatos deportivos · Reconocimientos institucionales · Premios conmemorativos · Regalos personalizados',
    ctaText: 'Solicitar trofeo personalizado',
    date: '2024'
  },
  {
    id: '3',
    title: 'Soluciones Funcionales a Medida',
    description: 'Cada solución se desarrolla desde el modelado 3D, considerando función, resistencia, tolerancias y uso final, asegurando que lo diseñado se refleje fielmente en la fabricación y el resultado final.',
    category: 'Prototipado',
    image: '/images/sistema-de-engranajes-impresion-3d-prototipo.png',
    gallery: [
      '/images/sistema-de-engranajes-impresion-3d-prototipo.png',
      '/images/prototipo-funcional-impresion-3d-pieza-tecnica-acople.png',
      '/images/prototipo-funcional-impresion-3d-conjunto-mecanico.png',
      '/images/engranajes-impresos-3d-prototipado-funcional.png',
      '/images/engranajes-impresion-3d-prototipo-funcional-personalizado.png'
    ],
    applications: 'Prototipado · Adaptaciones técnicas · Piezas funcionales · Soportes personalizados · Validación de diseño · Soluciones a medida',
    ctaText: 'Solicitar solución personalizada',
    date: '2024'
  }
];

export default function ProjectGallery() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const { ref, visibleItems } = useStaggeredItemsAnimation(projects.length, 150);

  const openModal = useCallback((project: Project) => {
    setSelectedProject(project);
    setActiveImage(project.image);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedProject) return;
    
    if (e.key === 'Escape') {
      closeModal();
    }
  }, [selectedProject, closeModal]);

  useEffect(() => {
    if (selectedProject) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedProject, handleKeyDown]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div ref={ref}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {projects.map((project, index) => (
          <article
            key={project.id}
            className={cn(
              "group flex flex-col h-full border border-transparent dark:border-neutral-700/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 ease-out overflow-hidden transform hover:-translate-y-1 hover-lift isolate",
              colors.backgrounds.card,
              visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: `${index * 150}ms`, backfaceVisibility: 'hidden', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
          >
            <figure className={cn("relative overflow-hidden shrink-0 rounded-t-xl z-0", colors.backgrounds.neutral)}>
              <Image
                src={project.image}
                alt={`Proyecto: ${project.title}`}
                width={400}
                height={300}
                className={`w-full h-48 sm:h-56 transition-all duration-1000 ease-out will-change-transform ${
                  project.imageFit === 'contain' 
                    ? 'object-contain p-4' 
                    : 'object-cover group-hover:scale-105'
                }`}
              />
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out",
                colors.gradients.overlayDark
              )} />
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <span className={cn(
                  "text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg",
                  colors.gradients.primary
                )}>
                  {project.category}
                </span>
              </div>
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100">
                <Button
                  onClick={() => openModal(project)}
                  variant="overlay"
                  className="w-full shadow-lg"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" aria-hidden="true" />
                  Ver Detalles
                </Button>
              </div>
            </figure>
            <div className="p-4 sm:p-6 flex flex-col flex-grow">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2 min-h-[3.5rem] flex items-start">
                {project.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-sm sm:text-base line-clamp-2 leading-relaxed min-h-[3rem]">
                {project.description}
              </p>
              <Button
                asChild
                variant="gradient"
                className="mt-auto w-full shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full h-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {project.ctaText || 'Cotizar proyecto similar'}
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ 
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] // Custom easing for "exquisite" feel
              }}
              className={cn("rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto", colors.backgrounds.card)}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={closeModal}
                variant="overlay"
                size="icon"
                className="absolute top-4 right-4 rounded-full z-10 shadow-sm"
                aria-label="Cerrar detalles"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="relative h-64 sm:h-80 w-full group">
                <Image
                  src={activeImage || selectedProject.image}
                  alt={
                    selectedProject.gallery && selectedProject.galleryAlt && activeImage
                      ? selectedProject.galleryAlt[selectedProject.gallery.indexOf(activeImage)] || selectedProject.title
                      : selectedProject.title
                  }
                  fill
                  className={cn(
                    "transition-opacity duration-300",
                    selectedProject.imageFit === 'contain' 
                      ? cn("object-contain p-4", colors.backgrounds.neutral)
                      : "object-cover"
                  )}
                />
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    "text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg",
                    colors.gradients.primary
                  )}>
                    {selectedProject.category}
                  </span>
                </div>
                
                {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20 px-4">
                    <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl">
                      {selectedProject.gallery.map((img, idx) => (
                        <Button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImage(img);
                          }}
                          variant="ghost"
                          className={cn(
                            "relative w-12 h-12 p-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:bg-transparent",
                            activeImage === img 
                              ? "border-white scale-110 shadow-lg" 
                              : "border-white/30 hover:border-white/80 hover:scale-105"
                          )}
                        >
                          <Image 
                            src={img} 
                            alt={selectedProject.galleryAlt ? (selectedProject.galleryAlt[idx] || `Vista ${idx + 1}`) : `Vista ${idx + 1}`}
                            fill 
                            className="object-cover"
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                  {selectedProject.title}
                </h3>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                  {selectedProject.applications && (
                      <div className="mt-6 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                        <span className="font-semibold text-neutral-900 dark:text-white block mb-2">Aplicaciones:</span>
                        <span className="leading-relaxed block text-neutral-600 dark:text-neutral-300">
                          {selectedProject.applications}
                        </span>
                      </div>
                  )}
                  {selectedProject.client && (
                      <div className="mt-4 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-200">Cliente:</span> {selectedProject.client}
                      </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    asChild
                    variant="gradient"
                    size="lg"
                    className="w-full sm:w-auto transform hover:-translate-y-1"
                  >
                    <Link
                      href="/contact"
                      className="flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      {selectedProject.ctaText || 'Cotizar proyecto similar'}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
