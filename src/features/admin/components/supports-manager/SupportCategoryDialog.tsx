import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SupportCategory } from '@/app/soportes-personalizados/data';

interface SupportCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: SupportCategory;
  onSave: (category: SupportCategory) => void;
}

export function SupportCategoryDialog({ 
  open, 
  onOpenChange, 
  category, 
  onSave 
}: SupportCategoryDialogProps) {
  const [formData, setFormData] = useState<Partial<SupportCategory>>({
    title: '',
    description: '',
    items: []
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        title: '',
        description: '',
        items: []
      });
    }
  }, [category, open]);

  const handleSave = () => {
    onSave({
      id: category?.id || crypto.randomUUID(),
      title: formData.title || '',
      description: formData.description || '',
      items: formData.items || []
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Soportes para Alexa"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción de la categoría..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
