import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Search, Globe, MousePointer } from 'lucide-react';
import { UnifiedLandingData } from '../types';

interface SeoSectionProps {
  data: UnifiedLandingData;
  updateField: (field: keyof UnifiedLandingData, value: any) => void;
}

export function SeoSection({ data, updateField }: SeoSectionProps) {
  if (data.type !== 'service') return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/50">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Optimización SEO
          </h2>
          <p className="text-sm text-muted-foreground">
            Mejora tu visibilidad en Google y redes sociales.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                     <div className="space-y-1">
                        <Label className="text-base font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            Título en Buscadores
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            El enlace azul que aparece en Google.
                        </p>
                     </div>
                     <span className="text-[10px] font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                        {(data.metaTitle || '').length} / 60
                     </span>
                </div>
                <Input 
                    value={data.metaTitle || ''} 
                    onChange={(e) => updateField('metaTitle', e.target.value)}
                    placeholder="Ej: Impresión 3D en Resina | Alta Calidad | DDreams 3D"
                    className="font-medium text-blue-600 dark:text-blue-400"
                />
            </div>

            <div className="space-y-4">
                 <div className="flex items-start justify-between">
                     <div className="space-y-1">
                        <Label className="text-base font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Descripción Meta
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            El texto gris debajo del título en los resultados.
                        </p>
                     </div>
                     <span className="text-[10px] font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                        {(data.metaDescription || '').length} / 160
                     </span>
                </div>
                <Textarea 
                    value={data.metaDescription || ''} 
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    rows={3}
                    placeholder="Servicio de impresión 3D en resina de alta resolución para figuras, prototipos y joyería..."
                    className="resize-none"
                />
            </div>
        </div>

        {/* Preview Card */}
        <div className="bg-muted/30 border rounded-xl p-5 space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MousePointer className="w-3 h-3" />
                Vista Previa en Google
            </Label>
            <div className="bg-background p-4 rounded-lg border shadow-sm max-w-xl">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20"></div>
                        <span>ddreams3d.com › servicios › {data.slug || '...'}</span>
                    </div>
                    <h3 className="text-xl text-blue-800 dark:text-blue-400 font-medium hover:underline cursor-pointer truncate">
                        {data.metaTitle || 'Título de la página...'}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {data.metaDescription || 'Descripción de la página que aparecerá en los resultados de búsqueda...'}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
