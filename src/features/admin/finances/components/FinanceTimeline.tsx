import React, { useState, useMemo } from 'react';
import { FinanceRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, LineChart, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinanceTimelineProps {
  records: FinanceRecord[];
}

export function FinanceTimeline({ records }: FinanceTimelineProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const { availableYears, monthlyData, yearlyStats } = useMemo(() => {
    const years = Array.from(new Set(records.map(r => new Date(r.date).getFullYear()))).sort((a, b) => b - a);
    if (years.length === 0) years.push(new Date().getFullYear());

    const statsByMonth = Array(12).fill(0).map(() => ({
      income: 0,
      expense: 0,
      balance: 0,
      accumulated: 0,
      expenseBreakdown: {
        production: 0,
        fixed: 0,
        variable: 0,
        uncategorized: 0
      },
      count: 0
    }));

    // Calculate initial balance from previous years
    let initialBalance = 0;
    records.forEach(r => {
       const d = new Date(r.date);
       if (d.getFullYear() < selectedYear && r.status === 'paid') {
           initialBalance += (r.type === 'income' ? r.amount : -r.amount);
       }
    });

    let yearIncome = 0;
    let yearExpense = 0;
    
    // Aggregate data for selected year
    records.forEach(record => {
      const date = new Date(record.date);
      if (date.getFullYear() === selectedYear && record.status === 'paid') {
        const month = date.getMonth();
        if (record.type === 'income') {
          statsByMonth[month].income += record.amount;
          yearIncome += record.amount;
        } else {
          statsByMonth[month].expense += record.amount;
          yearExpense += record.amount;
          
          // Expense Breakdown
          if (record.expenseType) {
            statsByMonth[month].expenseBreakdown[record.expenseType] += record.amount;
          } else {
            statsByMonth[month].expenseBreakdown.uncategorized += record.amount;
          }
        }
        statsByMonth[month].count += 1;
      }
    });

    // Calculate balances and accumulation
    let currentAccumulated = initialBalance;
    statsByMonth.forEach(stat => {
      stat.balance = stat.income - stat.expense;
      currentAccumulated += stat.balance;
      stat.accumulated = currentAccumulated;
    });

    // Calculate yearly expense breakdown totals
    const yearlyExpenseBreakdown = statsByMonth.reduce((acc, curr) => ({
      production: acc.production + curr.expenseBreakdown.production,
      fixed: acc.fixed + curr.expenseBreakdown.fixed,
      variable: acc.variable + curr.expenseBreakdown.variable,
      uncategorized: acc.uncategorized + curr.expenseBreakdown.uncategorized
    }), { production: 0, fixed: 0, variable: 0, uncategorized: 0 });

    return {
      availableYears: years,
      monthlyData: statsByMonth,
      yearlyStats: { 
        income: yearIncome, 
        expense: yearExpense, 
        balance: yearIncome - yearExpense,
        initialBalance,
        finalBalance: currentAccumulated,
        expenseBreakdown: yearlyExpenseBreakdown
      }
    };
  }, [records, selectedYear]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const maxVal = Math.max(...monthlyData.map(d => Math.max(d.income, d.expense)), 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Resumen Financiero {selectedYear}
          </h2>
          <p className="text-sm text-muted-foreground">
            Balance inicial del año: <span className="font-medium text-foreground">{formatCurrency(yearlyStats.initialBalance)}</span>
          </p>
        </div>

        <Tabs value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))} className="w-auto">
          <TabsList>
            {availableYears.map(year => (
              <TabsTrigger key={year} value={year.toString()}>{year}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Yearly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Ingresos</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(yearlyStats.income)}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-rose-500/10 border-rose-500/20">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-1">Egresos</p>
            <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">{formatCurrency(yearlyStats.expense)}</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Balance Neto (Año)</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(yearlyStats.balance)}</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-primary mb-1">Caja Acumulada</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(yearlyStats.finalBalance)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
           <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                 <PieChart className="w-4 h-4" /> Distribución de Gastos
              </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500" /> Producción</span>
                    <span className="font-medium">{formatCurrency(yearlyStats.expenseBreakdown.production)}</span>
                 </div>
                 <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${(yearlyStats.expenseBreakdown.production / yearlyStats.expense) * 100}%` }} />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500" /> Fijos</span>
                    <span className="font-medium">{formatCurrency(yearlyStats.expenseBreakdown.fixed)}</span>
                 </div>
                 <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${(yearlyStats.expenseBreakdown.fixed / yearlyStats.expense) * 100}%` }} />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500" /> Variables</span>
                    <span className="font-medium">{formatCurrency(yearlyStats.expenseBreakdown.variable)}</span>
                 </div>
                 <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: `${(yearlyStats.expenseBreakdown.variable / yearlyStats.expense) * 100}%` }} />
                 </div>
              </div>
           </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LineChart className="w-4 h-4" /> Evolución Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monthlyData.map((data, index) => {
                 // Skip future months if they have no data
                 if (data.count === 0 && index > new Date().getMonth() && selectedYear === new Date().getFullYear()) return null;
                 
                 return (
                  <div key={months[index]} className="flex items-center gap-4 text-sm">
                    <div className="w-24 font-medium text-muted-foreground">{months[index]}</div>
                    
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-xs text-muted-foreground">Ing:</span>
                          <span className="font-medium">{formatCurrency(data.income)}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span className="text-xs text-muted-foreground">Gas:</span>
                          <span className="font-medium">{formatCurrency(data.expense)}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-xs text-muted-foreground">Caja:</span>
                          <span className={cn("font-bold", data.accumulated >= 0 ? "text-primary" : "text-rose-500")}>
                             {formatCurrency(data.accumulated)}
                          </span>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
