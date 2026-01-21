import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/features/admin/components/ImageUpload';
import { SupportItem } from '@/app/soportes-personalizados/data';
import { StoragePathBuilder } from '@/shared/constants/storage-paths';

interface SupportItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SupportItem;
  onSave: (item: SupportItem) => void;
  categoryId: string;
}

export function SupportItemDialog({ 
  open, 
  onOpenChange, 
  item, 
  onSave,
  categoryId 
}: SupportItemDialogProps) {
  const [formData, setFormData] = useState<Partial<SupportItem>>({
    title: '',
    description: '',
    imageUrl: '',
    price: 0
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        price: 0
      });
    }
  }, [item, open]);

  const handleSave = () => {
    onSave({
      id: item?.id || crypto.randomUUID(),
      title: formData.title || '',
      description: formData.description || '',
      imageUrl: formData.imageUrl || '',
      price: formData.price || 0
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label>Imagen del Producto</Label>
            <div className="border rounded-lg p-4 bg-muted/20">
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                onRemove={() => setFormData({ ...formData, imageUrl: '' })}
                defaultName={formData.title}
                storagePath={`${StoragePathBuilder.services('soportes-personalizados')}/${categoryId}`}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Soporte Alexa R2D2"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Precio Estimado (Opcional)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              placeholder="0.00"
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
