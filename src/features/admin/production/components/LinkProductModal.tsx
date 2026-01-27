'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { SlicingInboxItem } from '../types';
import { ProductService } from '@/services/product.service';
import { StoreProduct } from '@/shared/types/domain';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SlicingInboxService } from '../services/slicing-inbox.service';
import { ProductImage } from '@/shared/components/ui/DefaultImage';

interface LinkProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  inboxItem: SlicingInboxItem | null;
  onSuccess: () => void;
}

export function LinkProductModal({ isOpen, onClose, inboxItem, onSuccess }: LinkProductModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  // Cargar productos al abrir o cambiar búsqueda
  useEffect(() => {
    if (!isOpen) {
      setProducts([]);
      setSelectedProduct(null);
      setSearchTerm('');
      return;
    }

    // Auto-search inicial con el nombre del inbox item
    if (inboxItem) {
      setSearchTerm(inboxItem.name);
    }
  }, [isOpen, inboxItem]);

  // Debounce search
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      if (searchTerm.length < 2) return;
      
      setLoading(true);
      try {
        // Obtenemos todos y filtramos en cliente por ahora (idealmente sería server-side search)
        const allProducts = await ProductService.getAllProducts();
        const filtered = allProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filtered);
      } catch (error) {
        console.error(error);
        toast.error('Error buscando productos');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  const handleLink = async () => {
    if (!selectedProduct || !inboxItem) return;

    setIsLinking(true);
    try {
      // 1. Actualizar Producto con nuevos datos de producción
      // Actualizamos productionData con los valores del slicing
      const updatedData: Partial<StoreProduct> = {
        productionData: {
            ...selectedProduct.productionData,
            lastSliced: new Date().toISOString(),
            grams: inboxItem.grams,
            printTimeMinutes: inboxItem.time,
            machineType: inboxItem.machineType,
            filamentType: inboxItem.filamentType,
            fileName: inboxItem.fileName
        }
      };

      await ProductService.updateProduct(selectedProduct.id, updatedData);

      // 2. Marcar Inbox como Linked
      await SlicingInboxService.linkItemToProduct(inboxItem.id, selectedProduct.id);

      toast.success('Producto vinculado y actualizado correctamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error al vincular producto');
    } finally {
      setIsLinking(false);
    }
  };

  if (!inboxItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vincular Slicing a Producto</DialogTitle>
          <DialogDescription>
            Busca un producto existente para actualizar sus datos de producción con este slice.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Info del Slice */}
          <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between border">
            <div>
              <p className="text-sm font-medium text-foreground">{inboxItem.name}</p>
              <p className="text-xs text-muted-foreground">{inboxItem.fileName}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <Badge variant="secondary">⚖️ {inboxItem.grams}g</Badge>
              <Badge variant="secondary">⏱️ {Math.floor(inboxItem.time / 60)}h {Math.round(inboxItem.time % 60)}m</Badge>
            </div>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px]">
            {/* Lista de Resultados */}
            <ScrollArea className="border rounded-md p-2">
              {loading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
              ) : products.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                    {searchTerm ? 'No se encontraron productos' : 'Empieza a escribir...'}
                </div>
              ) : (
                <div className="space-y-1">
                  {products.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={cn(
                        "p-2 rounded cursor-pointer text-sm flex items-center justify-between hover:bg-muted",
                        selectedProduct?.id === p.id ? "bg-primary/10 border-primary border" : "border border-transparent"
                      )}
                    >
                      <span className="truncate max-w-[180px]">{p.name}</span>
                      {selectedProduct?.id === p.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Preview de Cambios */}
            <div className="border rounded-md p-4 bg-muted/10">
              <h4 className="text-sm font-medium mb-3">Vista Previa de Actualización</h4>
              
              {selectedProduct ? (
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                     <ProductImage 
                        src={selectedProduct.images?.[0]?.url} 
                        alt={selectedProduct.name}
                        className="w-10 h-10 rounded object-cover bg-white"
                        width={40}
                        height={40}
                     />
                     <span className="font-medium truncate">{selectedProduct.name}</span>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Peso (g)</span>
                        <span>Tiempo (min)</span>
                    </div>
                    <div className="flex items-center justify-between bg-background p-2 rounded border">
                        <div className="flex items-center gap-2">
                            <span className="line-through text-muted-foreground">
                                {(selectedProduct as any).productionData?.grams || '?'}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="font-bold text-green-600">{inboxItem.grams}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="line-through text-muted-foreground">
                                {(selectedProduct as any).productionData?.printTimeMinutes || '?'}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="font-bold text-green-600">{inboxItem.time}</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                        * Se actualizará la metadata de producción del producto.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs text-center">
                  Selecciona un producto para ver los cambios
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleLink} disabled={!selectedProduct || isLinking}>
            {isLinking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmar Vinculación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
