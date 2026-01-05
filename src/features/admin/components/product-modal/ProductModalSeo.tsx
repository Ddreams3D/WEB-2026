import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StringListEditor } from '../AdminEditors';
import { motion } from 'framer-motion';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';

interface ProductModalSeoProps {
  formData: Partial<Product | Service>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product | Service>>>;
  slugEditable: boolean;
  setSlugEditable: (editable: boolean) => void;
}

export const ProductModalSeo: React.FC<ProductModalSeoProps> = ({
  formData,
  setFormData,
  slugEditable,
  setSlugEditable
}) => {
  return (
    <motion.div key="seo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="rounded-3xl shadow-sm border-0 bg-card">
            <CardHeader>
                <CardTitle>SEO & Metadatos</CardTitle>
                <CardDescription>Optimización para motores de búsqueda</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Slug URL</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={formData.slug || ''}
                            disabled={!slugEditable}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            className="flex-1 p-3 bg-muted rounded-xl border-none disabled:opacity-50"
                        />
                        <Button variant="outline" onClick={() => setSlugEditable(!slugEditable)}>
                            {slugEditable ? 'Bloquear' : 'Editar'}
                        </Button>
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
