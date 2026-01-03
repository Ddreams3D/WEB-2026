'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, FileText } from '@/lib/icons';
import DefaultImage from '@/shared/components/ui/DefaultImage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStaggeredItemsAnimation } from '../hooks/useIntersectionAnimation';
import { useProjects, ProjectsOptions } from '@/hooks/useProjects';
import { PortfolioItem } from '@/shared/types/domain';

import { GalleryCard } from '@/components/gallery/GalleryCard';

interface ProjectGalleryProps extends ProjectsOptions {}

export default function ProjectGallery(props: ProjectGalleryProps) {
  const { projects, isLoading } = useProjects(props);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const { ref, visibleItems } = useStaggeredItemsAnimation(projects.length, 150);

  const openModal = useCallback((project: PortfolioItem) => {
    setSelectedProject(project);
    setActiveImage(project.coverImage);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        <p>No hay proyectos para mostrar.</p>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {projects.map((project, index) => (
          <GalleryCard
            key={project.id}
            project={project}
            onClick={() => openModal(project)}
            className={visibleItems[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            style={{ transitionDelay: `${index * 100}ms` }}
          />
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
              className={cn("rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto", "bg-card text-card-foreground")}
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
                <DefaultImage
                  src={activeImage || selectedProject.coverImage}
                  alt={
                    selectedProject.galleryImages && selectedProject.galleryAlt && activeImage
                      ? selectedProject.galleryAlt[selectedProject.galleryImages.indexOf(activeImage)] || selectedProject.title
                      : selectedProject.title
                  }
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    "text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg",
                    "bg-primary"
                  )}>
                    {selectedProject.category}
                  </span>
                </div>
                
                {selectedProject.galleryImages && selectedProject.galleryImages.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20 px-4">
                    <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl">
                      {selectedProject.galleryImages.map((img, idx) => (
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
                          <DefaultImage 
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
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {selectedProject.title}
                </h3>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                  {selectedProject.applications && (
                      <div className="mt-6 text-sm sm:text-base text-muted-foreground border-t border-border pt-4">
                        <span className="font-semibold text-foreground block mb-2">Aplicaciones:</span>
                        <span className="leading-relaxed block text-muted-foreground">
                          {selectedProject.applications}
                        </span>
                      </div>
                  )}
                  {selectedProject.client && (
                      <div className="mt-4 text-sm sm:text-base text-muted-foreground">
                        <span className="font-semibold text-foreground">Cliente:</span> {selectedProject.client}
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
