'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, ShieldAlert } from 'lucide-react';

export const AnalyticsExclusion = () => {
  const [isExcluded, setIsExcluded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const excluded = localStorage.getItem('ddreams_exclude_analytics') === 'true';
    setIsExcluded(excluded);
  }, []);

  const toggleExclusion = () => {
    if (isExcluded) {
      localStorage.removeItem('ddreams_exclude_analytics');
      setIsExcluded(false);
      // Recargar para que surta efecto
      window.location.reload();
    } else {
      localStorage.setItem('ddreams_exclude_analytics', 'true');
      setIsExcluded(true);
      // Recargar para que surta efecto el bloqueo
      window.location.reload();
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg border ${isExcluded ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
        <div className="flex items-center gap-3 mb-2">
          {isExcluded ? (
            <Shield className="h-6 w-6 text-green-600 dark:text-green-500" />
          ) : (
            <ShieldAlert className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
          )}
          <h3 className="font-medium text-foreground">
            {isExcluded ? 'Dispositivo Excluido' : 'Dispositivo Rastreado'}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {isExcluded 
            ? 'Este dispositivo NO envía datos a Google Analytics. Tus visitas no afectarán las métricas.'
            : 'Este dispositivo envía datos a Google Analytics como cualquier visitante normal.'}
        </p>
        
        <Button 
          onClick={toggleExclusion} 
          variant={isExcluded ? "outline" : "default"}
          size="sm"
        >
          {isExcluded ? 'Volver a rastrear este dispositivo' : 'Excluir este dispositivo'}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Esta configuración se guarda localmente en este navegador específico. Deberás activarla en cada dispositivo (móvil, tablet, etc.) que utilices para administrar el sitio.
      </p>
    </div>
  );
};
