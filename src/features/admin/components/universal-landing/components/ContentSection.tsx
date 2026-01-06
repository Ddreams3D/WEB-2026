import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Box, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Layers, Sparkles } from 'lucide-react';
import { UnifiedLandingData } from '../types';
import { ServiceLandingSection } from '@/shared/types/service-landing';
import { cn } from '@/lib/utils';
import { motion, Reorder } from 'framer-motion';

interface ContentSectionProps {
  data: UnifiedLandingData;
  updateField: (field: keyof UnifiedLandingData, value: any) => void;
}

export function ContentSection({ data, updateField }: ContentSectionProps) {
  // Only for Service Landing for now
  if (data.type !== 'service') {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 shadow-sm">
                <Layers className="w-6 h-6" />
                </div>
                <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                    Contenido Extra
                </h2>
                <p className="text-sm text-muted-foreground">
                    Bloques adicionales para enriquecer tu landing.
                </p>
                </div>
            </div>
            <div className="p-12 text-center border-2 border-dashed rounded-2xl bg-muted/20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div className="max-w-md space-y-2">
                    <h3 className="font-semibold text-lg">Próximamente</h3>
                    <p className="text-muted-foreground">
                        La configuración de secciones extra para este tipo de landing está en desarrollo o se maneja automáticamente.
                    </p>
                </div>
            </div>
        </div>
    );
  }

  const sections = data.sections || [];

  const addSection = () => {
    const newSection: ServiceLandingSection = {
      id: `section-${Date.now()}`,
      type: 'features',
      title: 'Nueva Sección',
      subtitle: '',
      content: '',
      items: []
    };
    updateField('sections', [...sections, newSection]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    updateField('sections', newSections);
  };

  const updateSection = (index: number, updates: Partial<ServiceLandingSection>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    updateField('sections', newSections);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    updateField('sections', newSections);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
       {/* Header */}
       <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 shadow-sm">
                    <Layers className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                        Bloques de Contenido
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Arma la estructura de tu página bloque a bloque.
                    </p>
                </div>
            </div>
            <Button onClick={addSection} size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Bloque
            </Button>
      </div>

      <div className="space-y-6">
        {sections.filter(s => s.type !== 'hero').length === 0 && (
             <div className="p-12 text-center border-2 border-dashed rounded-2xl bg-muted/10 hover:bg-muted/20 transition-colors group">
                <div className="w-20 h-20 mx-auto bg-background rounded-full shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Box className="w-10 h-10 text-teal-500" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Tu lienzo está vacío</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Agrega secciones como características, galería, testimonios o preguntas frecuentes para darle vida a tu landing.
                </p>
                <Button onClick={addSection} variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Primera Sección
                </Button>
            </div>
        )}

        {sections.map((section, index) => {
            // Skip hero section as it is handled in the Hero tab
            if (section.type === 'hero') return null;

            return (
                <div key={section.id} className="group border rounded-xl bg-card shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-center gap-4 p-4 border-b bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveSection(index, 'up')} disabled={index === 0}>
                                    <ChevronUp className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}>
                                    <ChevronDown className="w-3 h-3" />
                                </Button>
                            </div>
                            <span className="font-mono text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
                                {index + 1}
                            </span>
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{section.title || 'Sin Título'}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                                    {section.type}
                                </span>
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeSection(index)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="p-4 grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo de Sección</Label>
                                <Select 
                                    value={section.type} 
                                    onValueChange={(val: any) => updateSection(index, { type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="features">Características</SelectItem>
                                        <SelectItem value="gallery">Galería</SelectItem>
                                        <SelectItem value="testimonials">Testimonios</SelectItem>
                                        <SelectItem value="faq">Preguntas Frecuentes</SelectItem>
                                        <SelectItem value="process">Proceso</SelectItem>
                                        <SelectItem value="cta">Llamada a la Acción</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Título</Label>
                                <Input 
                                    value={section.title || ''} 
                                    onChange={(e) => updateSection(index, { title: e.target.value })}
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Subtítulo / Descripción</Label>
                            <Textarea 
                                value={section.subtitle || ''} 
                                onChange={(e) => updateSection(index, { subtitle: e.target.value })}
                                rows={2}
                            />
                        </div>

                        {/* Items Editor */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <Label>Items de la Sección</Label>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                        const newItems = [...(section.items || [])];
                                        newItems.push({ title: 'Nuevo Item', description: '' });
                                        updateSection(index, { items: newItems });
                                    }}
                                >
                                    <Plus className="w-3 h-3 mr-2" />
                                    Agregar Item
                                </Button>
                            </div>
                            
                            {!section.items?.length && (
                                <div className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg border border-dashed">
                                    No hay items en esta sección.
                                </div>
                            )}

                            <div className="grid gap-3">
                                {section.items?.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex gap-3 items-start p-3 bg-muted/20 rounded-lg border">
                                        <div className="flex-1 space-y-2">
                                            <Input 
                                                value={item.title} 
                                                onChange={(e) => {
                                                    const newItems = [...(section.items || [])];
                                                    newItems[itemIndex] = { ...item, title: e.target.value };
                                                    updateSection(index, { items: newItems });
                                                }}
                                                placeholder="Título del item"
                                                className="h-8"
                                            />
                                            <Textarea 
                                                value={item.description} 
                                                onChange={(e) => {
                                                    const newItems = [...(section.items || [])];
                                                    newItems[itemIndex] = { ...item, description: e.target.value };
                                                    updateSection(index, { items: newItems });
                                                }}
                                                placeholder="Descripción del item"
                                                className="min-h-[60px] text-sm"
                                            />
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => {
                                                const newItems = [...(section.items || [])];
                                                newItems.splice(itemIndex, 1);
                                                updateSection(index, { items: newItems });
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}
