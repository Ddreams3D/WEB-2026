import React, { useState, useMemo } from 'react';
import { FinanceRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Calendar, DollarSign, Wallet, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FinanceSummaryProps {
  records: FinanceRecord[];
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

export function FinanceSummary({ records }: FinanceSummaryProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' or '0'...'11'

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  // Advanced Aggregation
  const { 
    metrics,
    availableYears
  } = useMemo(() => {
    const years = Array.from(new Set(records.map(r => new Date(r.date).getFullYear()))).sort((a, b) => b - a);
    if (years.length === 0) years.push(new Date().getFullYear());

    // 1. Filter Records by Timeframe
    const activeRecords = records.filter(r => {
      const d = new Date(r.date);
      const yearMatch = d.getFullYear() === selectedYear;
      const monthMatch = selectedMonth === 'all' || d.getMonth() === parseInt(selectedMonth);
      
      return (
        r.status === 'paid' &&
        r.category !== 'Préstamos' && 
        r.category !== 'Préstamos / Deudas' &&
        yearMatch && monthMatch
      );
    });

    // 2. Calculate Aggregates
    let revenue = 0;
    let directCosts = 0;
    let fixedCosts = 0;
    let variableCosts = 0;
    let laborCost = 0;

    activeRecords.forEach(r => {
      if (r.type === 'income') {
        revenue += r.amount;
        // Extract embedded labor from income record if exists (Owner's "Salary" for the job)
        if (r.productionSnapshot?.computedLaborCost) {
            laborCost += r.productionSnapshot.computedLaborCost;
        }
        // Extract embedded material/energy costs from income record (Cost of Goods Sold)
        if (r.productionSnapshot?.computedMaterialCost) directCosts += r.productionSnapshot.computedMaterialCost;
        if (r.productionSnapshot?.computedEnergyCost) directCosts += r.productionSnapshot.computedEnergyCost;
        if (r.productionSnapshot?.computedDepreciationCost) directCosts += r.productionSnapshot.computedDepreciationCost;
      } else {
        // Regular Expenses
        if (r.expenseType === 'production') directCosts += r.amount;
        else if (r.expenseType === 'fixed') fixedCosts += r.amount;
        else variableCosts += r.amount; // Variable or Uncategorized
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

    return { availableYears: years, metrics };
  }, [records, selectedYear, selectedMonth]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
           <Calendar className="w-5 h-5 text-muted-foreground" />
           <h2 className="font-semibold text-lg">Resumen Financiero</h2>
        </div>
        <div className="flex gap-2">
            <select 
                className="bg-background border rounded-md px-3 py-1 text-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
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

      {/* Main KPI Cards - Value Focused */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Business Profit (The "Real" Company Value) */}
        <Card className={cn(
            "border-l-4 shadow-sm", 
            metrics.businessProfit >= 0 ? "border-l-green-500" : "border-l-red-500"
        )}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                    Utilidad Real de la Empresa
                    <TrendingUp className={cn("w-4 h-4", metrics.businessProfit >= 0 ? "text-green-500" : "text-red-500")} />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{formatMoney(metrics.businessProfit)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    Dinero libre para reinversión o crecimiento (después de pagarte).
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className={cn("font-medium", metrics.netMargin > 20 ? "text-green-600" : metrics.netMargin > 0 ? "text-yellow-600" : "text-red-600")}>
                        {formatPercent(metrics.netMargin)} Margen Neto
                    </span>
                </div>
            </CardContent>
        </Card>

        {/* Card 2: Owner Salary (The "Personal" Value) */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                    Tu Sueldo Acumulado
                    <Wallet className="w-4 h-4 text-blue-500" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-blue-700">{formatMoney(metrics.laborCost)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    Valor total de tu mano de obra generada en los proyectos.
                </p>
            </CardContent>
        </Card>

        {/* Card 3: Revenue & Costs Context */}
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

      {/* Visual Breakdown & Health Check */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Composition Chart */}
          <Card>
              <CardHeader>
                  <CardTitle className="text-base">¿A dónde se fue el dinero?</CardTitle>
                  <CardDescription>Desglose de cada sol ingresado</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="h-[200px] w-full flex flex-col justify-center gap-4">
                      {/* Stacked Bar Representation */}
                      <div className="w-full h-12 bg-slate-100 rounded-lg overflow-hidden flex">
                          {metrics.revenue > 0 ? (
                              <>
                                <div style={{ width: `${(metrics.directCosts / metrics.revenue) * 100}%` }} className="bg-red-400 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-red-500" title={`Costos: ${formatMoney(metrics.directCosts)}`}>
                                    {((metrics.directCosts / metrics.revenue) * 100) > 10 && 'COSTOS'}
                                </div>
                                <div style={{ width: `${((metrics.fixedCosts + metrics.variableCosts) / metrics.revenue) * 100}%` }} className="bg-orange-400 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-orange-500" title={`Gastos: ${formatMoney(metrics.fixedCosts + metrics.variableCosts)}`}>
                                    {(((metrics.fixedCosts + metrics.variableCosts) / metrics.revenue) * 100) > 10 && 'GASTOS'}
                                </div>
                                <div style={{ width: `${(metrics.laborCost / metrics.revenue) * 100}%` }} className="bg-blue-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-blue-600" title={`Sueldo: ${formatMoney(metrics.laborCost)}`}>
                                    {((metrics.laborCost / metrics.revenue) * 100) > 10 && 'SUELDO'}
                                </div>
                                <div style={{ width: `${Math.max(0, (metrics.businessProfit / metrics.revenue) * 100)}%` }} className="bg-green-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all hover:bg-green-600" title={`Utilidad: ${formatMoney(metrics.businessProfit)}`}>
                                    {((metrics.businessProfit / metrics.revenue) * 100) > 10 && 'UTILIDAD'}
                                </div>
                              </>
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin ingresos registrados</div>
                          )}
                      </div>
                      
                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <span className="font-medium">Utilidad ({metrics.revenue > 0 ? formatPercent((metrics.businessProfit / metrics.revenue) * 100) : '0%'})</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span className="font-medium">Tu Sueldo ({metrics.revenue > 0 ? formatPercent((metrics.laborCost / metrics.revenue) * 100) : '0%'})</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-400"></div>
                              <span className="text-muted-foreground">Materiales/Costos</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                              <span className="text-muted-foreground">Gastos Fijos/Var</span>
                          </div>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Health Analysis */}
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
                            {/* Profitability Check */}
                            <div className={cn("p-4 rounded-lg flex gap-3", metrics.netMargin > 20 ? "bg-green-50 text-green-800" : metrics.netMargin > 0 ? "bg-yellow-50 text-yellow-800" : "bg-red-50 text-red-800")}>
                                {metrics.netMargin > 20 ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">
                                        {metrics.netMargin > 30 
                                            ? "¡Excelente trabajo! Tu empresa es altamente rentable y tiene capacidad de crecimiento." 
                                            : metrics.netMargin > 15 
                                                ? "Vas por buen camino. Intenta reducir costos fijos o aumentar precios para llegar al 30%." 
                                                : metrics.netMargin > 0
                                                    ? "Atención: Tus márgenes son ajustados. Revisa tus precios o costos operativos."
                                                    : "Alerta Crítica: La empresa está perdiendo dinero en cada venta. Necesitas reestructurar costos urgentemente."}
                                    </p>
                                </div>
                            </div>

                            {/* Salary Check */}
                            <div className="p-4 bg-blue-50 text-blue-900 rounded-lg flex gap-3">
                                <Wallet className="w-5 h-5 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">Sobre tu Sueldo</p>
                                    <p>
                                        Has generado <strong>{formatMoney(metrics.laborCost)}</strong> por tu trabajo operativo. 
                                        {metrics.laborCost > 0 
                                            ? " Recuerda transferir este monto a tu cuenta personal regularmente." 
                                            : " Aún no se ha registrado labor cobrable en los proyectos."}
                                    </p>
                                </div>
                            </div>
                          </>
                      )}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}