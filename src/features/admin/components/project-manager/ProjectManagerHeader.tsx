import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';

interface ProjectManagerHeaderProps {
  handleCreate: () => void;
  handleSeed: (force: boolean) => void;
  isSeeding: boolean;
  migrationNeeded: boolean;
}

export function ProjectManagerHeader({ 
  handleCreate, 
  handleSeed, 
  isSeeding, 
  migrationNeeded 
}: ProjectManagerHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Proyectos Destacados</h2>
          <p className="text-muted-foreground">
            Gestiona el portafolio de trabajos realizados.
          </p>
        </div>
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
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r">
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
    </div>
  );
}
