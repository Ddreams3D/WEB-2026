import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, Service } from '@/shared/types/domain';

interface ProductOptionsProps {
  product: Product | Service;
  selectedOptions: Record<string, string>;
  customInputs: Record<string, string>;
  handleOptionChange: (optionId: string, value: any, isUserAction?: boolean) => void;
  setCustomInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function ProductOptions({
  product,
  selectedOptions,
  customInputs,
  handleOptionChange,
  setCustomInputs
}: ProductOptionsProps) {
  if (product.kind !== 'product' || !product.options || product.options.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "space-y-4 rounded-xl p-5 border border-border",
      "bg-muted/30"
    )}>
      <h3 className="font-bold text-foreground">Opciones de Personalización</h3>
      <div className="space-y-4">
        {product.options.map((option) => (
          <div key={option.id} className="space-y-2">
            {option.name && (
              <label className="text-sm font-medium text-foreground block mb-1">
                {option.name} {option.required && <span className="text-destructive">*</span>}
              </label>
            )}
            
            {option.type === 'select' && (
              <div className="relative">
                <select
                  className={cn(
                    "w-full p-2.5 rounded-lg border border-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer",
                    "bg-background"
                  )}
                  value={selectedOptions[option.id] || ''}
                  onChange={(e) => handleOptionChange(option.id, e.target.value, true)}
                >
                  <option value="" disabled>Seleccionar {option.name}</option>
                  {option.values.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.name} {value.priceModifier > 0 ? `(+ S/ ${value.priceModifier.toFixed(2)})` : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}

            {option.type === 'radio' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <label key={value.id} className={cn(
                      "cursor-pointer rounded-lg border px-3 py-2 transition-all duration-200 flex items-center gap-2",
                      selectedOptions[option.id] === value.id 
                        ? cn("border-transparent shadow-md transform scale-[1.02]", "bg-primary text-primary-foreground")
                        : cn("border-border hover:border-primary/50 text-muted-foreground", "hover:bg-muted/50")
                    )}>
                      <input
                        type="radio"
                        name={`option-${option.id}`}
                        className="sr-only"
                        checked={selectedOptions[option.id] === value.id}
                        onChange={() => handleOptionChange(option.id, value.id, true)}
                      />
                      <span className="font-medium text-sm">{value.name}</span>
                      {value.priceModifier > 0 && (
                        <span className={cn(
                          "text-xs font-bold px-1.5 py-0.5 rounded",
                          selectedOptions[option.id] === value.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-primary/10 text-primary'
                        )}>
                          +S/{value.priceModifier}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                
                {/* Input para opción personalizada (ej: Otro color) */}
                {(() => {
                  const selectedValueId = selectedOptions[option.id];
                  const selectedValue = option.values.find(v => v.id === selectedValueId);
                  
                  if (selectedValue?.hasInput) {
                    const limit = selectedValue.maxLength || 30;
                    return (
                      <div className="mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5 ml-1 flex justify-between">
                          <span>Especificar {option.name.toLowerCase()}:</span>
                          <span className="text-xs text-gray-400">
                            {(customInputs[option.id] || '').length}/{limit}
                          </span>
                        </label>
                        <input
                          type="text"
                          className={cn(
                            "w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400",
                            "bg-background"
                          )}
                          placeholder={selectedValue.inputPlaceholder || `Escribe tu ${option.name.toLowerCase()} aquí (máx. ${limit} caracteres)...`}
                          value={customInputs[option.id] || ''}
                          onChange={(e) => setCustomInputs(prev => ({ ...prev, [option.id]: e.target.value }))}
                          maxLength={limit}
                          autoFocus
                        />
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            {option.type === 'checkbox' && option.values.map((value) => (
              <div key={value.id} className="flex flex-col">
                <label className={cn(
                  "flex items-start space-x-3 cursor-pointer group p-2 rounded-lg transition-colors",
                  "hover:bg-muted/50"
                )}>
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      className="peer h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                      checked={selectedOptions[option.id] === value.id}
                      onChange={(e) => handleOptionChange(option.id, value.id, e.target.checked)}
                    />
                  </div>
                  <div className="flex-1 text-sm">
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {value.name}
                    </span>
                    {value.priceModifier > 0 && (
                      <span className="ml-2 text-primary font-bold">
                        + S/ {value.priceModifier.toFixed(2)}
                      </span>
                    )}
                  </div>
                </label>
                
                {selectedOptions[option.id] === value.id && value.hasInput && (
                  <div className="ml-10 mr-2 mb-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5 flex justify-between">
                      <span>Detalles:</span>
                      <span className="text-xs text-gray-400">
                        {(customInputs[option.id] || '').length}/{value.maxLength || 30}
                      </span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                      placeholder={value.inputPlaceholder || `Escribe los detalles aquí (máx. ${value.maxLength || 30} caracteres)...`}
                      value={customInputs[option.id] || ''}
                              onChange={(e) => setCustomInputs(prev => ({ ...prev, [option.id]: e.target.value }))}
                              maxLength={value.maxLength || 30}
                              autoFocus
                            />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
