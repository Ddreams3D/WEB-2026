'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { PortfolioItem } from '@/shared/types/domain';
import { useProjectForm } from '../hooks/useProjectForm';
import { ProjectModalInfo } from './project-modal/ProjectModalInfo';
import { ProjectModalMedia } from './project-modal/ProjectModalMedia';
import { ProjectModalDetails } from './project-modal/ProjectModalDetails';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PortfolioItem>) => void;
  project?: PortfolioItem | null;
}

export default function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState('info');
  
  const {
    formData,
    isSubmitting,
    handleChange,
    handleGalleryAdd,
    handleGalleryUpdate,
    handleGalleryRemove,
    handleSubmit,
    CATEGORIES
  } = useProjectForm({ project, onSave, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="info">Información General</TabsTrigger>
              <TabsTrigger value="media">Imágenes</TabsTrigger>
              <TabsTrigger value="details">Detalles y SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <ProjectModalInfo 
                formData={formData} 
                handleChange={handleChange} 
                categories={CATEGORIES} 
              />
            </TabsContent>

            <TabsContent value="media">
              <ProjectModalMedia
                formData={formData}
                handleChange={handleChange}
                handleGalleryAdd={handleGalleryAdd}
                handleGalleryUpdate={handleGalleryUpdate}
                handleGalleryRemove={handleGalleryRemove}
              />
            </TabsContent>

            <TabsContent value="details">
              <ProjectModalDetails 
                formData={formData} 
                handleChange={handleChange} 
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2 bg-muted/20">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Proyecto'}
          </Button>
        </div>
      </div>
    </div>
  );
}
