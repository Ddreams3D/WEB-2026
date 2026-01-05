import React from 'react';
import { Card } from '@/components/ui/card';

interface RouteStatsProps {
  totalRoutes: number;
  totalRedirects: number;
}

export function RouteStats({ totalRoutes, totalRedirects }: RouteStatsProps) {
  return (
    <div className="flex gap-2">
       <Card className="px-4 py-2 bg-primary/5 border-none shadow-none flex items-center gap-3">
         <div className="text-2xl font-bold text-primary">{totalRoutes}</div>
         <div className="text-xs text-muted-foreground leading-tight">Rutas<br/>Totales</div>
       </Card>
       <Card className="px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border-none shadow-none flex items-center gap-3">
         <div className="text-2xl font-bold text-amber-600">{totalRedirects}</div>
         <div className="text-xs text-muted-foreground leading-tight">Reglas<br/>301</div>
       </Card>
    </div>
  );
}
