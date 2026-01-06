import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FinanceItem } from '../types';
import { cn } from '@/lib/utils';

interface FinanceModalItemsProps {
  items: FinanceItem[];
  currency: 'PEN' | 'USD';
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof FinanceItem, value: any) => void;
  onRemoveItem: (id: string) => void;
  totalAmount: number;
}

export function FinanceModalItems({
  items,
  currency,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  totalAmount
}: FinanceModalItemsProps) {
  const symbol = currency === 'PEN' ? 'S/.' : '$';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Items / Desglose</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddItem}
          className="h-8 gap-2 text-xs"
        >
          <Plus className="w-3 h-3" /> Agregar Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
          No hay items agregados. El monto total se asignará al concepto general.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-start">
              <input
                type="text"
                placeholder="Descripción del item"
                className="w-full p-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={item.description}
                onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
              />
              
              <div className="flex items-center gap-1 w-24">
                <span className="text-xs text-muted-foreground">Cant.</span>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-1 focus:ring-primary text-center"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex items-center gap-1 w-32 relative">
                <span className="absolute left-2 top-2 text-xs text-muted-foreground">{symbol}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-2 pl-6 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                  value={item.unitPrice}
                  onChange={(e) => onUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="flex justify-end pt-2 border-t mt-4">
            <div className="text-sm font-medium">
              Total Items: {symbol} {items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}