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
                <CardDescription>
                    Aquí puedes añadir secciones detalladas que aparecerán como pestañas en la ficha del producto. 
                    Úsalo para explicar el proceso de diseño, mostrar garantías, o dar instrucciones de cuidado.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <label className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        Título de la Sección de Pestañas
                    </label>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                        Es el encabezado principal que agrupa todas las pestañas (ej. "Información del Producto" o "Detalles y Garantía").
                    </p>
                    <input 
                        type="text" 
                        value={formData.tabsTitle || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, tabsTitle: e.target.value }))}
                        className="w-full p-3 bg-white dark:bg-slate-950 rounded-lg border border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Ej. Más Información"
                    />
                </div>
                <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Pestañas Individuales</h3>
                     </div>
                     
                     {(!formData.tabs || formData.tabs.length === 0) && (
                        <div className="text-center py-8 border-2 border-dashed rounded-xl border-muted-foreground/20 bg-muted/5">
                            <p className="text-muted-foreground text-sm mb-2">No has agregado ninguna pestaña aún.</p>
                            <p className="text-xs text-muted-foreground/70 max-w-xs mx-auto">
                                Agrega pestañas para organizar información extensa como "Proceso de Envío", "Guía de Tallas", o "Preguntas Frecuentes".
                            </p>
                        </div>
                     )}

                     {formData.tabs?.map((tab, index) => (
                        <div key={tab.id} className="relative group">
                            <div className="absolute -left-3 top-6 text-xs font-mono text-muted-foreground/30 font-bold hidden sm:block">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <TabEditor
                                tab={tab}
                                isOpen={activeTabId === tab.id}
                                onToggle={() => setActiveTabId(activeTabId === tab.id ? null : tab.id)}
                                onChange={(updated) => setFormData(prev => ({ ...prev, tabs: prev.tabs?.map(t => t.id === updated.id ? updated : t) }))}
                                onRemove={() => setFormData(prev => ({ ...prev, tabs: prev.tabs?.filter(t => t.id !== tab.id) }))}
                            />
                        </div>
                    ))}

                     <Button onClick={() => {
                         const newTab: ProductTab = { 
                            id: `tab-${Date.now()}`, 
                            label: 'Nueva Pestaña', 
                            description: '', 
                            features: [],
                            ctaText: 'Consultar', 
                            ctaAction: 'contact' 
                        };
                         setFormData(prev => ({ ...prev, tabs: [...(prev.tabs || []), newTab] }));
                         setActiveTabId(newTab.id);
                     }} className="w-full py-6 border-dashed border-2 bg-transparent hover:bg-muted/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all group">
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                                <span className="font-semibold">Agregar Nueva Pestaña</span>
                            </div>
                            <span className="text-xs opacity-70 font-normal">Click para añadir una nueva sección de contenido</span>
                        </div>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </motion.div>
  );
};
