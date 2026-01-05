import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ProductSpecification } from '@/shared/types';

// ==========================================
// SPECIFICATIONS EDITOR (Modern V3)
// ==========================================
interface SpecificationsEditorProps {
  specs: ProductSpecification[];
  onChange: (specs: ProductSpecification[]) => void;
}

export function SpecificationsEditor({ specs = [], onChange }: SpecificationsEditorProps) {
  const handleAdd = () => {
    onChange([...specs, { name: '', value: '' }]);
  };

  const handleRemove = (index: number) => {
    onChange(specs.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ProductSpecification, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    onChange(newSpecs);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {specs.map((spec, index) => (
          <div key={index} className="group flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-transparent hover:border-primary/20 focus-within:border-primary/50 focus-within:bg-muted/50 transition-all">
            <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={spec.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-semibold text-foreground placeholder:text-muted-foreground/50 focus:ring-0 p-1"
                  placeholder="Característica"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleChange(index, 'value', e.target.value)}
                  className="w-full bg-transparent border-l border-border/50 text-sm text-muted-foreground focus:text-foreground placeholder:text-muted-foreground/50 focus:ring-0 p-1 pl-3"
                  placeholder="Valor"
                />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              className="h-7 w-7 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
        
        <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 p-2 rounded-xl border border-dashed border-muted-foreground/30 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all h-[50px]"
        >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Agregar Especificación</span>
        </button>
      </div>
    </div>
  );
}
