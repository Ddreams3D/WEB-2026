import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SpecificationsEditor } from '../AdminEditors';
import { motion } from 'framer-motion';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';

interface ProductModalDetailsProps {
  formData: Partial<Product | Service>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product | Service>>>;
  availableMaterials: string[];
}

export const ProductModalDetails: React.FC<ProductModalDetailsProps> = ({
  formData,
  setFormData,
  availableMaterials
}) => {
  return (
    <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="rounded-3xl shadow-sm border-0 bg-card">
            <CardHeader>
                <CardTitle>Detalles Técnicos</CardTitle>
                <CardDescription>Materiales y especificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {formData.kind === 'product' && (
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Materiales Disponibles</label>
                        <div className="flex flex-wrap gap-2">
                            {availableMaterials.map(mat => (
                                <div 
                                    key={mat}
                                    onClick={() => {
                                        const current = (formData as Product).materials || [];
                                        const exists = current.includes(mat);
                                        setFormData(prev => ({
                                            ...prev,
                                            materials: exists 
                                                ? (prev as Product).materials?.filter((m: string) => m !== mat)
                                                : [...((prev as Product).materials || []), mat]
                                        }));
                                    }}
                                    className={`cursor-pointer px-4 py-2 rounded-xl border transition-all ${
                                        (formData as Product).materials?.includes(mat)
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-background hover:bg-muted text-muted-foreground'
                                    }`}
                                >
                                    <div className="font-semibold">{mat}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="space-y-2 pt-4 border-t">
                    <label className="text-sm font-medium">Especificaciones Adicionales</label>
                    <SpecificationsEditor 
                        specs={formData.specifications || []} 
                        onChange={(specs) => setFormData(prev => ({ ...prev, specifications: specs }))} 
                    />
                </div>
            </CardContent>
         </Card>
    </motion.div>
  );
};
