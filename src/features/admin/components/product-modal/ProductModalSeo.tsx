import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StringListEditor } from '../AdminEditors';
import { motion } from 'framer-motion';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { generateSlug } from '@/lib/utils';
import { AlertTriangle, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface ProductModalSeoProps {
  formData: Partial<Product | Service>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product | Service>>>;
  slugEditable: boolean;
  setSlugEditable: (editable: boolean) => void;
  handleSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductModalSeo: React.FC<ProductModalSeoProps> = ({
  formData,
  setFormData,
  slugEditable,
  setSlugEditable,
  handleSlugChange
}) => {
  const normalizedPreview = generateSlug(formData.slug || '');

  return (
    <motion.div key="seo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="rounded-3xl shadow-sm border-0 bg-card">
            <CardHeader>
                <CardTitle>SEO & Metadatos</CardTitle>
                <CardDescription>Optimización para motores de búsqueda</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Slug URL (Identificador Único)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={formData.slug || ''}
                            disabled={!slugEditable}
                            onChange={handleSlugChange}
                            placeholder="nombre-del-producto-unico"
                            className="flex-1 p-3 bg-muted rounded-xl border-none font-mono text-sm focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                        />
                        <Button variant={slugEditable ? "destructive" : "outline"} onClick={() => setSlugEditable(!slugEditable)}>
                            {slugEditable ? 'Bloquear' : 'Editar'}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon"
                            title="Regenerar desde nombre"
                            disabled={!slugEditable}
                            onClick={() => {
                                const e = { target: { value: formData.name || '' } } as any;
                                handleSlugChange(e);
                            }}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                    
                    {/* Real-time Preview */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg font-mono">
                        <LinkIcon className="w-3 h-3" />
                        <span className="opacity-50">.../products/</span>
                        <span className="text-primary font-medium">{normalizedPreview}</span>
                    </div>

                    {/* Warning for existing products (implied by non-empty slug initially or just always show if needed) */}
                    {/* We can check if it looks like an edit to a live product if we had that info, for now just show a tip */}
                    <div className="flex items-start gap-3 p-3 mt-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-800/50 text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>
                            El slug se normaliza automáticamente (minúsculas, guiones). 
                            Se usará para generar el título SEO y la descripción si están vacíos.
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Keywords</label>
                    <StringListEditor 
                        items={formData.seoKeywords || []}
                        onChange={(k) => setFormData(prev => ({ ...prev, seoKeywords: k }))}
                        placeholder="Ej. impresión 3d"
                    />
                </div>
            </CardContent>
        </Card>
    </motion.div>
  );
};
