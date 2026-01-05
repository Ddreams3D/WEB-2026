import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StringListEditor } from '../AdminEditors';
import { PortfolioItem } from '@/shared/types/domain';

interface ProjectModalDetailsProps {
  formData: Partial<PortfolioItem>;
  handleChange: (field: keyof PortfolioItem, value: unknown) => void;
}

export function ProjectModalDetails({ formData, handleChange }: ProjectModalDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="applications">Aplicaciones / Usos</Label>
        <Textarea
          id="applications"
          value={formData.applications || ''}
          onChange={(e) => handleChange('applications', e.target.value)}
          placeholder="Ej. Prototipado, Validación, Producción final..."
        />
        <p className="text-xs text-muted-foreground">Separa conceptos importantes con puntos o comas.</p>
      </div>

      <div className="space-y-2">
        <Label>Etiquetas (Tags)</Label>
        <StringListEditor
          items={formData.tags || []}
          onChange={(tags) => handleChange('tags', tags)}
          placeholder="Agregar etiqueta (Enter)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctaText">Texto del Botón (CTA)</Label>
        <Input
          id="ctaText"
          value={formData.ctaText || ''}
          onChange={(e) => handleChange('ctaText', e.target.value)}
          placeholder="Ej. Solicitar cotización similar"
        />
      </div>
    </div>
  );
}
