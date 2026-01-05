import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import DefaultImage from '@/shared/components/ui/DefaultImage';
import { PortfolioItem } from '@/shared/types/domain';

interface ProjectManagerGridProps {
  projects: PortfolioItem[];
  loading: boolean;
  isSeeding: boolean;
  handleEdit: (project: PortfolioItem) => void;
  handleDelete: (project: PortfolioItem) => void;
  handleSeed: (force: boolean) => void;
}

export function ProjectManagerGrid({ 
  projects, 
  loading, 
  isSeeding, 
  handleEdit, 
  handleDelete, 
  handleSeed 
}: ProjectManagerGridProps) {
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium">No hay proyectos</h3>
        <p className="text-muted-foreground mb-4">
          Comienza creando uno nuevo o importa los datos existentes.
        </p>
        <Button variant="outline" onClick={() => handleSeed(false)} disabled={isSeeding}>
           Importar desde Archivo
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="group relative bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="relative aspect-video bg-muted">
            {project.coverImage ? (
              <DefaultImage 
                src={project.coverImage} 
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Sin Imagen
              </div>
            )}
            {project.isFeatured && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                Destacado
              </div>
            )}
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                {project.category}
              </span>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(project.projectDate).toLocaleDateString()}
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{project.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
              {project.description}
            </p>
            
            <div className="flex justify-end gap-2 pt-2 border-t mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                <Edit className="w-4 h-4 mr-1" /> Editar
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(project)}>
                <Trash2 className="w-4 h-4 mr-1" /> Eliminar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
