import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Wallet, UserCheck } from 'lucide-react';

interface FinanceStatsProps {
  stats: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    pendingIncome: number;
    pendingExpense: number;
    totalLabor: number;
  };
  mode?: 'business' | 'personal';
}

export function FinanceStats({ stats, mode = 'business' }: FinanceStatsProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const isBusiness = mode === 'business';

  // Business Profit = Net Cash Flow - Labor Paid to Owner (implicitly)
  const businessProfit = stats.netProfit - stats.totalLabor;

  const displayProfit = isBusiness ? businessProfit : stats.netProfit;
  const profitLabel = isBusiness ? "Utilidad Empresa" : "Ahorro Neto";
  const profitDesc = isBusiness ? "Real (Sin tu sueldo)" : "Ingresos - Gastos";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{formatMoney(stats.totalIncome)}</div>
          <p className="text-xs text-muted-foreground">
            {isBusiness ? 'Ventas cobradas' : 'Ingresos percibidos'}
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
            {isBusiness ? 'Egresos operativos' : 'Gastos realizados'}
          </p>
        </CardContent>
      </Card>
      
      {isBusiness && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tu Sueldo</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatMoney(stats.totalLabor)}</div>
            <p className="text-xs text-muted-foreground">
              Mano de obra acumulada
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{profitLabel}</CardTitle>
          <Wallet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${displayProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatMoney(displayProfit)}
          </div>
          <p className="text-xs text-muted-foreground">
            {profitDesc}
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
