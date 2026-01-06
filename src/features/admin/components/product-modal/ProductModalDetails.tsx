import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SpecificationsEditor } from '../AdminEditors';
import { motion } from 'framer-motion';
import { Product } from '@/shared/types';
import { Service } from '@/shared/types/domain';
import { Button } from '@/components/ui/button';
import { Plus, X, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProductModalDetailsProps {
  formData: Partial<Product | Service>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product | Service>>>;
  availableMaterials: string[];
  setAvailableMaterials: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProductModalDetails: React.FC<ProductModalDetailsProps> = ({
  formData,
  setFormData,
  availableMaterials,
  setAvailableMaterials
}) => {
  const [newMaterial, setNewMaterial] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMaterial = () => {
    if (newMaterial.trim() && !availableMaterials.includes(newMaterial.trim())) {
      setAvailableMaterials([...availableMaterials, newMaterial.trim()]);
      setNewMaterial('');
      setIsAdding(false);
    }
  };

  const handleRemoveMaterial = (e: React.MouseEvent, mat: string) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de eliminar el material "${mat}"?`)) {
        setAvailableMaterials(availableMaterials.filter(m => m !== mat));
        // Also remove from selected materials if present
        if ((formData as Product).materials?.includes(mat)) {
            setFormData(prev => ({
                ...prev,
                materials: (prev as Product).materials?.filter((m: string) => m !== mat)
            }));
        }
    }
  };

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
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Materiales Disponibles</label>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsAdding(!isAdding)}
                                className="h-8 text-primary hover:text-primary/80"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Nuevo Material
                            </Button>
                        </div>
                        
                        {isAdding && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-2 mb-4"
                            >
                                <Input 
                                    value={newMaterial}
                                    onChange={(e) => setNewMaterial(e.target.value)}
                                    placeholder="Nombre del material (ej. Nylon)"
                                    className="h-9"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddMaterial()}
                                    autoFocus
                                />
                                <Button size="sm" onClick={handleAddMaterial} disabled={!newMaterial.trim()}>
                                    Agregar
                                </Button>
                            </motion.div>
                        )}

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
                                    className={`group relative cursor-pointer px-4 py-2 rounded-xl border transition-all select-none ${
                                        (formData as Product).materials?.includes(mat)
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-background hover:bg-muted text-muted-foreground'
                                    }`}
                                >
                                    <div className="font-semibold pr-4">{mat}</div>
                                    <button
                                        onClick={(e) => handleRemoveMaterial(e, mat)}
                                        className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
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
