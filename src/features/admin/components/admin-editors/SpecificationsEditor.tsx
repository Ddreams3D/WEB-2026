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
          <div key={index} className="group flex items-start gap-2 bg-muted/30 p-3 rounded-xl border border-transparent hover:border-primary/20 focus-within:border-primary/50 focus-within:bg-muted/50 transition-all">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
                <input
                  type="text"
                  value={spec.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="w-full bg-background/50 border rounded-lg px-2 py-1 text-sm font-semibold text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                  placeholder="Nombre (ej. Peso)"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleChange(index, 'value', e.target.value)}
                  className="w-full bg-background/50 border rounded-lg px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-0"
                  placeholder="Valor (ej. 1.5 kg)"
                />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              className="h-8 w-8 rounded-full text-muted-foreground opacity-100 hover:bg-destructive/10 hover:text-destructive shrink-0 mt-0.5"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
