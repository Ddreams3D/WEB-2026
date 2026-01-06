'use client';

import React from 'react';
import { Button, Dialog, DialogContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { FinanceRecord, FINANCE_CATEGORIES, PAYMENT_METHODS } from './types';
import { useFinanceForm } from './hooks/useFinanceForm';
import { FinanceModalItems } from '@/features/admin/finances/components/FinanceModalItems';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, CreditCard, Layers, PieChart, Tag, TrendingDown, TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: FinanceRecord | null;
  onSave: (record: Partial<FinanceRecord>) => void;
}

export function FinanceModal({ isOpen, onClose, record, onSave }: FinanceModalProps) {
  const { formData, updateField, addItem, updateItem, removeItem } = useFinanceForm(record);
  const [showDetails, setShowDetails] = React.useState(false);

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
    if (isIncome) return FINANCE_CATEGORIES.income;
    if (formData.expenseType) return FINANCE_CATEGORIES.expense[formData.expenseType] || [];
    return [];
  }, [formData.type, formData.expenseType]);

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
