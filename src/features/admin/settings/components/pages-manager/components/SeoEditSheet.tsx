import React, { useState, useEffect } from 'react';
import { Sheet } from '@/components/ui/simple-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Globe, Search, Save } from 'lucide-react';
import { RouteItem, SeoConfig } from '../types';
import { toast } from 'sonner';

interface SeoEditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  route: RouteItem | null;
  onSave: (path: string, newSeo: SeoConfig) => void;
  isSaving: boolean;
}

export function SeoEditSheet({ isOpen, onClose, route, onSave, isSaving }: SeoEditSheetProps) {
  const [formData, setFormData] = useState<SeoConfig>({
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    robots: 'index, follow'
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Debug logging
  useEffect(() => {
    if (isOpen && route) {
      console.log('[SeoEditSheet] Opened for:', route.path);
      console.log('[SeoEditSheet] Current SEO:', route.seo);
    }
  }, [isOpen, route]);

  useEffect(() => {
    if (route) {
      const rawRobots = route.seo?.robots || 'index, follow';
      // Normalize robots string to match one of our known values
      let normalizedRobots = 'index, follow';
      const r = rawRobots.toLowerCase().trim();
      
      if (r.includes('noindex') && r.includes('nofollow')) {
        normalizedRobots = 'noindex, nofollow';
      } else if (r.includes('noindex')) {
        normalizedRobots = 'noindex, follow';
      } else {
        normalizedRobots = 'index, follow';
      }

      const initialData = {
        metaTitle: route.seo?.metaTitle || '',
        metaDescription: route.seo?.metaDescription || '',
        canonicalUrl: route.seo?.canonicalUrl || `https://ddream3d.com${route.path}`,
        robots: normalizedRobots
      };
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [route, isOpen]);

  const handleChange = (field: keyof SeoConfig, value: any) => {
    console.log(`[SeoEditSheet] Changing ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('[SeoEditSheet] Saving changes...', formData);
    if (route) {
      onSave(route.path, {
        ...formData,
        updatedAt: new Date().toISOString().split('T')[0]
      });
      // Don't close immediately here, let the parent handle success/loading
      // But we show a toast for feedback
    }
  };

  if (!route) return null;

  // Character Counts & Validation
  const titleLength = formData.metaTitle?.length || 0;
  const descLength = formData.metaDescription?.length || 0;

  const getLengthStatus = (current: number, min: number, max: number) => {
    if (current === 0) return 'neutral';
    if (current < min) return 'warning';
    if (current > max) return 'error';
    return 'success';
  };

  const titleStatus = getLengthStatus(titleLength, 30, 60);
  const descStatus = getLengthStatus(descLength, 120, 160);

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-200';
    }
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Indexación & SEO"
      description={`Configura cómo aparece "${route.name}" en los resultados de búsqueda de Google.`}
      className="w-full sm:max-w-xl"
    >
      <div className="space-y-8 py-4">
        
        {/* PREVIEW CARD */}
        <div className="bg-card border rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground border-b pb-2 mb-2">
            <Globe className="w-3 h-3" />
            <span>Vista Previa en Google</span>
          </div>
          <div className="space-y-1 font-sans">
            <div className="text-[#1a0dab] text-xl truncate hover:underline cursor-pointer">
              {formData.metaTitle || route.name}
            </div>
            <div className="text-[#006621] text-sm truncate">
              {formData.canonicalUrl || `https://ddream3d.com${route.path}`}
            </div>
            <div className="text-[#545454] text-sm line-clamp-2">
              {formData.metaDescription || route.description || "No hay descripción configurada."}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* META TITLE */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="metaTitle">Meta Título (Title Tag)</Label>
              <span className={`text-xs font-mono ${
                titleStatus === 'error' ? 'text-red-500 font-bold' : 
                titleStatus === 'success' ? 'text-green-600' : 'text-muted-foreground'
              }`}>
                {titleLength} / 60
              </span>
            </div>
            <Input 
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
              placeholder="Título de la página | Marca"
            />
            <Progress value={(titleLength / 60) * 100} className="h-1" indicatorClassName={getProgressColor(titleStatus)} />
            <p className="text-[11px] text-muted-foreground">
              Recomendado: 50-60 caracteres. Debe ser único y descriptivo.
            </p>
          </div>

          {/* META DESCRIPTION */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="metaDescription">Meta Descripción</Label>
              <span className={`text-xs font-mono ${
                descStatus === 'error' ? 'text-red-500 font-bold' : 
                descStatus === 'success' ? 'text-green-600' : 'text-muted-foreground'
              }`}>
                {descLength} / 160
              </span>
            </div>
            <Textarea 
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              placeholder="Descripción breve del contenido de la página..."
              className="h-24 resize-none"
            />
            <Progress value={(descLength / 160) * 100} className="h-1" indicatorClassName={getProgressColor(descStatus)} />
            <p className="text-[11px] text-muted-foreground">
              Recomendado: 150-160 caracteres. Incluye palabras clave principales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ROBOTS */}
            <div className="space-y-2">
              <Label>Visibilidad en Google (Robots)</Label>
              <Select 
                value={formData.robots} 
                onValueChange={(val) => handleChange('robots', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index, follow">Pública (Index, Follow)</SelectItem>
                  <SelectItem value="noindex, follow">En progreso (No Index, Follow)</SelectItem>
                  <SelectItem value="noindex, nofollow">Privada / Admin (No Index, No Follow)</SelectItem>
                </SelectContent>
              </Select>
              {formData.robots?.includes('noindex') && (
                <div className="flex items-start gap-2 p-2 bg-amber-50 text-amber-800 rounded text-xs border border-amber-200 mt-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>Esta página NO aparecerá en los resultados de búsqueda.</span>
                </div>
              )}
            </div>

            {/* CANONICAL URL */}
            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">URL Canónica</Label>
              <Input 
                id="canonicalUrl"
                value={formData.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                placeholder="https://..."
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-6 border-t mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="gap-2">
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
