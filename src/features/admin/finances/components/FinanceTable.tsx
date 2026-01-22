import React from 'react';
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
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Edit, Trash2, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { FinanceRecord } from '../types';

interface FinanceTableProps {
  records: FinanceRecord[];
  onEdit: (record: FinanceRecord) => void;
  onDelete: (id: string) => void;
}

const ProfitBadge = ({ record }: { record: FinanceRecord }) => {
  if (record.type !== 'income' || !record.productionSnapshot) return null;

  const { computedMaterialCost, computedEnergyCost, computedDepreciationCost, humanTimeMinutes, appliedRates } = record.productionSnapshot;
  
  const totalCost = computedMaterialCost + computedEnergyCost + computedDepreciationCost;
  const netProfit = record.amount - totalCost;
  const margin = record.amount > 0 ? (netProfit / record.amount) * 100 : 0;
  
  const hours = humanTimeMinutes > 0 ? humanTimeMinutes / 60 : 0;
  const realHourlyValue = hours > 0 ? netProfit / hours : 0;
  const targetHourly = appliedRates.humanHourlyRate || 0;
  
  // Semaphore Logic
  let color = 'text-rose-600';
  let icon = '💀';
  
  if (margin > 40) {
    color = 'text-emerald-500';
    icon = '🟢';
  } else if (margin >= 30) {
    color = 'text-yellow-500';
    icon = '🟡';
  } else if (margin >= 0) {
    color = 'text-orange-500';
    icon = '🟠';
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${color} cursor-help mt-1 select-none`}>
            {icon} {margin.toFixed(0)}%
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-card border-border shadow-xl p-3 z-50">
          <div className="space-y-2 text-xs">
            <div className="font-bold border-b pb-1 mb-1">Rentabilidad Real</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-muted-foreground">Venta:</span>
              <span className="text-right font-medium">S/. {record.amount.toFixed(2)}</span>
              
              <span className="text-muted-foreground">Costo Prod:</span>
              <span className="text-right font-medium text-rose-500">- S/. {totalCost.toFixed(2)}</span>
              
              <span className="text-muted-foreground font-bold">Utilidad:</span>
              <span className={`text-right font-bold ${netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                S/. {netProfit.toFixed(2)}
              </span>
            </div>
            
            <div className="font-bold border-b pb-1 mb-1 mt-2">Eficiencia Humana</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-muted-foreground">Tiempo:</span>
              <span className="text-right">{humanTimeMinutes} min</span>
              
              <span className="text-muted-foreground">Valor/Hora Real:</span>
              <span className="text-right font-bold text-blue-500">S/. {realHourlyValue.toFixed(2)}</span>
              
              <span className="text-muted-foreground">Meta/Hora:</span>
              <span className="text-right text-muted-foreground">S/. {targetHourly.toFixed(2)}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function FinanceTable({ records, onEdit, onDelete }: FinanceTableProps) {
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
    // Custom Badges based on Payment Phase to avoid confusion with "Job Status"
    if (record.status === 'paid' && record.paymentPhase === 'deposit') {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Adelanto</Badge>;
    }
    
    if (record.status === 'pending' && record.paymentPhase === 'final') {
       return <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">Saldo Pendiente</Badge>;
    }

    if (record.status === 'paid' && record.paymentPhase === 'final') {
      return <Badge className="bg-emerald-500 hover:bg-emerald-600">Saldo Cobrado</Badge>;
    }

    switch (record.status) {
      case 'paid': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Cobrado</Badge>;
      case 'pending': return <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">Pendiente</Badge>;
      case 'cancelled': return <Badge variant="destructive">Anulado</Badge>;
      default: return <Badge variant="secondary">{record.status}</Badge>;
    }
  };

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
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No hay registros financieros encontrados.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {formatDate(record.date)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{record.title}</span>
                    {record.clientName && (
                      <span className="text-xs text-muted-foreground">{record.clientName}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {record.type === 'income' ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">{record.category || 'Sin categoría'}</span>
                    </div>
                    {record.expenseType && (
                      <Badge variant="outline" className="w-fit text-[10px] px-1 py-0 h-5 text-muted-foreground">
                        {record.expenseType === 'production' ? 'Producción' : 
                         record.expenseType === 'fixed' ? 'Fijo' : 'Variable'}
                      </Badge>
                    )}
                    {record.paymentPhase && (
                      <Badge variant="outline" className="w-fit text-[10px] px-1 py-0 h-5 text-muted-foreground">
                        {record.paymentPhase === 'deposit' ? 'Adelanto 50%' : 
                         record.paymentPhase === 'final' ? 'Saldo' : 'Completo'}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(record)}</TableCell>
                <TableCell className={`text-right font-bold ${record.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {record.type === 'expense' && '- '}{formatMoney(record.amount, record.currency)}
                  <ProfitBadge record={record} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(record.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
