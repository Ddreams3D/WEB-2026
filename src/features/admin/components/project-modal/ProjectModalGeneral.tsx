import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Layers, User, Star, Check, Plus } from 'lucide-react';
import { EditableBlock } from '../EditableBlock';
import { PortfolioItem } from '@/shared/types/domain';
import { useTheme } from '@/contexts/ThemeContext';
import { THEME_CONFIG } from '@/config/themes';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProjectModalGeneralProps {
  formData: Partial<PortfolioItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<PortfolioItem>>>;
  editingBlock: string | null;
  setEditingBlock: (block: string | null) => void;
  availableCategories: string[];
  setAvailableCategories: React.Dispatch<React.SetStateAction<string[]>>;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  isAddingCategory: boolean;
  setIsAddingCategory: (isAdding: boolean) => void;
}

export const ProjectModalGeneral: React.FC<ProjectModalGeneralProps> = ({
  formData,
  setFormData,
  editingBlock,
  setEditingBlock,
  availableCategories,
  setAvailableCategories,
  newCategoryName,
  setNewCategoryName,
  isAddingCategory,
  setIsAddingCategory
}) => {
  const { theme } = useTheme();

  return (
    <motion.div 
        key="general"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-4"
    >
        {/* Organization Block */}
        <EditableBlock
            id="organization"
            title="Información General"
            icon={Layers}
            isEditing={editingBlock === 'organization'}
            onEdit={() => setEditingBlock('organization')}
            onSave={() => setEditingBlock(null)}
            onCancel={() => setEditingBlock(null)}
            preview={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-1.5 mb-1">
                            <Layers className="w-3.5 h-3.5" /> Categoría
                        </div>
                        <div className="font-medium text-lg">{formData.category || 'Sin categoría'}</div>
                    </div>
                    <div>
                        <div className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-1.5 mb-1">
                            <User className="w-3.5 h-3.5" /> Cliente
                        </div>
                        <div className="font-medium text-lg">{formData.clientName || 'N/A'}</div>
                    </div>
                    <div>
                        <div className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-1.5 mb-1">
                            <Calendar className="w-3.5 h-3.5" /> Fecha
                        </div>
                        <div className="font-medium text-lg">
                            {formData.projectDate 
                                ? format(new Date(formData.projectDate), 'MMMM yyyy', { locale: es }) 
                                : 'Fecha no definida'}
                        </div>
                    </div>
                </div>
            }
        >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <div className="flex flex-wrap gap-2">
                        {availableCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-sm border transition-all",
                                    formData.category === cat 
                                        ? "bg-primary text-primary-foreground border-primary" 
                                        : "bg-background hover:bg-muted"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                        {/* INLINE CATEGORY CREATION */}
                        {isAddingCategory ? (
                            <div className="flex items-center gap-2 bg-background border rounded-full pl-3 pr-1 py-1 animate-in fade-in slide-in-from-left-5">
                                <input 
                                    type="text" 
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nueva categoría..."
                                    className="bg-transparent border-none text-sm w-32 focus:ring-0 p-0"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newCategoryName.trim()) {
                                            setAvailableCategories(prev => [...prev, newCategoryName.trim()]);
                                            setFormData(prev => ({ ...prev, category: newCategoryName.trim() }));
                                            setNewCategoryName('');
                                            setIsAddingCategory(false);
                                        } else if (e.key === 'Escape') {
                                            setIsAddingCategory(false);
                                        }
                                    }}
                                />
                                <div className="flex gap-1">
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-6 w-6 rounded-full hover:bg-green-100 text-green-600"
                                        onClick={() => {
                                            if (newCategoryName.trim()) {
                                                setAvailableCategories(prev => [...prev, newCategoryName.trim()]);
                                                setFormData(prev => ({ ...prev, category: newCategoryName.trim() }));
                                                setNewCategoryName('');
                                                setIsAddingCategory(false);
                                            }
                                        }}
                                    >
                                        <Check className="w-3 h-3" />
                                    </Button>
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-6 w-6 rounded-full hover:bg-red-100 text-red-600"
                                        onClick={() => setIsAddingCategory(false)}
                                    >
                                        <Plus className="w-3 h-3 rotate-45" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAddingCategory(true)}
                                className="px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-dashed border-muted-foreground/30 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Agregar
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cliente</label>
                        <input
                            type="text"
                            value={formData.clientName || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Nombre del cliente o empresa"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha del Proyecto</label>
                        <input
                            type="date"
                            value={formData.projectDate ? new Date(formData.projectDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, projectDate: new Date(e.target.value) }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>
             </div>
        </EditableBlock>

        {/* Featured Block */}
        <div 
            onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
            className={cn(
                "group relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all duration-300",
                formData.isFeatured 
                    ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800" 
                    : "bg-card hover:border-primary/50"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "p-3 rounded-full transition-colors",
                    formData.isFeatured ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    <Star className={cn("w-6 h-6", formData.isFeatured && "fill-current")} />
                </div>
                <div>
                    <h3 className={cn("font-semibold text-lg", formData.isFeatured ? "text-amber-700 dark:text-amber-400" : "text-foreground")}>
                        {formData.isFeatured ? 'Proyecto Destacado' : 'Proyecto Estándar'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {formData.isFeatured 
                            ? 'Este proyecto aparecerá en la sección principal del portafolio.' 
                            : 'Haz clic para destacar este proyecto en la página principal.'}
                    </p>
                </div>
                {formData.isFeatured && (
                    <div className="ml-auto">
                        <Check className="w-6 h-6 text-amber-600" />
                    </div>
                )}
            </div>
        </div>
    </motion.div>
  );
};

import { motion } from 'framer-motion';
