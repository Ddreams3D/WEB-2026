import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LandingMainConfig } from '@/shared/types/landing';

interface LandingMainStatsProps {
    form: LandingMainConfig;
}

export function LandingMainStats({ form }: LandingMainStatsProps) {
  return (
    <div className="space-y-6">
        {/* Status Card */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            Estado General
        </h3>
        
        <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                    <span className="text-sm font-medium block">Barra de Anuncios</span>
                    <span className="text-xs text-muted-foreground block">Mensaje superior global</span>
                </div>
                <Badge variant={form.announcement?.enabled ? "default" : "secondary"} className={cn(form.announcement?.enabled ? "bg-green-500 hover:bg-green-600" : "")}>
                    {form.announcement?.enabled ? "ACTIVA" : "INACTIVA"}
                </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                    <span className="text-sm font-medium block">Burbujas Flotantes</span>
                    <span className="text-xs text-muted-foreground block">{form.bubbleImages?.length || 0} imágenes cargadas</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                            window.open('/impresion-3d-arequipa', '_blank');
                        }
                    }}
                >
                    Gestionar
                </Button>
            </div>
        </div>
        </div>

        {/* Tips Card */}
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6">
        <h4 className="text-blue-800 dark:text-blue-300 font-semibold mb-2 text-sm">Consejo Pro</h4>
        <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
            Usa imágenes PNG con fondo transparente para las &quot;Burbujas Flotantes&quot; para lograr el mejor efecto visual en la sección Hero.
        </p>
        </div>
    </div>
  );
}
