'use client';

import React from 'react';
import { Button, Dialog, DialogContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { FinanceRecord, FINANCE_CATEGORIES, PAYMENT_METHODS } from './types';
import { useFinanceForm } from './hooks/useFinanceForm';
import { FinanceModalItems } from '@/features/admin/finances/components/FinanceModalItems';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, CreditCard, Layers, PieChart, Tag, TrendingDown, TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES_STORAGE_KEY = 'finance_categories_config_v1';
const RESERVED_EXPENSE_CATEGORY = 'Retiros del dueño / Finanzas personales';
const RESERVED_INCOME_CATEGORY = 'Ingreso desde Ddreams 3D';

type CategoriesConfig = typeof FINANCE_CATEGORIES;

const ensureReservedCategories = (config: CategoriesConfig): CategoriesConfig => {
  const incomeSet = new Set(config.income);
  incomeSet.add(RESERVED_INCOME_CATEGORY);

  const production = Array.isArray(config.expense.production) ? config.expense.production : [];
  const fixed = Array.isArray(config.expense.fixed) ? config.expense.fixed : [];
  const variable = Array.isArray(config.expense.variable) ? config.expense.variable : [];

  const fixedSet = new Set(fixed);
  fixedSet.add(RESERVED_EXPENSE_CATEGORY);

  return {
    income: Array.from(incomeSet),
    expense: {
      production: [...production],
      fixed: Array.from(fixedSet),
      variable: [...variable],
    },
  };
};

const mergeCategoriesWithDefaults = (stored: any): CategoriesConfig => {
  const base = ensureReservedCategories(FINANCE_CATEGORIES);

  if (!stored || typeof stored !== 'object') {
    return base;
  }

  const storedIncome = Array.isArray(stored.income) ? stored.income : base.income;
  const storedExpense = stored.expense && typeof stored.expense === 'object' ? stored.expense : {};

  const production = Array.isArray(storedExpense.production)
    ? storedExpense.production
    : base.expense.production;

  const fixed = Array.isArray(storedExpense.fixed)
    ? storedExpense.fixed
    : base.expense.fixed;

  const variable = Array.isArray(storedExpense.variable)
    ? storedExpense.variable
    : base.expense.variable;

  return ensureReservedCategories({
    income: storedIncome,
    expense: {
      production,
      fixed,
      variable,
    },
  });
};

const isReservedCategory = (name: string | undefined) => {
  if (!name) return false;
  return name === RESERVED_EXPENSE_CATEGORY || name === RESERVED_INCOME_CATEGORY;
};

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: Partial<FinanceRecord> | null;
  onSave: (record: Partial<FinanceRecord>) => void;
}

export function FinanceModal({ isOpen, onClose, record, onSave }: FinanceModalProps) {
  const { formData, updateField, addItem, updateItem, removeItem } = useFinanceForm(record);
  const [showDetails, setShowDetails] = React.useState(false);
  const [categoriesConfig, setCategoriesConfig] = React.useState<CategoriesConfig>(
    ensureReservedCategories(FINANCE_CATEGORIES),
  );
  const [newCategoryName, setNewCategoryName] = React.useState('');

  React.useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = mergeCategoriesWithDefaults(parsed);
        setCategoriesConfig(merged);
      } else {
        const initial = ensureReservedCategories(FINANCE_CATEGORIES);
        setCategoriesConfig(initial);
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initial));
      }
    } catch {
      const fallback = ensureReservedCategories(FINANCE_CATEGORIES);
      setCategoriesConfig(fallback);
    }
  }, []);

  const saveCategories = (next: CategoriesConfig) => {
    setCategoriesConfig(next);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.amount) {
      alert('Por favor complete al menos el título y el monto.');
      return;
    }
    // Validation for new fields
    if (formData.type === 'expense' && !formData.expenseType) {
      alert('Por favor seleccione el tipo de gasto (Fijo, Variable o Producción).');
      return;
    }
    
    // Default payment phase for income if not set
    const finalData = {
      ...formData,
      paymentPhase: formData.type === 'income' ? (formData.paymentPhase || 'full') : undefined,
      expenseType: formData.type === 'expense' ? formData.expenseType : undefined
    };

    onSave(finalData);
    onClose();
  };

  const isIncome = formData.type === 'income';

  // Calculate available categories based on type and expenseType
  const categories = React.useMemo(() => {
    if (isIncome) {
      return categoriesConfig.income;
    }
    if (formData.expenseType) {
      const list = categoriesConfig.expense[formData.expenseType];
      return list || [];
    }
    return [];
  }, [isIncome, formData.expenseType, categoriesConfig]);

  const handleAddCategory = () => {
    const value = newCategoryName.trim();
    if (!value) {
      return;
    }

    if (isIncome) {
      if (categoriesConfig.income.includes(value)) {
        return;
      }
      const next = ensureReservedCategories({
        income: [...categoriesConfig.income, value],
        expense: categoriesConfig.expense,
      });
      saveCategories(next);
      setNewCategoryName('');
      updateField('category', value);
      return;
    }

    if (!formData.expenseType) {
      alert('Por favor selecciona el tipo de gasto antes de añadir una categoría.');
      return;
    }

    const currentList = categoriesConfig.expense[formData.expenseType] || [];
    if (currentList.includes(value)) {
      return;
    }

    const nextExpense = {
      ...categoriesConfig.expense,
      [formData.expenseType]: [...currentList, value],
    };

    const next = ensureReservedCategories({
      income: categoriesConfig.income,
      expense: nextExpense,
    });

    saveCategories(next);
    setNewCategoryName('');
    updateField('category', value);
  };

  const handleRemoveSelectedCategory = () => {
    const selected = formData.category;
    if (!selected || isReservedCategory(selected)) {
      return;
    }

    if (isIncome) {
      const nextIncome = categoriesConfig.income.filter((c) => c !== selected);
      const next = ensureReservedCategories({
        income: nextIncome,
        expense: categoriesConfig.expense,
      });
      saveCategories(next);
      updateField('category', '');
      return;
    }

    if (!formData.expenseType) {
      return;
    }

    const currentList = categoriesConfig.expense[formData.expenseType] || [];
    const nextList = currentList.filter((c) => c !== selected);

    const nextExpense = {
      ...categoriesConfig.expense,
      [formData.expenseType]: nextList,
    };

    const next = ensureReservedCategories({
      income: categoriesConfig.income,
      expense: nextExpense,
    });

    saveCategories(next);
    updateField('category', '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0 bg-card border-none shadow-2xl">
        {/* Header Background */}
        <div className={cn(
          "h-2 w-full",
          isIncome ? "bg-emerald-500" : "bg-rose-500"
        )} />
        
        <div className="p-6 space-y-8 max-h-[90vh] overflow-y-auto">
          {/* Header & Title Section */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-muted-foreground">
                {record ? 'Editar Transacción' : 'Nueva Transacción'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Main Input Area - Hero Style */}
          <div className="space-y-6">
            <div className="relative group">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block pl-1">
                Concepto / Título
              </label>
              <input 
                type="text"
                placeholder="Ej. Pago de servicio..."
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-border focus:border-primary focus:outline-none py-2 px-1 placeholder:text-muted-foreground/30 transition-colors"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                autoFocus={!record}
              />
            </div>

            <div className="flex gap-4">
              {/* Type Selector */}
              <div className="flex-1 grid grid-cols-2 gap-2 bg-muted/30 p-1 rounded-xl">
                <button
                  onClick={() => updateField('type', 'income')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                    formData.type === 'income' 
                      ? "bg-emerald-500 text-white shadow-sm" 
                      : "text-muted-foreground hover:bg-background/50"
                  )}
                >
                  <TrendingUp className="w-4 h-4" /> Ingreso
                </button>
                <button
                  onClick={() => updateField('type', 'expense')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                    formData.type === 'expense' 
                      ? "bg-rose-500 text-white shadow-sm" 
                      : "text-muted-foreground hover:bg-background/50"
                  )}
                >
                  <TrendingDown className="w-4 h-4" /> Gasto
                </button>
              </div>

              {/* Amount Input */}
              <div className="flex-1 relative">
                 <div className="absolute top-2 left-3 text-muted-foreground font-medium">
                    {formData.currency === 'PEN' ? 'S/.' : '$'}
                 </div>
                 <input 
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full h-full bg-muted/30 rounded-xl text-right pr-4 pl-10 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.amount}
                    onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)}
                 />
              </div>
            </div>
          </div>

          {/* Context Grid */}
          <div className="grid grid-cols-2 gap-4">
             {/* Dynamic Field: Payment Phase (Income) or Expense Type (Expense) */}
             {isIncome ? (
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                     <Layers className="w-3 h-3" /> Fase de Cobro
                  </label>
                  <Select 
                    value={formData.paymentPhase || 'full'} 
                    onValueChange={(val) => updateField('paymentPhase', val)}
                  >
                    <SelectTrigger className="w-full rounded-xl bg-muted/30 border-transparent h-[42px]">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Adelanto (50%)</SelectItem>
                      <SelectItem value="final">Cancelación (Saldo)</SelectItem>
                      <SelectItem value="full">Pago Completo</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
             ) : (
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                     <PieChart className="w-3 h-3" /> Tipo de Gasto
                  </label>
                  <Select 
                    value={formData.expenseType} 
                    onValueChange={(val) => {
                      updateField('expenseType', val);
                      updateField('category', ''); // Reset category when type changes
                    }}
                  >
                    <SelectTrigger className="w-full rounded-xl bg-muted/30 border-transparent h-[42px]">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Producción</SelectItem>
                      <SelectItem value="fixed">Fijo</SelectItem>
                      <SelectItem value="variable">Variable</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
             )}

             <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                   <Tag className="w-3 h-3" /> Categoría
                </label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => updateField('category', val)}
                >
                  <SelectTrigger 
                    className="w-full rounded-xl bg-muted/30 border-transparent h-[42px]"
                    disabled={!isIncome && !formData.expenseType}
                  >
                    <SelectValue placeholder={!isIncome && !formData.expenseType ? "Seleccione tipo primero" : "Seleccionar..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nueva categoría"
                    className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-xs"
                    disabled={!isIncome && !formData.expenseType}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddCategory}
                    className="text-xs"
                    disabled={!isIncome && !formData.expenseType}
                  >
                    Añadir
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoveSelectedCategory}
                    disabled={!formData.category || isReservedCategory(formData.category)}
                    className="text-[11px] text-destructive"
                  >
                    Quitar seleccionada
                  </Button>
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                   <Calendar className="w-3 h-3" /> Fecha
                </label>
                <input 
                  type="date" 
                  className="w-full p-2.5 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 text-sm font-medium transition-all outline-none"
                  value={formData.date?.split('T')[0]}
                  onChange={(e) => updateField('date', e.target.value)}
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                   <CreditCard className="w-3 h-3" /> Medio de Pago
                </label>
                <Select value={formData.paymentMethod} onValueChange={(val) => updateField('paymentMethod', val)}>
                  <SelectTrigger className="w-full rounded-xl bg-muted/30 border-transparent h-[42px]">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>

             <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3" /> Estado
                </label>
                <Select value={formData.status} onValueChange={(val) => updateField('status', val)}>
                  <SelectTrigger className="w-full rounded-xl bg-muted/30 border-transparent h-[42px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Pagado / Completado</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="cancelled">Anulado</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>

          {/* Toggle Details */}
          <div className="pt-2">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showDetails ? 'Ocultar detalles avanzados (Items, Cliente)' : 'Agregar items o detalles de cliente'}
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-xs font-medium text-muted-foreground">Cliente / Razón Social</label>
                           <input 
                              className="w-full p-2.5 rounded-xl bg-muted/30 border-transparent text-sm outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Opcional"
                              value={formData.clientName || ''}
                              onChange={(e) => updateField('clientName', e.target.value)}
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-medium text-muted-foreground">Contacto / Notas</label>
                           <input 
                              className="w-full p-2.5 rounded-xl bg-muted/30 border-transparent text-sm outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Opcional"
                              value={formData.notes || ''}
                              onChange={(e) => updateField('notes', e.target.value)}
                           />
                        </div>
                     </div>
                     
                     <div className="bg-muted/10 rounded-xl p-4 border border-border/50">
                        <FinanceModalItems 
                          items={formData.items || []} 
                          currency={formData.currency || 'PEN'}
                          onAddItem={addItem}
                          onUpdateItem={updateItem}
                          onRemoveItem={removeItem}
                          totalAmount={formData.amount || 0}
                        />
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} className={cn(
              isIncome ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
            )}>
              {record ? 'Guardar Cambios' : 'Registrar Transacción'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
