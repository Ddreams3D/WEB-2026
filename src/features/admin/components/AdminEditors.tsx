import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { ProductSpecification, ProductTab, ProductOption, ProductOptionValue } from '@/shared/types';

// ==========================================
// OPTIONS EDITOR
// ==========================================
interface OptionsEditorProps {
  options: ProductOption[];
  onChange: (options: ProductOption[]) => void;
}

export function OptionsEditor({ options = [], onChange }: OptionsEditorProps) {
  const handleAddOption = () => {
    const newOption: ProductOption = {
      id: `opt-${Date.now()}`,
      name: 'Nueva Opción',
      type: 'radio',
      required: false,
      values: []
    };
    onChange([...options, newOption]);
  };

  const handleRemoveOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const handleUpdateOption = (index: number, field: keyof ProductOption, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange(newOptions);
  };

  // Values handling
  const handleAddValue = (optionIndex: number) => {
    const newOptions = [...options];
    const newValue: ProductOptionValue = {
      id: `val-${Date.now()}`,
      name: 'Nuevo Valor',
      priceModifier: 0
    };
    newOptions[optionIndex].values = [...(newOptions[optionIndex].values || []), newValue];
    onChange(newOptions);
  };

  const handleRemoveValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].values = newOptions[optionIndex].values.filter((_, i) => i !== valueIndex);
    onChange(newOptions);
  };

  const handleUpdateValue = (optionIndex: number, valueIndex: number, field: keyof ProductOptionValue, value: any) => {
    const newOptions = [...options];
    newOptions[optionIndex].values[valueIndex] = {
      ...newOptions[optionIndex].values[valueIndex],
      [field]: value
    };
    onChange(newOptions);
  };

  return (
    <div className="space-y-6">
      {options.map((option, optIndex) => (
        <div key={option.id} className="border rounded-lg dark:border-neutral-700 bg-white dark:bg-neutral-800/50 overflow-hidden">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={option.name}
                onChange={(e) => handleUpdateOption(optIndex, 'name', e.target.value)}
                className="font-medium bg-transparent border-none focus:ring-0 p-0 text-sm w-full"
                placeholder="Nombre de la opción (ej. Color)"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={option.type}
                onChange={(e) => handleUpdateOption(optIndex, 'type', e.target.value)}
                className="text-xs border rounded px-2 py-1 dark:bg-neutral-700"
              >
                <option value="radio">Radio (Única)</option>
                <option value="select">Select (Lista)</option>
                <option value="checkbox">Checkbox (Múltiple)</option>
              </select>
              <label className="flex items-center gap-1 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={option.required}
                  onChange={(e) => handleUpdateOption(optIndex, 'required', e.target.checked)}
                  className="rounded border-neutral-300"
                />
                Obligatorio
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveOption(optIndex)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 w-7 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Valores Disponibles</div>
            
            {option.values?.map((val, valIndex) => (
              <div key={val.id} className="flex items-start gap-2 p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                <div className="grid grid-cols-12 gap-2 flex-1">
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={val.name}
                      onChange={(e) => handleUpdateValue(optIndex, valIndex, 'name', e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded dark:bg-neutral-700"
                      placeholder="Nombre (ej. Rojo)"
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">S/</span>
                      <input
                        type="number"
                        value={val.priceModifier}
                        onChange={(e) => handleUpdateValue(optIndex, valIndex, 'priceModifier', parseFloat(e.target.value) || 0)}
                        className="w-full pl-6 pr-2 py-1 text-sm border rounded dark:bg-neutral-700"
                        placeholder="Precio Extra"
                      />
                    </div>
                  </div>
                  <div className="col-span-5 flex flex-wrap gap-2 items-center">
                    <label className="flex items-center gap-1 text-xs cursor-pointer select-none whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={val.isDefault}
                        onChange={(e) => {
                           // Logic to unset others if radio/select? For now just toggle.
                           handleUpdateValue(optIndex, valIndex, 'isDefault', e.target.checked);
                        }}
                        className="rounded border-neutral-300"
                      />
                      Default
                    </label>
                    <label className="flex items-center gap-1 text-xs cursor-pointer select-none whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={val.hasInput}
                        onChange={(e) => handleUpdateValue(optIndex, valIndex, 'hasInput', e.target.checked)}
                        className="rounded border-neutral-300"
                      />
                      Con Input
                    </label>
                    {val.hasInput && (
                        <input 
                            type="text"
                            value={val.inputPlaceholder || ''}
                            onChange={(e) => handleUpdateValue(optIndex, valIndex, 'inputPlaceholder', e.target.value)}
                            placeholder="Placeholder..."
                            className="w-full mt-1 px-2 py-1 text-xs border rounded dark:bg-neutral-700"
                        />
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveValue(optIndex, valIndex)}
                  className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddValue(optIndex)}
              className="mt-2 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Agregar Valor
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddOption}
        className="w-full py-4 border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Nueva Opción (Color, Tamaño, etc.)
      </Button>
    </div>
  );
}

// ==========================================
// STRING LIST EDITOR (e.g. Tags, IdealFor, Conditions)
// ==========================================
interface StringListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
}

export function StringListEditor({ 
  items = [], 
  onChange, 
  placeholder = "Nuevo ítem...", 
  addButtonText = "Agregar" 
}: StringListEditorProps) {
  const handleAdd = () => {
    onChange([...items, '']);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
            placeholder={placeholder}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        {addButtonText}
      </Button>
    </div>
  );
}

// ==========================================
// SPECIFICATIONS EDITOR
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
      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground mb-2">
        <div className="col-span-4">Nombre</div>
        <div className="col-span-6">Valor</div>
        <div className="col-span-2"></div>
      </div>
      
      {specs.map((spec, index) => (
        <div key={index} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-4">
            <input
              type="text"
              value={spec.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
              placeholder="Ej. Material"
            />
          </div>
          <div className="col-span-6">
            <input
              type="text"
              value={spec.value}
              onChange={(e) => handleChange(index, 'value', e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
              placeholder="Ej. PLA / Resina"
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Especificación
      </Button>
    </div>
  );
}

// ==========================================
// TAB EDITOR
// ==========================================
interface TabEditorProps {
  tab: ProductTab;
  onChange: (tab: ProductTab) => void;
  onRemove: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function TabEditor({ tab, onChange, onRemove, isOpen, onToggle }: TabEditorProps) {
  const handleChange = (field: keyof ProductTab, value: any) => {
    onChange({ ...tab, [field]: value });
  };

  return (
    <div className="border rounded-lg dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-800/50">
      <div 
        className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{tab.label || 'Nueva Pestaña'}</span>
            <span className="text-xs text-muted-foreground font-mono bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded">
                ID: {tab.id}
            </span>
        </div>
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-6 border-t dark:border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">ID (Único)</label>
                    <input
                        type="text"
                        value={tab.id}
                        onChange={(e) => handleChange('id', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Etiqueta</label>
                    <input
                        type="text"
                        value={tab.label}
                        onChange={(e) => handleChange('label', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Descripción</label>
                <textarea
                    value={tab.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Ideal Para (Lista)</label>
                    <StringListEditor 
                        items={tab.idealFor || []} 
                        onChange={(items) => handleChange('idealFor', items)}
                        placeholder="Ej. Principiantes"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Condiciones (Lista)</label>
                    <StringListEditor 
                        items={tab.conditions || []} 
                        onChange={(items) => handleChange('conditions', items)}
                        placeholder="Ej. Entrega en 24h"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t dark:border-neutral-700">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Texto CTA</label>
                    <input
                        type="text"
                        value={tab.ctaText}
                        onChange={(e) => handleChange('ctaText', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Acción CTA</label>
                    <select
                        value={tab.ctaAction || 'quote'}
                        onChange={(e) => handleChange('ctaAction', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700"
                    >
                        <option value="quote">Cotizar (WhatsApp)</option>
                        <option value="cart">Añadir al Carrito</option>
                        <option value="whatsapp">Mensaje Directo</option>
                    </select>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
