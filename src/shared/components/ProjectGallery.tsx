'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from '@/lib/icons';
import Image from 'next/image';
import { useStaggeredItemsAnimation, getAnimationClasses } from '../hooks/useIntersectionAnimation';
import { getTransitionClasses, getGradientClasses } from '../styles';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  client?: string;
  date?: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Prototipo Automotriz',
    description: 'Desarrollo de componentes personalizados para la industria automotriz con alta precisión y resistencia.',
    category: 'Prototipado',
    image: '/images/placeholder-modeling.svg',
    client: 'Industria Automotriz',
    date: '2024'
  },
  {
    id: '2',
    title: 'Maqueta Arquitectónica',
    description: 'Maqueta detallada de proyecto residencial con interiores y acabados realistas.',
    category: 'Arquitectura',
    image: '/images/placeholder-precision.svg',
    client: 'Estudio de Arquitectura',
    date: '2024'
  },
  {
    id: '3',
    title: 'Modelo Médico',
    description: 'Modelo anatómico personalizado para planificación quirúrgica.',
    category: 'Medicina',
    image: '/images/placeholder-medical.svg',
    client: 'Hospital Regional',
    date: '2023'
  }
];

export default function ProjectGallery() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { ref, visibleItems } = useStaggeredItemsAnimation(projects.length, 150);

  const openModal = useCallback((project: Project) => {
    setSelectedProject(project);
    setSelectedIndex(projects.findIndex(p => p.id === project.id));
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  }, []);

  const nextProject = useCallback(() => {
    const newIndex = (selectedIndex + 1) % projects.length;
    setSelectedIndex(newIndex);
    setSelectedProject(projects[newIndex]);
  }, [selectedIndex]);

  const prevProject = useCallback(() => {
    const newIndex = (selectedIndex - 1 + projects.length) % projects.length;
    setSelectedIndex(newIndex);
    setSelectedProject(projects[newIndex]);
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedProject) return;
    
    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        prevProject();
        break;
      case 'ArrowRight':
        nextProject();
        break;
    }
  }, [selectedProject, closeModal, prevProject, nextProject]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl ${getTransitionClasses('transform')} overflow-hidden cursor-pointer group hover:scale-105 ${getAnimationClasses(visibleItems?.[index] || false, index)}`}
            onClick={() => openModal(project)}
          >
            <div className="relative h-48 sm:h-56 lg:h-64">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className={`object-cover ${getTransitionClasses('transform')} group-hover:scale-105`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className={`absolute inset-0 ${getGradientClasses('overlayDark')} opacity-0 group-hover:opacity-100 ${getTransitionClasses('opacity')}`} />
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                {project.description}
              </p>
              <span className={`inline-block ${getGradientClasses('primary')} text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm`}>
                {project.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div 
            className="relative w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 z-10 bg-white/80 dark:bg-neutral-800/80 rounded-full transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 sm:h-80 lg:h-96">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); prevProject(); }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Proyecto anterior"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextProject(); }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Proyecto siguiente"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <h3 id="modal-title" className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{selectedProject.title}</h3>
                <p id="modal-description" className="text-neutral-600 dark:text-neutral-300 mb-4 sm:mb-6 text-sm sm:text-base">
                  {selectedProject.description}
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-sm sm:text-base">
                    <span className="font-semibold">Categoría:</span>
                    <span className="ml-2">{selectedProject.category}</span>
                  </div>
                  {selectedProject.client && (
                    <div className="text-sm sm:text-base">
                      <span className="font-semibold">Cliente:</span>
                      <span className="ml-2">{selectedProject.client}</span>
                    </div>
                  )}
                  {selectedProject.date && (
                    <div className="text-sm sm:text-base">
                      <span className="font-semibold">Año:</span>
                      <span className="ml-2">{selectedProject.date}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}