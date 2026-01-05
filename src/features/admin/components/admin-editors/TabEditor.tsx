import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { ProductTab } from '@/shared/types';
import { StringListEditor } from './StringListEditor';

// ==========================================
// TAB EDITOR
// ==========================================
interface TabEditorProps {
  tab: ProductTab;
  onChange: (tab: ProductTab) => void;
  onRemove: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function TabEditor({ tab, onChange, onRemove, isOpen, onToggle }: TabEditorProps) {
  const handleChange = (field: keyof ProductTab, value: unknown) => {
    onChange({ ...tab, [field]: value });
  };

  return (
    <div className="border rounded-lg dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-800/50">
      <div 
        className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{tab.label || 'Nueva Pestaña'}</span>
            <span className="text-xs text-muted-foreground font-mono bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded">
                ID: {tab.id}
            </span>
        </div>
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-6 border-t dark:border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">ID (Único)</label>
                    <input
                        type="text"
                        value={tab.id}
                        onChange={(e) => handleChange('id', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Etiqueta</label>
                    <input
                        type="text"
                        value={tab.label}
                        onChange={(e) => handleChange('label', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Descripción</label>
                <textarea
                    value={tab.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Ideal Para (Lista)</label>
                    <StringListEditor 
                        items={tab.idealFor || []} 
                        onChange={(items) => handleChange('idealFor', items)}
                        placeholder="Ej. Principiantes"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Condiciones (Lista)</label>
                    <StringListEditor 
                        items={tab.conditions || []} 
                        onChange={(items) => handleChange('conditions', items)}
                        placeholder="Ej. Entrega en 24h"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t dark:border-neutral-700">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Texto CTA</label>
                    <input
                        type="text"
                        value={tab.ctaText}
                        onChange={(e) => handleChange('ctaText', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Acción CTA</label>
                    <select
                        value={tab.ctaAction || 'quote'}
                        onChange={(e) => handleChange('ctaAction', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                    >
                        <option value="quote">Cotizar (WhatsApp)</option>
                        <option value="cart">Añadir al Carrito</option>
                        <option value="whatsapp">Mensaje Directo</option>
                    </select>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
