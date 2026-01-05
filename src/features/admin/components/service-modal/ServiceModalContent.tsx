import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Service } from '@/shared/types/domain';
import { ProductTab } from '@/shared/types';
import { TabEditor } from '../AdminEditors';

interface ServiceModalContentProps {
  formData: Partial<Service>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  activeTabId: string | null;
  setActiveTabId: (id: string | null) => void;
  addTab: () => void;
  updateTab: (tab: ProductTab) => void;
  removeTab: (id: string) => void;
}

export function ServiceModalContent({
  formData,
  handleChange,
  activeTabId,
  setActiveTabId,
  addTab,
  updateTab,
  removeTab
}: ServiceModalContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Título de las Pestañas</label>
          <input
            type="text"
            name="tabsTitle"
            value={formData.tabsTitle || ''}
            onChange={handleChange}
            placeholder="Ej. Selecciona tu perfil"
            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-700"
          />
        </div>
        <Button type="button" onClick={addTab} className="mt-6">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Pestaña
        </Button>
      </div>

      <div className="space-y-4 mt-4">
        {formData.tabs?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No hay pestañas configuradas. Agrega una para mostrar contenido segmentado (B2B/B2C).
          </div>
        )}
        
        {formData.tabs?.map((tab) => (
          <TabEditor
            key={tab.id}
            tab={tab}
            isOpen={activeTabId === tab.id}
            onToggle={() => setActiveTabId(activeTabId === tab.id ? null : tab.id)}
            onChange={updateTab}
            onRemove={() => removeTab(tab.id)}
          />
        ))}
      </div>
    </div>
  );
}
