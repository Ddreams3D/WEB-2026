import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface FinanceStatsProps {
  stats: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    pendingIncome: number;
    pendingExpense: number;
  };
}

export function FinanceStats({ stats }: FinanceStatsProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{formatMoney(stats.totalIncome)}</div>
          <p className="text-xs text-muted-foreground">
            Ventas cobradas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatMoney(stats.totalExpense)}</div>
          <p className="text-xs text-muted-foreground">
            Egresos operativos
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance Neto</CardTitle>
          <Wallet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatMoney(stats.netProfit)}
          </div>
          <p className="text-xs text-muted-foreground">
            Ingresos - Gastos
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
          <span className="h-5 w-5 rounded-full border border-yellow-500 text-[10px] flex items-center justify-center text-yellow-600 font-semibold">
            S/.
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{formatMoney(stats.pendingIncome)}</div>
          <p className="text-xs text-muted-foreground">
            Pendiente de pago
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Por Pagar</CardTitle>
          <span className="h-5 w-5 rounded-full border border-orange-500 text-[10px] flex items-center justify-center text-orange-600 font-semibold">
            S/.
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{formatMoney(stats.pendingExpense || 0)}</div>
          <p className="text-xs text-muted-foreground">
            Deuda pendiente
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
