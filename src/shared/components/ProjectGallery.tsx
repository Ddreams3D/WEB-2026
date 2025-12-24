'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Eye, FileText } from '@/lib/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useStaggeredItemsAnimation } from '../hooks/useIntersectionAnimation';

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
    title: 'Modelo Médico Anatómico Personalizado',
    description: 'Desarrollo de modelos anatómicos impresos en 3D a partir de referencias reales para estudio, enseñanza y planificación médica.',
    category: 'Medicina',
    image: '/images/placeholder-medical.svg',
    client: 'Sector Médico',
    date: '2024'
  },
  {
    id: '2',
    title: 'Trofeo 3D Personalizado',
    description: 'Diseño y fabricación de trofeos y piezas personalizadas impresas en 3D para eventos, marcas y reconocimientos especiales.',
    category: 'Trofeos y Regalos',
    image: '/images/placeholder-modeling.svg',
    client: 'Eventos Corporativos',
    date: '2024'
  },
  {
    id: '3',
    title: 'Prototipo Funcional a Medida',
    description: 'Creación de prototipos y piezas funcionales impresas en 3D para pruebas, validación y uso técnico específico.',
    category: 'Prototipado',
    image: '/images/placeholder-precision.svg',
    client: 'Industria',
    date: '2024'
  }
];

export default function ProjectGallery() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { ref, visibleItems } = useStaggeredItemsAnimation(projects.length, 150);

  const openModal = useCallback((project: Project) => {
    setSelectedProject(project);
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
            className={`group bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 hover-lift hover-glow ${
              visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <figure className="relative overflow-hidden">
              <Image
                src={project.image}
                alt={`Proyecto: ${project.title}`}
                width={400}
                height={300}
                className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                  {project.category}
                </span>
              </div>
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openModal(project)}
                  className="w-full bg-white/90 backdrop-blur-sm text-neutral-900 py-2 px-4 rounded-lg font-medium hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg btn-enhanced hover:scale-105"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                  Ver Detalles
                </button>
              </div>
            </figure>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
                {project.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm sm:text-base line-clamp-2 leading-relaxed">
                {project.description}
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

      {/* Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
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
                {selectedProject.client && (
                    <div className="mt-4 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-200">Cliente:</span> {selectedProject.client}
                    </div>
                )}
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
    </div>
  );
}
