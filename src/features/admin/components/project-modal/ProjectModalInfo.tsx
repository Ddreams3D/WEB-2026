import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui';
import { PortfolioItem } from '@/shared/types/domain';

interface ProjectModalInfoProps {
  formData: Partial<PortfolioItem>;
  handleChange: (field: keyof PortfolioItem, value: unknown) => void;
  categories: string[];
}

export function ProjectModalInfo({ formData, handleChange, categories }: ProjectModalInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título del Proyecto</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ej. Prototipo de Motor V6"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Cliente (Opcional)</Label>
          <Input
            id="clientName"
            value={formData.clientName || ''}
            onChange={(e) => handleChange('clientName', e.target.value)}
            placeholder="Ej. Empresa SAC"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectDate">Fecha del Proyecto</Label>
          <Input
            id="projectDate"
            type="date"
            value={formData.projectDate ? new Date(formData.projectDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleChange('projectDate', new Date(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          rows={5}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descripción detallada del proyecto..."
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="isFeatured" 
          checked={formData.isFeatured}
          onCheckedChange={(checked) => handleChange('isFeatured', checked)}
        />
        <Label htmlFor="isFeatured" className="cursor-pointer">
          Destacar este proyecto en la portada
        </Label>
      </div>
    </div>
  );
}
