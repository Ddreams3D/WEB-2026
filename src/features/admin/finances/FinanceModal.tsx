'use client';

import React from 'react';
import { Button, Dialog, DialogContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { FinanceRecord, FINANCE_CATEGORIES, PAYMENT_METHODS, ProductionType, ProductionSnapshot, FinanceSettings } from './types';
import { useFinanceForm } from './hooks/useFinanceForm';
// import { useFinanceSettings } from './hooks/useFinanceSettings';
import { FinanceModalItems } from '@/features/admin/finances/components/FinanceModalItems';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, CreditCard, Layers, PieChart, Tag, TrendingDown, TrendingUp, Factory, Calculator, Plus, Trash2, Info } from 'lucide-react';
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

const STATUS_LABELS: Record<string, string> = {
  paid: 'Cobrado / Pagado',
  pending: 'Por Cobrar / Pendiente',
  cancelled: 'Anulado',
};

export interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: Partial<FinanceRecord> | null;
  onSave: (record: Partial<FinanceRecord>) => void;
  settings?: FinanceSettings;
}

interface TimeInputProps {
  totalMinutes: number;
  onChange: (val: number) => void;
  label?: string;
  className?: string;
}

const TimeInput = ({ totalMinutes, onChange, label, className }: TimeInputProps) => {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = Math.round(totalMinutes % 60);

  const handleChange = (d: number, h: number, m: number) => {
    // Prevent negative values
    const validD = Math.max(0, d);
    const validH = Math.max(0, h);
    const validM = Math.max(0, m);
    
    const total = (validD * 24 * 60) + (validH * 60) + validM;
    onChange(total);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-[10px] font-medium text-muted-foreground uppercase">{label}</label>}
      <div className="flex items-start gap-1">
        <div className="flex flex-col items-center gap-0.5 min-w-0 flex-1">
           <input 
             type="number" 
             min="0"
             className="w-full p-1.5 rounded-md bg-background border border-input text-xs h-8 text-center px-0 font-mono"
             value={days === 0 ? '' : days}
             placeholder="0"
             onChange={e => handleChange(parseInt(e.target.value) || 0, hours, minutes)}
           />
           <span className="text-[9px] text-muted-foreground font-medium">días</span>
        </div>
        <span className="py-1.5 text-muted-foreground font-bold">:</span>
        <div className="flex flex-col items-center gap-0.5 min-w-0 flex-1">
           <input 
             type="number" 
             min="0"
             className="w-full p-1.5 rounded-md bg-background border border-input text-xs h-8 text-center px-0 font-mono"
             value={hours === 0 ? '' : hours}
             placeholder="0"
             onChange={e => handleChange(days, parseInt(e.target.value) || 0, minutes)}
           />
           <span className="text-[9px] text-muted-foreground font-medium">hrs</span>
        </div>
        <span className="py-1.5 text-muted-foreground font-bold">:</span>
        <div className="flex flex-col items-center gap-0.5 min-w-0 flex-1">
           <input 
             type="number" 
             min="0"
             className="w-full p-1.5 rounded-md bg-background border border-input text-xs h-8 text-center px-0 font-mono"
             value={minutes === 0 ? '' : minutes}
             placeholder="0"
             onChange={e => handleChange(days, hours, parseInt(e.target.value) || 0)}
           />
           <span className="text-[9px] text-muted-foreground font-medium">min</span>
        </div>
      </div>
    </div>
  );
};

export function FinanceModal({ isOpen, onClose, record, onSave, settings }: FinanceModalProps) {
  const { formData, updateField, addItem, updateItem, removeItem } = useFinanceForm(record);
  // const { settings } = useFinanceSettings();
  const [showDetails, setShowDetails] = React.useState(false);
  
  // Production Snapshot State
  const [showProduction, setShowProduction] = React.useState(false);
  const [humanTimeMinutes, setHumanTimeMinutes] = React.useState(0);
  const [productionComponents, setProductionComponents] = React.useState<Array<{
    id: string;
    type: ProductionType;
    machineId: string;
    machineTimeMinutes: number;
    materialWeightG: number;
  }>>([]);

  const [categoriesConfig, setCategoriesConfig] = React.useState<CategoriesConfig>(
    ensureReservedCategories(FINANCE_CATEGORIES),
  );
  const [newCategoryName, setNewCategoryName] = React.useState('');

  const [createPendingBalance, setCreatePendingBalance] = React.useState(false);
  const [pendingAmount, setPendingAmount] = React.useState('');

  // Reset pending amount when main amount changes (optional convenience, defaulting to same amount for 50% case)
  React.useEffect(() => {
    if (createPendingBalance && !pendingAmount && formData.amount) {
      setPendingAmount(formData.amount.toString());
    }
  }, [formData.amount, createPendingBalance, pendingAmount]);

  // Force refresh settings on open if empty machines
  // This is a safety check if props are stale
  const [localMachines, setLocalMachines] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (isOpen) {
       // Start with prop settings
       let machines = settings?.machines || [];
       
       // If empty, try to load from localStorage as fallback
       if (machines.length === 0 && typeof window !== 'undefined') {
          try {
             const stored = localStorage.getItem('finance_global_settings_v1');
             if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.machines && Array.isArray(parsed.machines)) {
                   machines = parsed.machines;
                }
             }
          } catch (e) {
             console.error("Error reading local settings fallback", e);
          }
       }
       setLocalMachines(machines);
    }
  }, [isOpen, settings]);

  // Reset production form when modal opens/closes or record changes
  React.useEffect(() => {
    if (!isOpen) return;

    if (record?.productionSnapshot) {
      if (record.productionSnapshot.components && record.productionSnapshot.components.length > 0) {
        setProductionComponents(record.productionSnapshot.components.map(c => ({
          id: c.id,
          type: c.type,
          machineId: c.machineId || '',
          machineTimeMinutes: c.machineTimeMinutes,
          materialWeightG: c.materialWeightG
        })));
      } else {
        // Legacy single component migration
        setProductionComponents([{
          id: 'legacy',
          type: (record.productionSnapshot.type as ProductionType) || 'fdm',
          machineId: record.productionSnapshot.machineId || '',
          machineTimeMinutes: record.productionSnapshot.machineTimeMinutes || 0,
          materialWeightG: record.productionSnapshot.materialWeightG || 0
        }]);
      }
      setHumanTimeMinutes(record.productionSnapshot.humanTimeMinutes || 0);
      setShowProduction(true);
    } else {
      setProductionComponents([{
        id: Math.random().toString(36).substr(2, 9),
        type: 'fdm',
        machineId: '',
        machineTimeMinutes: 0,
        materialWeightG: 0
      }]);
      setHumanTimeMinutes(0);
      setShowProduction(false);
    }
  }, [record?.id, isOpen]);

  // Calculate Snapshot Live
  const calculatedSnapshot = React.useMemo((): ProductionSnapshot | undefined => {
    if (!showProduction || productionComponents.length === 0) return undefined;
    
    // Safe settings fallback
    const safeSettings = settings || {
      electricityPrice: 0,
      machineDepreciationRate: 0,
      machineDepreciationRateFdm: 0,
      machineDepreciationRateResin: 0,
      materialCostResin: 0,
      materialCostFdm: 0,
      humanHourlyRate: 0,
      machines: []
    } as unknown as FinanceSettings;

    let totalEnergy = 0;
    let totalDepreciation = 0;
    let totalMaterialCost = 0;
    let totalMachineTime = 0;
    let totalMaterialWeight = 0;

    // Helper for safe precision
    const safeFloat = (num: number) => Math.round((num + Number.EPSILON) * 10000) / 10000;

    const computedComponents = productionComponents.map(comp => {
      const hours = comp.machineTimeMinutes / 60;
      const powerKw = comp.type === 'resin' ? 0.1 : 0.2; 
      const energy = safeFloat((powerKw * safeSettings.electricityPrice) * hours); 
      
      // Select specific depreciation rate based on machine or type fallback
      let hourlyDepreciation = 0;
      let selectedMachineName = undefined;

      if (comp.machineId) {
        const machine = localMachines.find(m => m.id === comp.machineId);
        if (machine) {
          hourlyDepreciation = machine.hourlyRate;
          selectedMachineName = machine.name;
        }
      }

      // Fallback if no machine selected or not found
      if (hourlyDepreciation === 0) {
        // Calculate average rate for the type from available machines
        const typeMachines = safeSettings.machines.filter(m => m.type === comp.type);
        if (typeMachines.length > 0) {
            const avgRate = typeMachines.reduce((acc, m) => acc + m.hourlyRate, 0) / typeMachines.length;
            hourlyDepreciation = avgRate;
        } else {
            hourlyDepreciation = 0;
        }
      }
        
      const depreciation = safeFloat(hourlyDepreciation * hours);

      const materialUnitCost = comp.type === 'resin' ? safeSettings.resinCostPerKg : safeSettings.filamentCostPerKg;
      const material = safeFloat((comp.materialWeightG / 1000) * materialUnitCost);
      
      totalEnergy += energy;
      totalDepreciation += depreciation;
      totalMaterialCost += material;
      totalMachineTime += comp.machineTimeMinutes;
      totalMaterialWeight += comp.materialWeightG;

      return {
        id: comp.id,
        type: comp.type,
        machineId: comp.machineId,
        machineName: selectedMachineName,
        machineTimeMinutes: comp.machineTimeMinutes,
        materialWeightG: comp.materialWeightG,
        computedEnergyCost: energy,
        computedDepreciationCost: depreciation,
        computedMaterialCost: material,
        appliedRates: {
          electricityPrice: safeSettings.electricityPrice,
          machineDepreciationRate: hourlyDepreciation,
          materialCostPerUnit: materialUnitCost,
        }
      };
    });
    
    const labor = safeFloat((humanTimeMinutes / 60) * safeSettings.humanHourlyRate);

    return {
      type: computedComponents.length > 1 ? 'mixed' : computedComponents[0].type,
      machineTimeMinutes: totalMachineTime,
      humanTimeMinutes: humanTimeMinutes,
      materialWeightG: totalMaterialWeight,
      computedEnergyCost: safeFloat(totalEnergy),
      computedDepreciationCost: safeFloat(totalDepreciation),
      computedMaterialCost: safeFloat(totalMaterialCost),
      computedLaborCost: labor,
      appliedRates: {
        electricityPrice: safeSettings.electricityPrice,
        machineDepreciationRate: 0, // Mixed/Aggregate
        materialCostPerUnit: 0, // Mixed/Aggregate
        humanHourlyRate: safeSettings.humanHourlyRate
      },
      machineId: computedComponents.length === 1 ? computedComponents[0].machineId : undefined,
      machineName: computedComponents.length === 1 ? computedComponents[0].machineName : 'Múltiples',
      components: computedComponents
    };
  }, [productionComponents, humanTimeMinutes, settings, showProduction, localMachines]);

  const totalProductionCost = calculatedSnapshot 
    ? (calculatedSnapshot.computedEnergyCost + calculatedSnapshot.computedDepreciationCost + calculatedSnapshot.computedMaterialCost)
    : 0;

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

    // Strict Production Validation
    if (showProduction && calculatedSnapshot) {
      if (calculatedSnapshot.components) {
        for (const comp of calculatedSnapshot.components) {
          const isMachineRequired = comp.type === 'fdm' || comp.type === 'resin';
          const machinesForType = localMachines.filter(m => m.type === comp.type) || [];
          
          if (isMachineRequired && machinesForType.length > 0 && !comp.machineId) {
            alert(`Por favor seleccione una máquina válida para la tecnología ${comp.type === 'fdm' ? 'FDM' : 'Resina'}.`);
            return;
          }
          
          if (comp.machineTimeMinutes <= 0 || isNaN(comp.machineTimeMinutes)) {
             alert('El tiempo de máquina no puede ser 0 o vacío.');
             return;
          }
        }
      }
    }
    
    // Base data
    const finalData = {
      ...formData,
      totalSaleAmount: record?.totalSaleAmount, // Preserve total sale amount context
      paymentPhase: formData.type === 'income' ? (formData.paymentPhase || 'full') : undefined,
      expenseType: formData.type === 'expense' ? formData.expenseType : undefined,
      productionSnapshot: (showProduction && calculatedSnapshot) ? calculatedSnapshot : undefined
    };

    // If Split Payment (Deposit + Pending Balance)
     if (isIncome && formData.paymentPhase === 'deposit' && createPendingBalance) {
         // Validation
         const pAmount = parseFloat(pendingAmount);
         if (!pAmount || pAmount <= 0) {
           alert('Por favor ingrese el monto restante (Saldo) válido.');
           return;
         }

         // Generate a common Group ID for these linked transactions
         const groupId = crypto.randomUUID();

         // 1. Save Deposit (Paid)
         onSave({ ...finalData, groupId });
         
         // 2. Save Pending Balance
         // We need a small delay or just call onSave again with modified data.
         // Since onSave might close the modal or refresh data, we should check if we can call it twice.
         // Assuming onSave handles adding to list.
         setTimeout(() => {
             const pendingData = {
                ...finalData,
                title: `${finalData.title} (Saldo)`,
                amount: pAmount, // Use the explicit pending amount
                status: 'pending' as const,
                paymentPhase: 'final' as const,
                // Production cost is already assigned to the deposit (first record)
                // We prevent double counting by removing it from the balance record
                productionSnapshot: undefined, 
                // We also remove items detailed list if it causes confusion, 
                // but usually items are needed for invoice. 
                // For cost analysis, snapshot is the key.
                groupId, // Link to the deposit
             };
             onSave(pendingData);
        }, 100);
        
        onClose();
        return;
    }

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
      <DialogContent className="max-w-3xl p-0 gap-0 bg-card border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className={cn(
          "h-2 w-full",
          isIncome ? "bg-emerald-500" : "bg-rose-500"
        )} />
        
        <div className="p-5 sm:p-6 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground break-words">
                {record ? 'Editar transacción' : 'Nueva transacción'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Completa los datos principales y luego los detalles opcionales.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide",
                isIncome ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
              )}>
                {isIncome ? 'Ingreso' : 'Gasto'}
              </span>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 bg-muted/30 rounded-2xl p-4 sm:p-5">
            <div className="relative group">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block pl-1">
                Concepto / Título
              </label>
              <div className="flex items-start gap-3 rounded-2xl bg-background/80 border border-border/60 px-3.5 py-3 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <div className="mt-1 text-muted-foreground">
                  <Tag className="w-4 h-4" />
                </div>
                <textarea
                  rows={2}
                  placeholder="Ej. Pago de servicio de hosting para cliente..."
                  className="w-full bg-transparent text-base sm:text-lg font-medium leading-relaxed resize-none outline-none placeholder:text-muted-foreground/50 break-words"
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  autoFocus={!record}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 grid grid-cols-2 gap-2 bg-background/60 p-1.5 rounded-xl border border-border/60">
                <button
                  onClick={() => updateField('type', 'income')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all",
                    formData.type === 'income' 
                      ? "bg-emerald-500 text-white shadow-sm" 
                      : "text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  <TrendingUp className="w-4 h-4" /> Ingreso
                </button>
                <button
                  onClick={() => updateField('type', 'expense')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all",
                    formData.type === 'expense' 
                      ? "bg-rose-500 text-white shadow-sm" 
                      : "text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  <TrendingDown className="w-4 h-4" /> Gasto
                </button>
              </div>

              <div className="flex-1 relative">
                 <div className="absolute top-2 left-3 text-muted-foreground font-medium text-sm">
                    {formData.currency === 'PEN' ? 'S/.' : '$'}
                 </div>
                 <input 
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full h-[52px] bg-background/60 rounded-xl text-right pr-4 pl-12 text-xl sm:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.amount}
                    onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)}
                 />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                    <SelectItem value="deposit">Adelanto / Pago Parcial</SelectItem>
                    <SelectItem value="final">Cancelación (Saldo)</SelectItem>
                    <SelectItem value="full">Pago Completo</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Auto-create pending balance option */}
                {formData.paymentPhase === 'deposit' && (
                  <div className="flex flex-col gap-2 pt-2 px-1 bg-muted/20 rounded-lg p-2 border border-dashed border-primary/20">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="createPendingBalance"
                        checked={createPendingBalance}
                        onChange={(e) => setCreatePendingBalance(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="createPendingBalance" className="text-xs text-muted-foreground cursor-pointer leading-tight">
                        Crear registro automático del <strong>Saldo Pendiente</strong>
                      </label>
                    </div>

                    {createPendingBalance && (
                      <div className="pl-6 space-y-1.5 animation-in slide-in-from-top-2 fade-in duration-200">
                        <label className="text-[10px] font-medium text-primary uppercase tracking-wider flex items-center gap-1">
                           Monto Restante (Por Cobrar)
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium">S/.</span>
                          <input
                            type="number"
                            value={pendingAmount}
                            onChange={(e) => setPendingAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-primary/20 bg-background text-sm font-bold text-primary focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            autoFocus
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Total del Trabajo: S/. {((parseFloat((formData.amount || 0).toString()) || 0) + (parseFloat(pendingAmount) || 0)).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
                <Tag className="w-3 h-3" /> Categoría
              </label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => updateField('category', val)}
              >
                <SelectTrigger 
                  className="w-full rounded-xl bg-muted/30 border-transparent h-[42px] text-xs sm:text-sm"
                  disabled={!isIncome && !formData.expenseType}
                >
                  <SelectValue placeholder={!isIncome && !formData.expenseType ? "Seleccione tipo primero" : "Seleccionar..."} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="whitespace-normal break-words text-xs sm:text-sm">
                      {cat}
                    </SelectItem>
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

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Estado
              </label>
              <Select value={formData.status} onValueChange={(val) => updateField('status', val)}>
                <SelectTrigger className="w-full rounded-xl bg-muted/30 border-transparent h-[42px] text-xs sm:text-sm">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Cobrado / Pagado</SelectItem>
                  <SelectItem value="pending">Por Cobrar / Pendiente</SelectItem>
                  <SelectItem value="cancelled">Anulado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggle Details */}
          <div className="pt-2 space-y-4">
            {/* Production Snapshot Section (Only for Income) */}
            {isIncome && (
              <div className="bg-muted/20 rounded-xl border border-border/50 overflow-hidden">
                <button 
                  onClick={() => setShowProduction(!showProduction)}
                  className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <Factory className="w-4 h-4" />
                    Calculadora de Producción (Snapshot)
                  </div>
                  {showProduction ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {showProduction && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-4 border-t border-border/50 mt-2">
                        <div className="space-y-4">
                          {productionComponents.map((comp, index) => {
                            // Use localMachines fallback which is more robust
                            const availableMachines = localMachines.filter((m: any) => m.type === comp.type) || [];
                            const showMachineSelect = comp.type === 'fdm' || comp.type === 'resin';

                            return (
                              <div key={comp.id} className="grid grid-cols-12 gap-3 items-start bg-background/50 p-3 rounded-lg border border-border/50 relative group">
                                <div className="col-span-12 sm:col-span-2 space-y-1.5">
                                  <label className="text-[10px] font-medium text-muted-foreground uppercase">Tecnología</label>
                                  <Select 
                                    value={comp.type} 
                                    onValueChange={(val) => {
                                      setProductionComponents(prev => prev.map(c => c.id === comp.id ? { ...c, type: val as ProductionType, machineId: '' } : c));
                                    }}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      {comp.type === 'fdm' ? 'Impresión FDM' : 
                                       comp.type === 'resin' ? 'Impresión Resina' : 
                                       comp.type === 'cnc' ? 'CNC / Laser' : 
                                       comp.type === 'other' ? 'Otro' : comp.type}
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="fdm">Impresión FDM</SelectItem>
                                      <SelectItem value="resin">Impresión Resina</SelectItem>
                                      <SelectItem value="cnc">CNC / Laser</SelectItem>
                                      <SelectItem value="other">Otro</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="col-span-12 sm:col-span-4 space-y-1.5">
                                  <label className="text-[10px] font-medium text-muted-foreground uppercase">
                                    {showMachineSelect ? 'Máquina (Requerido)' : 'Máquina / Detalle'}
                                  </label>
                                  {showMachineSelect ? (
                                     availableMachines.length > 0 ? (
                                      <Select
                                        value={comp.machineId}
                                        onValueChange={(val) => {
                                          setProductionComponents(prev => prev.map(c => c.id === comp.id ? { ...c, machineId: val } : c));
                                        }}
                                      >
                                        <SelectTrigger className={cn("h-8 text-xs", !comp.machineId && "border-rose-300 ring-1 ring-rose-200")}>
                                          {availableMachines.find((m: any) => m.id === comp.machineId)?.name || "Seleccionar..."}
                                        </SelectTrigger>
                                        <SelectContent>
                                          {availableMachines.map((m: any) => (
                                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                     ) : (
                                       <div className="text-xs text-muted-foreground h-8 flex items-center px-2 bg-muted/50 rounded border border-border">
                                         Sin máquinas config. (Genérico)
                                       </div>
                                     )
                                  ) : (
                                    <div className="text-xs text-muted-foreground h-8 flex items-center px-2 bg-muted/50 rounded border border-border">
                                      N/A
                                    </div>
                                  )}
                                </div>

                                <div className="col-span-6 sm:col-span-2 space-y-1.5">
                                  <label className="text-[10px] font-medium text-muted-foreground uppercase">Mat. ({comp.type === 'resin' ? 'ml' : 'g'})</label>
                                  <input 
                                    type="number" 
                                    min="0"
                                    className="w-full p-1.5 rounded-md bg-background border border-input text-xs h-8"
                                    value={comp.materialWeightG || ''}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      setProductionComponents(prev => prev.map(c => c.id === comp.id ? { ...c, materialWeightG: val } : c));
                                    }}
                                  />
                                </div>

                                <div className="col-span-6 sm:col-span-3 space-y-1.5">
                                  <TimeInput 
                                    label="Tiempo de Máquina"
                                    totalMinutes={comp.machineTimeMinutes}
                                    onChange={(val) => setProductionComponents(prev => prev.map(c => c.id === comp.id ? { ...c, machineTimeMinutes: val } : c))}
                                  />
                                </div>

                                <div className="col-span-12 sm:col-span-1 flex justify-end sm:justify-center pt-6">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                      if (productionComponents.length > 1) {
                                        setProductionComponents(prev => prev.filter(c => c.id !== comp.id));
                                      }
                                    }}
                                    disabled={productionComponents.length === 1}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}

                          <div className="flex items-center justify-between pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setProductionComponents(prev => [...prev, {
                                id: Math.random().toString(36).substr(2, 9),
                                type: 'fdm',
                                machineId: '',
                                machineTimeMinutes: 0,
                                materialWeightG: 0
                              }])}
                              className="text-xs h-8 gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Agregar otra máquina/paso
                            </Button>

                            <div className="flex items-start gap-3 bg-muted/30 p-2 rounded-lg border border-border/50">
                               <TimeInput 
                                  label="Tiempo Humano Total"
                                  totalMinutes={humanTimeMinutes}
                                  onChange={(val) => setHumanTimeMinutes(val)}
                                  className="min-w-[180px]"
                               />
                            </div>
                          </div>
                        </div>

                        {calculatedSnapshot && (
                          <div className="bg-background/50 rounded-lg p-3 text-xs space-y-2 border border-border/50">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Costo Material Total:</span>
                              <span>S/. {calculatedSnapshot.computedMaterialCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Energía + Depreciación Total:</span>
                              <span>S/. {(calculatedSnapshot.computedEnergyCost + calculatedSnapshot.computedDepreciationCost).toFixed(2)}</span>
                            </div>
                            {calculatedSnapshot.components && calculatedSnapshot.components.length > 0 && (
                               <div className="text-[10px] text-muted-foreground/70 text-right -mt-1.5 mb-1">
                                 {calculatedSnapshot.components.map(c => c.machineName).filter(Boolean).join(' + ')}
                               </div>
                            )}
                            <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-rose-500">
                              <span>Costo Total Producción:</span>
                              <span>S/. {totalProductionCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-emerald-600 pt-1">
                              <span>Utilidad Estimada:</span>
                              <span>S/. {((formData.amount || 0) - totalProductionCost).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

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
