import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditableBlockProps {
  id: string;
  title: string;
  icon: React.ElementType;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  preview: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const EditableBlock: React.FC<EditableBlockProps> = ({ 
  id, 
  title, 
  icon: Icon, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  preview, 
  children,
  className 
}) => {
  const isCompact = true;
  return (
    <div className={`bg-card rounded-3xl shadow-sm border transition-all duration-300 ${isCompact ? 'p-4 lg:p-5' : 'p-6 lg:p-8'} ${isEditing ? 'ring-2 ring-primary/20 scale-[1.01]' : 'hover:shadow-md'} ${className || ''}`}>
      <div className={`flex items-center justify-between ${isCompact ? 'mb-3' : 'mb-6'}`}>
          <div className="flex items-center gap-3">
              <div className={`rounded-lg transition-colors ${isCompact ? 'p-1.5' : 'p-2'} ${isEditing ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className={isCompact ? "w-4 h-4" : "w-5 h-5"} />
              </div>
              <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold transition-colors ${isEditing ? 'text-primary' : ''}`}>{title}</h3>
          </div>
          {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={onEdit} className="rounded-full hover:bg-primary/10 hover:text-primary">
                  <Edit className="w-4 h-4 mr-2" /> Editar
              </Button>
          ) : (
              <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={onCancel} className="rounded-full text-muted-foreground hover:text-foreground">
                      Cancelar
                  </Button>
                  <Button size="sm" onClick={onSave} className="rounded-full">
                      <Check className="w-4 h-4 mr-2" /> Listo
                  </Button>
              </div>
          )}
      </div>
      
      <div className="relative">
          <AnimatePresence mode="wait">
              {isEditing ? (
                  <motion.div
                      key="edit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                  >
                      {children}
                  </motion.div>
              ) : (
                  <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                  >
                      {preview}
                  </motion.div>
              )}
          </AnimatePresence>
      </div>
    </div>
  );
};
