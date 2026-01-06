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
import { Edit, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FinanceRecord } from '../types';

interface FinanceTableProps {
  records: FinanceRecord[];
  onEdit: (record: FinanceRecord) => void;
  onDelete: (id: string) => void;
}

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Pagado</Badge>;
      case 'pending': return <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">Pendiente</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelado</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
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
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className={`text-right font-bold ${record.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {record.type === 'expense' && '- '}{formatMoney(record.amount, record.currency)}
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
