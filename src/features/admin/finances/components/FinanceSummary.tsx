import React, { useState, useMemo } from 'react';
import { FinanceRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Calendar, BarChart3, PieChart, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, getWeek, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface FinanceSummaryProps {
  records: FinanceRecord[];
}

type ViewMode = 'monthly' | 'weekly' | 'yearly';

interface ChartDataPoint {
  label: string;
  fullLabel: string;
  income: number;
  expense: number;
  net: number;
}

export function FinanceSummary({ records }: FinanceSummaryProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');

  // Helper to format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Data Aggregation
  const { 
    availableYears, 
    yearlyStats, 
    chartData,
    incomeCategories,
    expenseCategories,
    expenseTypes
  } = useMemo(() => {
    const years = Array.from(new Set(records.map((r: FinanceRecord) => new Date(r.date).getFullYear()))).sort((a: number, b: number) => b - a);
    if (years.length === 0) years.push(new Date().getFullYear());

    // Base records (filtered by status/category only)
    const baseRecords = records.filter((r: FinanceRecord) => 
      r.status === 'paid' &&
      r.category !== 'Préstamos' && 
      r.category !== 'Préstamos / Deudas'
    );

    // Records to display based on view mode
    const displayedRecords = viewMode === 'yearly' 
      ? baseRecords 
      : baseRecords.filter((r: FinanceRecord) => new Date(r.date).getFullYear() === selectedYear);

    // Stats Totals
    const totalIncome = displayedRecords.filter((r: FinanceRecord) => r.type === 'income').reduce((acc: number, r: FinanceRecord) => acc + r.amount, 0);
    const totalExpense = displayedRecords.filter((r: FinanceRecord) => r.type === 'expense').reduce((acc: number, r: FinanceRecord) => acc + r.amount, 0);
    const netProfit = totalIncome - totalExpense;

    // Categories Breakdown
    const incCats: Record<string, number> = {};
    const expCats: Record<string, number> = {};
    const expTypes: Record<string, number> = { production: 0, fixed: 0, variable: 0, uncategorized: 0 };

    displayedRecords.forEach((r: FinanceRecord) => {
      if (r.type === 'income') {
        incCats[r.category] = (incCats[r.category] || 0) + r.amount;
      } else {
        expCats[r.category] = (expCats[r.category] || 0) + r.amount;
        if (r.expenseType) {
          expTypes[r.expenseType] = (expTypes[r.expenseType] || 0) + r.amount;
        } else {
          expTypes.uncategorized += r.amount;
        }
      }
    });

    // Temporal Data
    let dataPoints: ChartDataPoint[] = [];

    if (viewMode === 'yearly') {
       // Yearly logic
       const yearsMap: Record<number, { income: number, expense: number }> = {};
       // Initialize for available years to ensure order
       years.forEach(y => {
           yearsMap[y] = { income: 0, expense: 0 };
       });
       
       baseRecords.forEach((r: FinanceRecord) => {
         const y = new Date(r.date).getFullYear();
         // Only count if year is in our available list (should be always true but good for safety)
         if (yearsMap[y]) {
             if (r.type === 'income') yearsMap[y].income += r.amount;
             else yearsMap[y].expense += r.amount;
         }
       });

       dataPoints = years.sort((a,b) => a - b).map(y => ({
           label: y.toString(),
           fullLabel: y.toString(),
           income: yearsMap[y].income,
           expense: yearsMap[y].expense,
           net: yearsMap[y].income - yearsMap[y].expense
       }));

    } else if (viewMode === 'monthly') {
      dataPoints = Array(12).fill(0).map((_, i) => ({
        label: format(new Date(selectedYear, i, 1), 'MMM', { locale: es }),
        fullLabel: format(new Date(selectedYear, i, 1), 'MMMM', { locale: es }),
        income: 0,
        expense: 0,
        net: 0
      }));

      displayedRecords.forEach((r: FinanceRecord) => {
        const month = new Date(r.date).getMonth();
        if (r.type === 'income') dataPoints[month].income += r.amount;
        else dataPoints[month].expense += r.amount;
      });
    } else {
      // Weekly logic
      const weeksMap: Record<number, { income: number, expense: number, label: string }> = {};
      
      displayedRecords.forEach((r: FinanceRecord) => {
        const date = new Date(r.date);
        const week = getWeek(date);
        if (!weeksMap[week]) {
            const start = startOfWeek(date, { weekStartsOn: 1 });
            const end = endOfWeek(date, { weekStartsOn: 1 });
            weeksMap[week] = {
                income: 0,
                expense: 0,
                label: `${format(start, 'd MMM', { locale: es })} - ${format(end, 'd MMM', { locale: es })}`
            };
        }
        if (r.type === 'income') weeksMap[week].income += r.amount;
        else weeksMap[week].expense += r.amount;
      });

      dataPoints = Object.keys(weeksMap).sort((a: string, b: string) => Number(a) - Number(b)).map((w: string) => ({
          label: `Sem ${w}`,
          fullLabel: weeksMap[Number(w)].label,
          income: weeksMap[Number(w)].income,
          expense: weeksMap[Number(w)].expense,
          net: weeksMap[Number(w)].income - weeksMap[Number(w)].expense
      }));
    }

    // Calculate Net for all points (redundant for yearly but harmless)
    dataPoints.forEach((p: ChartDataPoint) => p.net = p.income - p.expense);

    return {
      availableYears: years,
      yearlyStats: { totalIncome, totalExpense, netProfit },
      chartData: dataPoints,
      incomeCategories: Object.entries(incCats).sort((a: [string, number], b: [string, number]) => b[1] - a[1]),
      expenseCategories: Object.entries(expCats).sort((a: [string, number], b: [string, number]) => b[1] - a[1]),
      expenseTypes: expTypes
    };
  }, [records, selectedYear, viewMode]);

  const maxChartVal = Math.max(...chartData.map((d: ChartDataPoint) => Math.max(d.income, d.expense)), 1);

  // Simple Bar Component
  const SimpleBar = ({ value, max, color, label, tooltip }: { value: number, max: number, color: string, label?: string, tooltip: string }) => (
    <div className="flex flex-col items-center gap-1 group relative h-full justify-end w-full">
      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-md">
        {tooltip}: {formatMoney(value)}
      </div>
      <div 
        className={cn("w-full rounded-t-sm transition-all duration-500 min-h-[1px]", color)}
        style={{ height: `${(value / max) * 100}%` }}
      />
      {label && <span className="text-[10px] text-muted-foreground rotate-0 truncate w-full text-center">{label}</span>}
    </div>
  );

  const getViewLabel = () => {
      if (viewMode === 'yearly') return 'Anual';
      if (viewMode === 'monthly') return 'Mensual';
      return 'Semanal';
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Resumen {viewMode === 'yearly' ? 'Histórico' : selectedYear}
            </h2>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <div className="flex bg-muted rounded-lg p-1">
                <button 
                    onClick={() => setViewMode('monthly')}
                    className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", viewMode === 'monthly' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                    Mensual
                </button>
                <button 
                    onClick={() => setViewMode('weekly')}
                    className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", viewMode === 'weekly' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                    Semanal
                </button>
                <button 
                    onClick={() => setViewMode('yearly')}
                    className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", viewMode === 'yearly' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                    Anual
                </button>
            </div>
        </div>

        {viewMode !== 'yearly' && (
            <Tabs value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))} className="w-auto">
            <TabsList>
                {availableYears.map((year: number) => (
                <TabsTrigger key={year} value={year.toString()}>{year}</TabsTrigger>
                ))}
            </TabsList>
            </Tabs>
        )}
      </div>

      {/* Main Tabs for Analysis Views */}
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b rounded-none h-auto p-0 gap-6">
           <TabsTrigger value="income" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-0 py-3 gap-2 text-muted-foreground data-[state=active]:text-emerald-600">
             <TrendingUp className="w-4 h-4" /> Solo Ingresos
           </TabsTrigger>
           <TabsTrigger value="expense" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 rounded-none px-0 py-3 gap-2 text-muted-foreground data-[state=active]:text-rose-600">
             <TrendingDown className="w-4 h-4" /> Solo Gastos
           </TabsTrigger>
           <TabsTrigger value="comparison" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 py-3 gap-2 text-muted-foreground data-[state=active]:text-blue-600">
             <BarChart3 className="w-4 h-4" /> Comparativa
           </TabsTrigger>
           <TabsTrigger value="net" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 gap-2 text-muted-foreground data-[state=active]:text-primary">
             <Wallet className="w-4 h-4" /> Netos (Utilidad)
           </TabsTrigger>
        </TabsList>

        <div className="mt-6">
            {/* VIEW: SOLO INGRESOS */}
            <TabsContent value="income" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">Evolución de Ingresos ({getViewLabel()})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-end gap-2 pt-6">
                                {chartData.map((d: ChartDataPoint, i: number) => (
                                    <SimpleBar key={i} value={d.income} max={maxChartVal} color="bg-emerald-500" label={d.label} tooltip={`${d.fullLabel} - Ingresos`} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Top Fuentes de Ingreso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {incomeCategories.map(([cat, amount]: [string, number], i: number) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground truncate max-w-[150px]" title={cat}>{cat}</span>
                                        <span className="font-medium">{formatMoney(amount)}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${(amount / yearlyStats.totalIncome) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* VIEW: SOLO GASTOS */}
            <TabsContent value="expense" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">Evolución de Gastos ({getViewLabel()})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-end gap-2 pt-6">
                                {chartData.map((d: ChartDataPoint, i: number) => (
                                    <SimpleBar key={i} value={d.expense} max={maxChartVal} color="bg-rose-500" label={d.label} tooltip={`${d.fullLabel} - Gastos`} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Por Tipo de Gasto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm"><span>Producción</span> <span className="font-medium">{formatMoney(expenseTypes.production)}</span></div>
                                    <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-orange-500" style={{ width: `${(expenseTypes.production / yearlyStats.totalExpense) * 100}%` }} /></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm"><span>Fijos</span> <span className="font-medium">{formatMoney(expenseTypes.fixed)}</span></div>
                                    <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-purple-500" style={{ width: `${(expenseTypes.fixed / yearlyStats.totalExpense) * 100}%` }} /></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm"><span>Variables</span> <span className="font-medium">{formatMoney(expenseTypes.variable)}</span></div>
                                    <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-cyan-500" style={{ width: `${(expenseTypes.variable / yearlyStats.totalExpense) * 100}%` }} /></div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Top Categorías</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {expenseCategories.slice(0, 5).map(([cat, amount]: [string, number], i: number) => (
                                    <div key={i} className="flex justify-between text-sm border-b pb-2 last:border-0">
                                        <span className="text-muted-foreground truncate max-w-[150px]" title={cat}>{cat}</span>
                                        <span className="font-medium">{formatMoney(amount)}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>

            {/* VIEW: COMPARATIVA */}
            <TabsContent value="comparison" className="space-y-6 mt-0">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Ingresos vs Gastos ({getViewLabel()})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] flex items-end gap-3 pt-6 px-2">
                            {chartData.map((d: ChartDataPoint, i: number) => (
                                <div key={i} className="flex flex-col items-center gap-0 w-full h-full justify-end group">
                                    <div className="flex gap-0.5 w-full items-end justify-center h-full">
                                        {/* Income Bar */}
                                        <div className="w-1/2 max-w-[20px] bg-emerald-500/80 hover:bg-emerald-500 transition-all rounded-t-sm relative group/bar" style={{ height: `${(d.income / maxChartVal) * 100}%`, minHeight: '1px' }}>
                                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 bg-popover text-popover-foreground text-[10px] px-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                                                +{formatMoney(d.income)}
                                            </div>
                                        </div>
                                        {/* Expense Bar */}
                                        <div className="w-1/2 max-w-[20px] bg-rose-500/80 hover:bg-rose-500 transition-all rounded-t-sm relative group/bar" style={{ height: `${(d.expense / maxChartVal) * 100}%`, minHeight: '1px' }}>
                                             <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 bg-popover text-popover-foreground text-[10px] px-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                                                -{formatMoney(d.expense)}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground mt-2 truncate w-full text-center">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-emerald-500/10 border-emerald-500/20">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <span className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Total Ingresos</span>
                            <span className="text-2xl font-bold text-emerald-700">{formatMoney(yearlyStats.totalIncome)}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-rose-500/10 border-rose-500/20">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <span className="text-xs text-rose-600 font-medium uppercase tracking-wider">Total Gastos</span>
                            <span className="text-2xl font-bold text-rose-700">{formatMoney(yearlyStats.totalExpense)}</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-500/10 border-blue-500/20">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <span className="text-xs text-blue-600 font-medium uppercase tracking-wider">Balance</span>
                            <span className="text-2xl font-bold text-blue-700">{formatMoney(yearlyStats.netProfit)}</span>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* VIEW: NETOS */}
            <TabsContent value="net" className="space-y-6 mt-0">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Flujo Neto / Utilidad ({getViewLabel()})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-end gap-2 pt-6 border-b border-muted relative">
                            {/* Zero Line */}
                            <div className="absolute w-full border-t border-dashed border-muted-foreground/30 left-0" style={{ bottom: '50%' }} />
                            
                            {chartData.map((d: ChartDataPoint, i: number) => {
                                // Calculate max deviation for scaling relative to center
                                const maxAbs = Math.max(...chartData.map((p: ChartDataPoint) => Math.abs(p.net)), 1);
                                const heightPerc = (Math.abs(d.net) / maxAbs) * 50; // Max 50% height either way
                                
                                return (
                                    <div key={i} className="flex flex-col items-center justify-center gap-1 group relative h-full w-full">
                                        <div 
                                            className={cn("w-full max-w-[30px] rounded-sm transition-all relative group/bar", d.net >= 0 ? "bg-primary" : "bg-rose-500")}
                                            style={{ 
                                                height: `${Math.max(heightPerc, 1)}%`,
                                                marginBottom: d.net >= 0 ? '50%' : 'auto',
                                                marginTop: d.net < 0 ? '50%' : 'auto'
                                            }}
                                        >
                                            <div className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20"
                                                style={{ [d.net >= 0 ? 'bottom' : 'top']: '100%' }}
                                            >
                                                {formatMoney(d.net)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-2 px-2">
                            {chartData.map((d: ChartDataPoint, i: number) => (
                                <span key={i} className="text-[10px] text-muted-foreground w-full text-center truncate">{d.label}</span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}