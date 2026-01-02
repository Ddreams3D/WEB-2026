'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProjectService } from '@/services/project.service';
import { PortfolioItem } from '@/shared/types/domain';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2, RefreshCw, AlertTriangle, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/ToastManager';
import ProjectModal from './ProjectModal';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import ConnectionStatus from './ConnectionStatus';
import ConfirmationModal from './ConfirmationModal';

export default function ProjectManager() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
    variant: 'warning' as 'warning' | 'danger' | 'info',
    isLoading: false
  });
  const { showSuccess, showError } = useToast();

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const needed = await ProjectService.checkMigrationNeeded();
      setMigrationNeeded(needed);
      const data = await ProjectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
      showError('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: PortfolioItem) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeConfirmation = () => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleDelete = (project: PortfolioItem) => {
    setConfirmation({
      isOpen: true,
      title: 'Eliminar Proyecto',
      message: `¿Estás seguro de eliminar el proyecto "${project.title}"?`,
      variant: 'danger',
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmation(prev => ({ ...prev, isLoading: true }));
          await ProjectService.deleteProject(project.id);
          showSuccess('Proyecto eliminado');
          loadProjects();
          closeConfirmation();
        } catch (error) {
          console.error(error);
          showError('Error al eliminar proyecto');
          setConfirmation(prev => ({ ...prev, isLoading: false }));
        }
      }
    });
  };

  const handleSave = async (data: Partial<PortfolioItem>) => {
    try {
      if (editingProject) {
        await ProjectService.updateProject(editingProject.id, data);
        showSuccess('Proyecto actualizado');
      } else {
        const newProject = data as Omit<PortfolioItem, 'id'>;
        await ProjectService.createProject(newProject);
        showSuccess('Proyecto creado');
      }
      loadProjects();
    } catch (error) {
      console.error(error);
      throw error; // Let modal handle error display if needed
    }
  };

  const handleSeed = (force = false) => {
    const message = force 
      ? '¿Estás seguro de recargar los datos estáticos? Esto sobrescribirá los proyectos existentes con los IDs originales.' 
      : '¿Importar proyectos desde el archivo estático? Esto creará documentos en Firestore.';
      
    setConfirmation({
      isOpen: true,
      title: force ? 'Reiniciar Datos' : 'Importar Proyectos',
      message,
      variant: force ? 'danger' : 'warning',
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmation(prev => ({ ...prev, isLoading: true }));
          setIsSeeding(true);
          await ProjectService.seedProjectsFromStatic(force);
          showSuccess('Proyectos importados correctamente');
          loadProjects();
          closeConfirmation();
        } catch (error) {
          console.error(error);
          showError('Error al importar proyectos');
          setConfirmation(prev => ({ ...prev, isLoading: false }));
        } finally {
          setIsSeeding(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        variant={confirmation.variant}
        isLoading={confirmation.isLoading}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Proyectos Destacados</h2>
          <p className="text-muted-foreground">
            Gestiona el portafolio de trabajos realizados.
          </p>
        </div>
        <ConnectionStatus />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSeed(true)} disabled={isSeeding}>
            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Sincronizar Datos Estáticos
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {migrationNeeded && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-4 rounded-r">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Estás visualizando datos estáticos
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Para editar o eliminar proyectos, primero debes importarlos a la base de datos.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleSeed(false)} disabled={isSeeding} className="ml-4 border-yellow-500/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200">
               {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
               Importar Ahora
            </Button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group relative bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-video bg-muted">
                {project.coverImage ? (
                  <Image 
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
      )}

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        project={editingProject}
      />
    </div>
  );
}
