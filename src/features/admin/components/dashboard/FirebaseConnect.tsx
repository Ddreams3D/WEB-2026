'use client';

import React from 'react';
import { AlertTriangle, Database, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function FirebaseConnect() {
  const { user, loginWithGoogle, isLoading } = useAuth();

  // Si está cargando o ya hay usuario, no mostramos nada
  // NOTA: Asumimos que si hay usuario, tiene permisos. 
  // Si tiene usuario pero no permisos, eso lo manejaría otro componente o el error del dashboard.
  if (isLoading || user) return null;

  return (
    <Alert variant="destructive" className="mb-6 border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-100">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-lg font-semibold flex items-center gap-2">
        Modo Lectura Limitado
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <p>
              Has iniciado sesión en el panel de administración, pero no estás conectado a la base de datos de Firebase.
              Por seguridad, los datos sensibles (pedidos, usuarios, estadísticas) están ocultos.
            </p>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Database className="w-4 h-4" />
              <span>Base de Datos: <strong>Desconectada</strong></span>
            </div>
          </div>
          
          <Button 
            onClick={() => loginWithGoogle()} 
            variant="outline"
            className="whitespace-nowrap bg-background hover:bg-amber-100 dark:hover:bg-amber-900/30 border-amber-500/30"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Conectar Base de Datos
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
