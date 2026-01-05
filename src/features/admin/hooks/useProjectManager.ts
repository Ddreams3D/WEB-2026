import { useState, useEffect, useCallback } from 'react';
import { ProjectService } from '@/services/project.service';
import { PortfolioItem } from '@/shared/types/domain';
import { useToast } from '@/components/ui/ToastManager';
import { revalidateCatalog } from '@/app/actions/revalidate';

export function useProjectManager() {
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
          await revalidateCatalog();
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
      await revalidateCatalog();
      loadProjects();
    } catch (error) {
      console.error(error);
      throw error;
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
          await revalidateCatalog();
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

  return {
    projects,
    loading,
    isModalOpen,
    editingProject,
    isSeeding,
    migrationNeeded,
    confirmation,
    setIsModalOpen,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
    handleSeed,
    closeConfirmation
  };
}
