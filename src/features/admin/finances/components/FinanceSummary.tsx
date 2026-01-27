import React, { useState, useMemo } from 'react';
import { FinanceRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Calendar, DollarSign, Wallet, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FinanceSummaryProps {
  records: FinanceRecord[];
  mode?: 'business' | 'personal';
}

interface FinancialMetrics {
  revenue: number;
  directCosts: number; // Materials + Production Energy
  fixedCosts: number; // Subscriptions, Rent
  variableCosts: number; // Marketing, Fees
  laborCost: number; // Owner Salary (Calculated from production time)
  businessProfit: number; // Pure Company Profit
  
  // Ratios
  grossMargin: number;
  netMargin: number;
}

interface PersonalSummaryMetrics {
  income: number;
  expense: number;
  savings: number;
  savingsRate: number;
  monthly: {
    month: number;
    income: number;
    expense: number;
    savings: number;
  }[];
}

export function FinanceSummary({ records, mode = 'business' }: FinanceSummaryProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' or '0'...'11'

  const isBusiness = mode === 'business';

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  const { 
    metrics,
    availableYears,
    personalSummary
  } = useMemo(() => {
    const yearsSet = new Set<number>();
    records.forEach(r => {
      const d = new Date(r.date);
      if (!isNaN(d.getTime())) {
        yearsSet.add(d.getFullYear());
      }
    });
    const years = Array.from(yearsSet).sort((a, b) => b - a);
    if (years.length === 0) years.push(new Date().getFullYear());

    const baseRecords = records.filter(r => {
      const d = new Date(r.date);
      const yearMatch = d.getFullYear() === selectedYear;

      return (
        r.status === 'paid' &&
        r.category !== 'Préstamos' && 
        r.category !== 'Préstamos / Deudas' &&
        yearMatch
      );
    });

    const activeRecords = baseRecords.filter(r => {
      if (selectedMonth === 'all') return true;
      const d = new Date(r.date);
      return d.getMonth() === parseInt(selectedMonth);
    });

    let revenue = 0;
    let directCosts = 0;
    let fixedCosts = 0;
    let variableCosts = 0;
    let laborCost = 0;
    let personalIncome = 0;
    let personalExpense = 0;

    activeRecords.forEach(r => {
      if (r.type === 'income') {
        revenue += r.amount;
        personalIncome += r.amount;
        if (r.productionSnapshot?.computedLaborCost) {
          laborCost += r.productionSnapshot.computedLaborCost;
        }
        if (r.productionSnapshot?.computedMaterialCost) {
          directCosts += r.productionSnapshot.computedMaterialCost;
        }
        if (r.productionSnapshot?.computedEnergyCost) {
          directCosts += r.productionSnapshot.computedEnergyCost;
        }
        if (r.productionSnapshot?.computedDepreciationCost) {
          directCosts += r.productionSnapshot.computedDepreciationCost;
        }
      } else if (r.type === 'expense') {
        personalExpense += r.amount;
        if (r.expenseType === 'production') directCosts += r.amount;
        else if (r.expenseType === 'fixed') fixedCosts += r.amount;
        else variableCosts += r.amount;
      }
    });

    const totalCosts = directCosts + fixedCosts + variableCosts + laborCost;
    const businessProfit = revenue - totalCosts;

    const metrics: FinancialMetrics = {
      revenue,
      directCosts,
      fixedCosts,
      variableCosts,
      laborCost,
      businessProfit,
      grossMargin: revenue > 0 ? ((revenue - directCosts) / revenue) * 100 : 0,
      netMargin: revenue > 0 ? (businessProfit / revenue) * 100 : 0
    };

    const personalSavings = personalIncome - personalExpense;
    const personalSavingsRate = personalIncome > 0 ? (personalSavings / personalIncome) * 100 : 0;

    const monthlyMap: Record<number, { income: number; expense: number }> = {};
    baseRecords.forEach(r => {
      const d = new Date(r.date);
      const month = d.getMonth();
      if (!monthlyMap[month]) {
        monthlyMap[month] = { income: 0, expense: 0 };
      }
      if (r.type === 'income') {
        monthlyMap[month].income += r.amount;
      } else if (r.type === 'expense') {
        monthlyMap[month].expense += r.amount;
      }
    });

    const monthly = Array.from({ length: 12 }).map((_, index) => {
      const data = monthlyMap[index] || { income: 0, expense: 0 };
      const savings = data.income - data.expense;
      return {
        month: index,
        income: data.income,
        expense: data.expense,
        savings
      };
    });

    const personalSummary: PersonalSummaryMetrics = {
      income: personalIncome,
      expense: personalExpense,
      savings: personalSavings,
      savingsRate: personalSavingsRate,
      monthly
    };

    return { availableYears: years, metrics, personalSummary };
  }, [records, selectedYear, selectedMonth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold text-lg">
            {isBusiness ? 'Resumen Financiero del Negocio' : 'Resumen Finanzas Personales'}
          </h2>
        </div>
        <div className="flex gap-2">
          <select
            className="bg-background border rounded-md px-3 py-1 text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            className="bg-background border rounded-md px-3 py-1 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">Todo el Año</option>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i.toString()}>
                {format(new Date(2024, i, 1), 'MMMM', { locale: es })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isBusiness ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={cn(
                'border-l-4 shadow-sm',
                metrics.businessProfit >= 0 ? 'border-l-green-500' : 'border-l-red-500',
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  Utilidad Real de la Empresa
                  <TrendingUp
                    className={cn(
                      'w-4 h-4',
                      metrics.businessProfit >= 0 ? 'text-green-500' : 'text-red-500',
                    )}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatMoney(metrics.businessProfit)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Dinero libre para reinversión o crecimiento (después de pagarte).
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      'font-medium',
                      metrics.netMargin > 20
                        ? 'text-green-600'
                        : metrics.netMargin > 0
                          ? 'text-yellow-600'
                          : 'text-red-600',
                    )}
                  >
                    {formatPercent(metrics.netMargin)} Margen Neto
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  Tu Sueldo Acumulado
                  <Wallet className="w-4 h-4 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">
                  {formatMoney(metrics.laborCost)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Valor total de tu mano de obra generada en los proyectos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-slate-400 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  Ingresos Totales
                  <DollarSign className="w-4 h-4 text-slate-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatMoney(metrics.revenue)}</div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Costos Directos (Mat/Luz):</span>
                    <span>{formatMoney(metrics.directCosts)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Gastos Fijos/Var:</span>
                    <span>{formatMoney(metrics.fixedCosts + metrics.variableCosts)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">¿A dónde se fue el dinero?</CardTitle>
                <CardDescription>Desglose de cada sol ingresado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full flex flex-col justify-center gap-4">
                  <div className="w-full h-12 bg-slate-100 rounded-lg overflow-hidden flex">
                    {metrics.revenue > 0 ? (
                      <>
                        <div
                          style={{ width: `${(metrics.directCosts / metrics.revenue) * 100}%` }}
                          className="bg-red-400 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-red-500"
                          title={`Costos: ${formatMoney(metrics.directCosts)}`}
                        >
                          {(metrics.directCosts / metrics.revenue) * 100 > 10 && 'COSTOS'}
                        </div>
                        <div
                          style={{
                            width: `${((metrics.fixedCosts + metrics.variableCosts) / metrics.revenue) * 100}%`,
                          }}
                          className="bg-orange-400 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-orange-500"
                          title={`Gastos: ${formatMoney(
                            metrics.fixedCosts + metrics.variableCosts,
                          )}`}
                        >
                          {((metrics.fixedCosts + metrics.variableCosts) / metrics.revenue) * 100 > 10 &&
                            'GASTOS'}
                        </div>
                        <div
                          style={{ width: `${(metrics.laborCost / metrics.revenue) * 100}%` }}
                          className="bg-blue-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-blue-600"
                          title={`Sueldo: ${formatMoney(metrics.laborCost)}`}
                        >
                          {(metrics.laborCost / metrics.revenue) * 100 > 10 && 'SUELDO'}
                        </div>
                        <div
                          style={{
                            width: `${Math.max(
                              0,
                              (metrics.businessProfit / metrics.revenue) * 100,
                            )}%`,
                          }}
                          className="bg-green-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-green-600"
                          title={`Utilidad: ${formatMoney(metrics.businessProfit)}`}
                        >
                          {(metrics.businessProfit / metrics.revenue) * 100 > 10 && 'UTILIDAD'}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Sin ingresos registrados
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="font-medium">
                        Utilidad (
                        {metrics.revenue > 0
                          ? formatPercent((metrics.businessProfit / metrics.revenue) * 100)
                          : '0%'}
                        )
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="font-medium">
                        Tu Sueldo (
                        {metrics.revenue > 0
                          ? formatPercent((metrics.laborCost / metrics.revenue) * 100)
                          : '0%'}
                        )
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="text-muted-foreground">Materiales/Costos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-400" />
                      <span className="text-muted-foreground">Gastos Fijos/Var</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Análisis de Salud
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.revenue === 0 ? (
                    <div className="p-4 bg-slate-100 rounded-lg text-sm text-center">
                      No hay suficientes datos para realizar un análisis.
                    </div>
                  ) : (
                    <>
                      <div
                        className={cn(
                          'p-4 rounded-lg flex gap-3',
                          metrics.netMargin > 20
                            ? 'bg-green-50 text-green-800'
                            : metrics.netMargin > 0
                              ? 'bg-yellow-50 text-yellow-800'
                              : 'bg-red-50 text-red-800',
                        )}
                      >
                        {metrics.netMargin > 20 ? (
                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 shrink-0" />
                        )}
                        <div className="text-sm">
                          <p className="font-semibold mb-1">
                            {metrics.netMargin > 30
                              ? '¡Excelente trabajo! Tu empresa es altamente rentable y tiene capacidad de crecimiento.'
                              : metrics.netMargin > 15
                                ? 'Vas por buen camino. Intenta reducir costos fijos o aumentar precios para llegar al 30%.'
                                : metrics.netMargin > 0
                                  ? 'Atención: Tus márgenes son ajustados. Revisa tus precios o costos operativos.'
                                  : 'Alerta Crítica: La empresa está perdiendo dinero en cada venta. Necesitas reestructurar costos urgentemente.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 text-blue-900 rounded-lg flex gap-3">
                        <Wallet className="w-5 h-5 shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold mb-1">Sobre tu Sueldo</p>
                          <p>
                            Has generado <strong>{formatMoney(metrics.laborCost)}</strong> por tu
                            trabajo operativo.
                            {metrics.laborCost > 0
                              ? ' Recuerda transferir este monto a tu cuenta personal regularmente.'
                              : ' Aún no se ha registrado labor cobrable en los proyectos.'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={cn(
                'border-l-4 shadow-sm',
                personalSummary.savings >= 0 ? 'border-l-emerald-500' : 'border-l-rose-500',
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  Ahorro Neto del periodo
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    'text-3xl font-bold',
                    personalSummary.savings >= 0 ? 'text-emerald-600' : 'text-rose-600',
                  )}
                >
                  {formatMoney(personalSummary.savings)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ingresos pagados menos gastos pagados en el rango seleccionado.
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  Tasa de ahorro:{' '}
                  <span className="font-semibold">
                    {personalSummary.income > 0 ? formatPercent(personalSummary.savingsRate) : '0%'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  Ingresos Pagados
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  {formatMoney(personalSummary.income)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Solo se cuentan ingresos con estado pagado que no son préstamos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-rose-500 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  Gastos Pagados
                  <DollarSign className="w-4 h-4 text-rose-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-600">
                  {formatMoney(personalSummary.expense)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  No incluye préstamos ni deudas, solo tu gasto real.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">¿Cómo se reparte tu dinero?</CardTitle>
                <CardDescription>Relación entre lo que gastas y lo que ahorras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full h-12 bg-slate-100 rounded-lg overflow-hidden flex">
                    {personalSummary.income > 0 ? (
                      <>
                        <div
                          style={{
                            width: `${
                              (Math.min(
                                personalSummary.expense,
                                personalSummary.income,
                              ) /
                                personalSummary.income) *
                              100
                            }%`,
                          }}
                          className="bg-rose-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-rose-600"
                          title={`Gastos: ${formatMoney(personalSummary.expense)}`}
                        >
                          {(personalSummary.expense / personalSummary.income) * 100 > 10 &&
                            'GASTOS'}
                        </div>
                        {personalSummary.savings > 0 && (
                          <div
                            style={{
                              width: `${
                                (personalSummary.savings / personalSummary.income) * 100
                              }%`,
                            }}
                            className="bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-emerald-600"
                            title={`Ahorro: ${formatMoney(personalSummary.savings)}`}
                          >
                            {(personalSummary.savings / personalSummary.income) * 100 > 10 &&
                              'AHORRO'}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Registra ingresos pagados para ver cómo se reparte tu dinero.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span>Gastos sobre tus ingresos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span>Ahorro sobre tus ingresos</span>
                    </div>
                  </div>

                  {personalSummary.income > 0 && personalSummary.expense > personalSummary.income && (
                    <p className="text-xs text-rose-600">
                      Gastaste más de lo que ingresó en este periodo. Intenta reducir gastos o aumentar
                      tus ingresos.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evolución de tu ahorro</CardTitle>
                <CardDescription>
                  Mes a mes del año seleccionado (solo pagos reales)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {personalSummary.monthly.every((m) => m.income === 0 && m.expense === 0) ? (
                  <div className="p-4 bg-slate-100 rounded-lg text-sm text-center">
                    Aún no hay movimientos pagados para este año.
                  </div>
                ) : (
                  <div className="h-[280px] w-full pt-12 pb-6">
                    <div className="h-full flex items-end justify-between gap-2">
                      {personalSummary.monthly.map((m) => {
                        const maxVal = Math.max(
                          ...personalSummary.monthly.map((d) => Math.abs(d.savings)),
                          1,
                        );
                        // Limit max height to 85% to reserve space for tooltip
                        const height = (Math.abs(m.savings) / maxVal) * 85;
                        const isPositive = m.savings >= 0;
                        const hasActivity = m.income > 0 || m.expense > 0;

                        return (
                          <div
                            key={m.month}
                            className="group relative flex-1 h-full flex flex-col justify-end items-center"
                          >
                            {/* Bar */}
                            <div
                              style={{ height: hasActivity ? `${Math.max(height, 2)}%` : '4px' }}
                              className={cn(
                                'w-full max-w-[24px] rounded-t-sm transition-all duration-300 relative',
                                !hasActivity
                                  ? 'bg-slate-100'
                                  : isPositive
                                    ? 'bg-emerald-500 hover:bg-emerald-600'
                                    : 'bg-rose-500 hover:bg-rose-600',
                              )}
                            >
                              {/* Tooltip inside Bar to track position */}
                              {hasActivity && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                  <div className="font-semibold mb-1 border-b border-slate-600 pb-1">
                                    {format(new Date(selectedYear, m.month, 1), 'MMMM', {
                                      locale: es,
                                    })}
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                    <span className="text-slate-400">Ingresos:</span>
                                    <span className="text-emerald-400 text-right">
                                      {formatMoney(m.income)}
                                    </span>
                                    <span className="text-slate-400">Gastos:</span>
                                    <span className="text-rose-400 text-right">
                                      {formatMoney(m.expense)}
                                    </span>
                                    <span className="text-slate-200 font-medium border-t border-slate-600 pt-1 mt-1">
                                      Neto:
                                    </span>
                                    <span
                                      className={cn(
                                        'font-bold text-right border-t border-slate-600 pt-1 mt-1',
                                        isPositive ? 'text-emerald-400' : 'text-rose-400',
                                      )}
                                    >
                                      {isPositive ? '+' : '-'}
                                      {formatMoney(Math.abs(m.savings))}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Label */}
                            <div className="absolute top-full mt-2 text-[10px] text-muted-foreground uppercase font-medium">
                              {format(new Date(selectedYear, m.month, 1), 'MMM', { locale: es })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
