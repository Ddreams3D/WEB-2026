import React from 'react';
import { FileText, Type } from 'lucide-react';
import { EditableBlock } from '../EditableBlock';
import { PortfolioItem } from '@/shared/types/domain';
import { motion } from 'framer-motion';

interface ProjectModalContentProps {
  formData: Partial<PortfolioItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<PortfolioItem>>>;
  editingBlock: string | null;
  setEditingBlock: (block: string | null) => void;
}

export const ProjectModalContent: React.FC<ProjectModalContentProps> = ({
  formData,
  setFormData,
  editingBlock,
  setEditingBlock
}) => {
  return (
    <motion.div 
        key="content"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-4"
    >
        {/* Description Block */}
        <EditableBlock
            id="description"
            title="Descripción Detallada"
            icon={FileText}
            isEditing={editingBlock === 'description'}
            onEdit={() => setEditingBlock('description')}
            onSave={() => setEditingBlock(null)}
            onCancel={() => setEditingBlock(null)}
            preview={
                <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                        {formData.description || 'Sin descripción...'}
                    </p>
                </div>
            }
        >
            <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[200px] p-4 bg-muted/50 rounded-xl border-none focus:ring-1 focus:ring-primary"
                placeholder="Escribe una descripción detallada del proyecto..."
            />
        </EditableBlock>

        {/* Applications Block */}
        <EditableBlock
            id="applications"
            title="Aplicaciones / Usos"
            icon={Type}
            isEditing={editingBlock === 'applications'}
            onEdit={() => setEditingBlock('applications')}
            onSave={() => setEditingBlock(null)}
            onCancel={() => setEditingBlock(null)}
            preview={
                <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                        {formData.applications || 'No especificado'}
                    </p>
                </div>
            }
        >
            <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Describe para qué sirve este proyecto o en qué sectores se aplica.</label>
                <textarea
                    value={formData.applications || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, applications: e.target.value }))}
                    className="w-full min-h-[100px] p-4 bg-muted/50 rounded-xl border-none focus:ring-1 focus:ring-primary"
                    placeholder="Ej. Medicina, Educación, Entrenamiento..."
                />
            </div>
        </EditableBlock>

        {/* CTA Text */}
        <EditableBlock
            id="ctaText"
            title="Texto del Botón (CTA)"
            icon={Type}
            isEditing={editingBlock === 'ctaText'}
            onEdit={() => setEditingBlock('ctaText')}
            onSave={() => setEditingBlock(null)}
            onCancel={() => setEditingBlock(null)}
            preview={
                <div className="inline-flex items-center px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
                    {formData.ctaText || 'Solicitar cotización similar'}
                </div>
            }
        >
            <input
                type="text"
                value={formData.ctaText || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                className="w-full p-3 bg-muted/50 rounded-xl border-none focus:ring-1 focus:ring-primary"
                placeholder="Ej. Solicitar cotización similar"
            />
        </EditableBlock>
    </motion.div>
  );
};
