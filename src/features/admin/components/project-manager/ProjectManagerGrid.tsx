import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, AlertTriangle, Loader2, Star } from 'lucide-react';
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
  const clickTimer = useRef<number | null>(null);
  const lastClickedId = useRef<string | null>(null);

  const handleSingleClick = (project: PortfolioItem) => {
    lastClickedId.current = project.id;
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    clickTimer.current = window.setTimeout(() => {
      if (lastClickedId.current === project.id) {
        handleEdit(project);
      }
      lastClickedId.current = null;
      clickTimer.current = null;
    }, 220);
  };

  const handleDoubleClick = (project: PortfolioItem) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    lastClickedId.current = null;
    handleDelete(project);
  };
  
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="group bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-300 overflow-hidden relative cursor-pointer"
          onClick={() => handleSingleClick(project)}
          onDoubleClick={() => handleDoubleClick(project)}
        >
          <div className="aspect-video relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
            {project.coverImage ? (
              <DefaultImage 
                src={project.coverImage} 
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Sin Imagen
              </div>
            )}
            {/* Featured Badge */}
            {project.isFeatured && (
              <div className="absolute top-2 left-2 z-10">
                  <div className="bg-primary text-primary-foreground p-1 rounded-full shadow-sm backdrop-blur-sm">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
              </div>
            )}
          </div>
          
          <div className="p-3">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate flex-1" title={project.title}>
                {project.title}
              </h3>
              <span className="font-semibold text-xs text-neutral-500 dark:text-neutral-400 shrink-0 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(project.projectDate).getFullYear()}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 truncate max-w-[80%]">
                {project.category}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
