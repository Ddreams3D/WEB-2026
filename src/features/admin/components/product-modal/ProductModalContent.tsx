import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TabEditor } from '../AdminEditors';
import { motion } from 'framer-motion';
import { Product, ProductTab } from '@/shared/types';
import { Service } from '@/shared/types/domain';

interface ProductModalContentProps {
  formData: Partial<Product | Service>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product | Service>>>;
  activeTabId: string | null;
  setActiveTabId: (id: string | null) => void;
}

export const ProductModalContent: React.FC<ProductModalContentProps> = ({
  formData,
  setFormData,
  activeTabId,
  setActiveTabId
}) => {
  return (
    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="rounded-3xl shadow-sm border-0 bg-card">
            <CardHeader>
                <CardTitle>Contenido Rico</CardTitle>
                <CardDescription>Pestañas y descripciones detalladas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Título de Pestañas</label>
                    <input 
                        type="text" 
                        value={formData.tabsTitle || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, tabsTitle: e.target.value }))}
                        className="w-full p-3 bg-muted rounded-xl border-none"
                        placeholder="Ej. Información Adicional"
                    />
                </div>
                <div className="space-y-4">
                     <Button onClick={() => {
                         const newTab: ProductTab = { 
                            id: `tab-${Date.now()}`, 
                            label: 'Nueva Pestaña', 
                            description: '', 
                            features: [],
                            ctaText: 'Solicitar', 
                            ctaAction: 'cart' 
                        };
                         setFormData(prev => ({ ...prev, tabs: [...(prev.tabs || []), newTab] }));
                         setActiveTabId(newTab.id);
                     }} className="w-full py-6 border-dashed border-2 bg-transparent hover:bg-muted text-muted-foreground">
                        <Plus className="w-5 h-5 mr-2" /> Agregar Sección de Contenido
                    </Button>
                    
                    {formData.tabs?.map(tab => (
                        <TabEditor
                            key={tab.id}
                            tab={tab}
                            isOpen={activeTabId === tab.id}
                            onToggle={() => setActiveTabId(activeTabId === tab.id ? null : tab.id)}
                            onChange={(updated) => setFormData(prev => ({ ...prev, tabs: prev.tabs?.map(t => t.id === updated.id ? updated : t) }))}
                            onRemove={() => setFormData(prev => ({ ...prev, tabs: prev.tabs?.filter(t => t.id !== tab.id) }))}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    </motion.div>
  );
};
