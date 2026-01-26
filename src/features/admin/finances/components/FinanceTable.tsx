import React, { useMemo, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from '@/components/ui/input';
import { Edit, Trash2, ArrowUpRight, ArrowDownRight, Info, Link as LinkIcon, Calculator, ChevronDown, ChevronRight, Factory } from 'lucide-react';
import { FinanceRecord } from '../types';

interface FinanceTableProps {
  records: FinanceRecord[];
  onEdit: (record: FinanceRecord) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, data: Partial<FinanceRecord>) => Promise<void> | void;
}

const formatDuration = (totalMinutes: number) => {
  const minutes = Math.floor(totalMinutes);
  if (minutes <= 0) return '0 min';
  
  const days = Math.floor(minutes / (24 * 60));
  const remainingAfterDays = minutes % (24 * 60);
  const hours = Math.floor(remainingAfterDays / 60);
  const mins = Math.floor(remainingAfterDays % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins}m`);
  
  return parts.join(' ');
};

const DetailSection = ({ title, icon: Icon, children, defaultOpen = false, className = "" }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={`border border-border/50 rounded-lg bg-muted/10 overflow-hidden ${className}`}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-sm font-semibold hover:bg-muted/20 transition-colors">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          {title}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-3 pt-0 border-t border-border/50 bg-background/30">
           <div className="pt-3">
             {children}
           </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const ProfitDetailsContent = ({ record, totalIncome, onEdit }: { record: FinanceRecord, totalIncome?: number, onEdit?: (r: FinanceRecord) => void }) => {
  if (!record.productionSnapshot) return null;
  
  const { computedMaterialCost, computedEnergyCost, computedDepreciationCost, humanTimeMinutes, appliedRates, components } = record.productionSnapshot;
  
  const totalCost = computedMaterialCost + computedEnergyCost + computedDepreciationCost;
  const effectiveIncome = totalIncome || record.amount;
  const operationalProfit = effectiveIncome - totalCost; // This is profit before labor
  
  const hours = humanTimeMinutes > 0 ? humanTimeMinutes / 60 : 0;
  const realHourlyValue = hours > 0 ? operationalProfit / hours : 0;
  const targetHourly = appliedRates?.humanHourlyRate || 0;
  
  // Split Logic
  const laborCost = hours * targetHourly;
  const businessProfit = operationalProfit - laborCost;

  return (
    <div className="space-y-3">
      {onEdit && (
         <div className="mb-2">
            <DialogClose asChild>
                <Button 
                    variant="outline" 
                    className="w-full gap-2 text-primary border-primary/20 hover:bg-primary/5 h-9 text-xs"
                    onClick={() => onEdit(record)}
                >
                    <Edit className="w-3.5 h-3.5" />
                    Editar / Recalcular
                </Button>
            </DialogClose>
         </div>
      )}

      <DetailSection title="Rentabilidad y Reparto" icon={Calculator} defaultOpen={true}>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <span className="text-muted-foreground">Venta Total:</span>
            <span className="text-right font-medium">S/. {effectiveIncome.toFixed(2)}</span>
            
            <div className="col-span-2 space-y-1 py-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                <span>• Material:</span>
                <span>S/. {computedMaterialCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                <span>• Energía:</span>
                <span>S/. {computedEnergyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                <span>• Depreciación Maq:</span>
                <span>S/. {computedDepreciationCost.toFixed(2)}</span>
                </div>
            </div>

            <span className="text-muted-foreground pt-2 border-t border-border/50">Costos Operativos:</span>
            <span className="text-right font-medium text-rose-500 pt-2 border-t border-border/50">- S/. {totalCost.toFixed(2)}</span>
            
            <div className="col-span-2 h-px bg-border/50 my-1" />
            
            <span className="text-muted-foreground font-medium">Utilidad Operativa:</span>
            <span className={`text-right font-medium ${operationalProfit >= 0 ? 'text-foreground' : 'text-rose-500'}`}>
                S/. {operationalProfit.toFixed(2)}
            </span>
            </div>

            {/* The Split Section */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-3">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                    Reparto Sugerido
                </h5>
                
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">1. Tu Sueldo (Mano de Obra)</span>
                        <span className="text-[10px] text-muted-foreground">
                            {hours.toFixed(2)}h x S/. {targetHourly.toFixed(2)}/h
                        </span>
                    </div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                        S/. {laborCost.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">2. Para la Empresa (Utilidad Neta)</span>
                        <span className="text-[10px] text-muted-foreground">
                            Para reinversión, ahorros o crecimiento
                        </span>
                    </div>
                    <span className={`font-bold text-lg ${businessProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        S/. {businessProfit.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
      </DetailSection>

      <DetailSection title="Recursos Utilizados" icon={Factory}>
        <div className="space-y-3">
            {components && components.length > 0 ? (
                components.map((comp, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-border/50 last:border-0 pb-2 last:pb-0">
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground/90">
                                {comp.machineName || 'Máquina Genérica'}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                {comp.type === 'fdm' ? 'Impresión FDM' : comp.type === 'resin' ? 'Impresión Resina' : comp.type}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="font-medium">{formatDuration(comp.machineTimeMinutes)}</div>
                            <div className="text-xs text-muted-foreground">
                                {comp.materialWeightG} {comp.type === 'resin' ? 'ml' : 'g'}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-sm text-muted-foreground italic text-center py-2">
                    Detalle de máquinas no disponible
                </div>
            )}
             
             {humanTimeMinutes > 0 && (
                <div className="flex justify-between items-center text-sm border-t border-border/50 pt-2 mt-1">
                    <span className="font-medium text-muted-foreground">Mano de Obra</span>
                    <span className="font-medium">{formatDuration(humanTimeMinutes)}</span>
                </div>
             )}
        </div>
      </DetailSection>
      
      <DetailSection title="Eficiencia Humana" icon={Info}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <span className="text-muted-foreground">Tiempo Invertido:</span>
          <span className="text-right">{formatDuration(humanTimeMinutes)}</span>
          
          <span className="text-muted-foreground">Valor Real de tu Hora:</span>
          <span className={`text-right font-bold ${realHourlyValue >= targetHourly ? 'text-emerald-500' : 'text-orange-500'}`}>
            S/. {realHourlyValue.toFixed(2)}
            {realHourlyValue >= targetHourly ? ' ✨' : ' 📉'}
          </span>
          
          <span className="text-muted-foreground flex items-center gap-1">
            Tu Meta por Hora:
            <span className="text-[10px] text-muted-foreground/70">(guardada)</span>
          </span>
          <span className="text-right text-muted-foreground">S/. {targetHourly.toFixed(2)}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          * &quot;Valor Real&quot; es tu ganancia/hora actual. &quot;Meta&quot; es el valor que configuraste al crear este registro.
        </p>
      </DetailSection>
    </div>
  );
};

const ProfitBadge = ({ record, totalAmount, onEdit }: { record: FinanceRecord, totalAmount?: number, onEdit?: (r: FinanceRecord) => void }) => {
  if (record.type !== 'income' || !record.productionSnapshot) return null;

  const { computedMaterialCost, computedEnergyCost, computedDepreciationCost } = record.productionSnapshot;
  const totalCost = computedMaterialCost + computedEnergyCost + computedDepreciationCost;
  const effectiveAmount = totalAmount || record.amount;
  const netProfit = effectiveAmount - totalCost;
  const margin = effectiveAmount > 0 ? (netProfit / effectiveAmount) * 100 : 0;
  
  // Semaphore Logic
  let color = 'text-rose-600';
  let bg = 'bg-rose-50 border-rose-200';
  let icon = '💀';
  
  if (margin > 40) {
    color = 'text-emerald-600';
    bg = 'bg-emerald-50 border-emerald-200';
    icon = '🟢';
  } else if (margin >= 30) {
    color = 'text-yellow-600';
    bg = 'bg-yellow-50 border-yellow-200';
    icon = '🟡';
  } else if (margin >= 0) {
    color = 'text-orange-600';
    bg = 'bg-orange-50 border-orange-200';
    icon = '🟠';
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          title="Margen Bruto: Porcentaje del dinero que queda libre para tu sueldo y la empresa"
          className={`group relative flex items-center gap-1.5 text-[11px] font-bold ${color} ${bg} border px-2 py-0.5 rounded-full cursor-pointer mt-1 select-none hover:opacity-80 transition-opacity`}
        >
          <span>{icon}</span>
          <span>Margen {margin.toFixed(0)}%</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalle de Rentabilidad</DialogTitle>
        </DialogHeader>
        <ProfitDetailsContent record={record} totalIncome={effectiveAmount} onEdit={onEdit} />
      </DialogContent>
    </Dialog>
  );
};

export function FinanceTable({ records, onEdit, onDelete, onUpdate }: FinanceTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (record: FinanceRecord) => {
    if (!onUpdate) return;
    setEditingId(record.id);
    setEditValue(record.title);
  };

  const saveEdit = async () => {
    if (editingId && onUpdate) {
        if (editValue.trim()) {
            await onUpdate(editingId, { title: editValue });
        }
        setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const toggleGroup = (id: string) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedGroups(newSet);
  };

  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency || 'PEN',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (record: FinanceRecord) => {
    // Custom Badges based on Payment Phase
    if (record.status === 'paid' && record.paymentPhase === 'deposit') {
      return <Badge className="bg-blue-500 hover:bg-blue-600 whitespace-nowrap">Adelanto</Badge>;
    }
    
    if (record.status === 'pending' && record.paymentPhase === 'final') {
       return <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50 whitespace-nowrap">Saldo Pendiente</Badge>;
    }

    if (record.status === 'paid' && record.paymentPhase === 'final') {
      return <Badge className="bg-emerald-500 hover:bg-emerald-600 whitespace-nowrap">Saldo Cobrado</Badge>;
    }

    switch (record.status) {
      case 'paid': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Cobrado</Badge>;
      case 'pending': return <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">Pendiente</Badge>;
      case 'cancelled': return <Badge variant="destructive">Anulado</Badge>;
      default: return <Badge variant="secondary">{record.status}</Badge>;
    }
  };

  // Grouping Logic
  const groupedRecords = useMemo(() => {
    const sorted = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const processedIds = new Set<string>();
    const groups: { main: FinanceRecord; subs: FinanceRecord[] }[] = [];

    for (const record of sorted) {
      if (processedIds.has(record.id)) continue;

      // 1. Try Group ID (New Data)
      if (record.groupId) {
        const related = sorted.filter(r => r.groupId === record.groupId);
        // Add all to processed
        related.forEach(r => processedIds.add(r.id));
        
        // Determine Main (Deposit/Earliest) vs Subs
        // Usually we want the Deposit to be the "Main" anchor if we are grouping chronologically? 
        // Or visually, we want the group to appear based on the LATEST activity.
        // So we keep the current record as the "Anchor" for sorting position, but inside the group we order by logical phase.
        
        const deposit = related.find(r => r.paymentPhase === 'deposit') || related[0];
        const others = related.filter(r => r.id !== deposit.id);
        
        groups.push({ main: deposit, subs: others });
        continue;
      }

      // 2. Heuristic (Legacy Data)
      // If this is a "Saldo", try to find its parent
      if (record.title.includes('(Saldo)')) {
        const baseTitle = record.title.replace('(Saldo)', '').trim();
        // Look for a potential parent in the rest of the list (or already processed?)
        // Since we sort Descending, the "Saldo" (newer) comes FIRST.
        // So we look for the older "Deposit" down the list.
        const parent = sorted.find(r => 
          !processedIds.has(r.id) &&
          r.id !== record.id &&
          r.title.trim() === baseTitle &&
          r.paymentPhase === 'deposit'
        );

        if (parent) {
          processedIds.add(record.id);
          processedIds.add(parent.id);
          groups.push({ main: parent, subs: [record] });
          continue;
        }
      }

      // 3. Reverse Heuristic
      // If this is a "Deposit", look for a "Saldo" that might have been processed? 
      // No, processed check handles it.
      // Look for a "Saldo" that is NEWER (up the list) - but we are iterating downwards.
      // Wait, if "Saldo" is newer, we would have hit it first in loop.
      // Unless "Saldo" is older? (Unlikely).
      
      // What if we hit the "Deposit" first? (e.g. Saldo not created yet, or Saldo is older - impossible).
      // If we hit "Deposit", maybe there's a "Saldo" down the list? (Unlikely if Saldo is newer).
      
      // So mainly the check above handles "Saldo first" case.
      
      // If it's a standalone record
      processedIds.add(record.id);
      groups.push({ main: record, subs: [] });
    }
    
    return groups;
  }, [records]);

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Concepto / Cliente</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No hay registros financieros encontrados.
              </TableCell>
            </TableRow>
          ) : (
            groupedRecords.map(({ main, subs }) => (
              <React.Fragment key={main.id}>
                {/* Main Row */}
                <TableRow className={subs.length > 0 ? "bg-muted/10" : ""}>
                  <TableCell className="font-medium whitespace-nowrap align-top">
                    <div className="flex items-center gap-2">
                        {subs.length > 0 && (
                            <button 
                                onClick={() => toggleGroup(main.id)}
                                className="p-1 hover:bg-muted rounded-md transition-colors"
                            >
                                {expandedGroups.has(main.id) ? (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>
                        )}
                        {formatDate(main.date)}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex flex-col">
                      {editingId === main.id ? (
                          <Input 
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={saveEdit}
                              onKeyDown={handleKeyDown}
                              autoFocus
                              className="h-7 text-sm mb-1"
                              onClick={(e) => e.stopPropagation()}
                          />
                      ) : (
                          <span 
                              className={`font-medium ${onUpdate ? 'cursor-pointer hover:text-primary transition-colors border-b border-transparent hover:border-primary/50 w-fit' : ''}`}
                              onClick={(e) => {
                                  if (onUpdate) {
                                      e.stopPropagation();
                                      startEditing(main);
                                  }
                              }}
                              title={onUpdate ? "Click para editar descripción" : undefined}
                          >
                              {main.title}
                          </span>
                      )}
                      {main.clientName && (
                        <span className="text-xs text-muted-foreground">{main.clientName}</span>
                      )}
                      {subs.length > 0 && (
                        <div 
                            className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground cursor-pointer hover:text-primary transition-colors w-fit"
                            onClick={() => toggleGroup(main.id)}
                        >
                           <LinkIcon className="w-3 h-3" />
                           {subs.length} items relacionados
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {main.type === 'income' ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">{main.category || 'Sin categoría'}</span>
                      </div>
                      {main.expenseType && (
                        <Badge variant="outline" className="w-fit text-[10px] px-1 py-0 h-5 text-muted-foreground">
                          {main.expenseType === 'production' ? 'Producción' : 
                           main.expenseType === 'fixed' ? 'Fijo' : 'Variable'}
                        </Badge>
                      )}
                      {main.paymentPhase && (
                        <Badge variant="outline" className="w-fit text-[10px] px-1 py-0 h-5 text-muted-foreground">
                          {main.paymentPhase === 'deposit' ? 'Adelanto' : 
                           main.paymentPhase === 'final' ? 'Saldo' : 'Completo'}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">{getStatusBadge(main)}</TableCell>
                  <TableCell className={`text-right font-bold align-top ${main.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {main.type === 'expense' && '- '}{formatMoney(main.amount, main.currency)}
                    <ProfitBadge 
                      record={main} 
                      totalAmount={main.totalSaleAmount || (main.amount + subs.reduce((acc, sub) => acc + (sub.type === 'income' ? sub.amount : 0), 0))}
                      onEdit={onEdit}
                    />
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(main)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(main.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Sub Rows (Linked) */}
                {expandedGroups.has(main.id) && subs.map((sub) => (
                  <TableRow key={sub.id} className="bg-muted/5 border-l-4 border-l-primary/20">
                    <TableCell className="font-medium whitespace-nowrap pl-4 opacity-70">
                       <span className="text-xs ml-6">{formatDate(sub.date)}</span>
                    </TableCell>
                    <TableCell className="pl-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <ArrowDownRight className="w-3 h-3 text-muted-foreground" />
                            {editingId === sub.id ? (
                                <Input 
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={saveEdit}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    className="h-7 text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span 
                                    className={`font-medium text-sm ${onUpdate ? 'cursor-pointer hover:text-primary transition-colors border-b border-transparent hover:border-primary/50' : ''}`}
                                    onClick={(e) => {
                                        if (onUpdate) {
                                            e.stopPropagation();
                                            startEditing(sub);
                                        }
                                    }}
                                    title={onUpdate ? "Click para editar descripción" : undefined}
                                >
                                    {sub.title}
                                </span>
                            )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="pl-4 opacity-70">
                       <span className="text-xs">{sub.category}</span>
                    </TableCell>
                    <TableCell className="pl-4">{getStatusBadge(sub)}</TableCell>
                    <TableCell className={`text-right font-bold pl-4 ${sub.type === 'income' ? 'text-emerald-600/80' : 'text-red-600/80'}`}>
                      {sub.type === 'expense' && '- '}{formatMoney(sub.amount, sub.currency)}
                      <ProfitBadge record={sub} />
                    </TableCell>
                    <TableCell className="text-right pl-4">
                      <div className="flex justify-end gap-2 scale-90">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(sub)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(sub.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}