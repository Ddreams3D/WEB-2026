'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Landmark, PieChart, Inbox, Wallet } from 'lucide-react';
import { useFinances } from './hooks/useFinances';
import { FinanceTable } from './components/FinanceTable';
import { FinanceStats } from './components/FinanceStats';
import { FinanceSummary } from './components/FinanceSummary';
import { FinanceSyncButton } from './components/FinanceSyncButton';
import { FinanceModal } from './FinanceModal';
import { InboxModal } from './components/InboxModal';
import { FinanceRecord, MonthlyBudgets, MonthlyBudgetItem } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PERSONAL_BUDGET_STORAGE_KEY = 'personal_finance_monthly_budget';
const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export function PersonalFinancesView() {
  const { records, allRecords, importRecords, loading, addRecord, updateRecord, deleteRecord, stats } = useFinances(
    'personal_finance_records',
    [],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Partial<FinanceRecord> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [budgets, setBudgets] = useState<MonthlyBudgets>({});
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PERSONAL_BUDGET_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as any;
        const normalized: MonthlyBudgets = {};

        if (parsed && typeof parsed === 'object') {
          Object.entries(parsed).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              const items = (value as any[])
                .map((item) => {
                  const amount = Number((item as any).amount) || 0;
                  const label = String((item as any).label || '').trim() || 'General';
                  const linkedCategory =
                    (item as any).linkedCategory && typeof (item as any).linkedCategory === 'string'
                      ? String((item as any).linkedCategory)
                      : undefined;
                  if (!Number.isFinite(amount) || amount <= 0) {
                    return null;
                  }
                  return {
                    id: String((item as any).id || uuidv4()),
                    label,
                    amount,
                    linkedCategory,
                  } as MonthlyBudgetItem;
                })
                .filter(Boolean) as MonthlyBudgetItem[];

              normalized[key] = items;
            } else if (typeof value === 'number') {
              const amount = Number(value) || 0;
              normalized[key] =
                amount > 0
                  ? [
                      {
                        id: uuidv4(),
                        label: 'General',
                        amount,
                      },
                    ]
                  : [];
            } else if (value && typeof value === 'object' && Array.isArray((value as any).items)) {
              const items = ((value as any).items as any[])
                .map((item) => {
                  const amount = Number((item as any).amount) || 0;
                  const label = String((item as any).label || '').trim() || 'General';
                  const linkedCategory =
                    (item as any).linkedCategory && typeof (item as any).linkedCategory === 'string'
                      ? String((item as any).linkedCategory)
                      : undefined;
                  if (!Number.isFinite(amount) || amount <= 0) {
                    return null;
                  }
                  return {
                    id: String((item as any).id || uuidv4()),
                    label,
                    amount,
                    linkedCategory,
                  } as MonthlyBudgetItem;
                })
                .filter(Boolean) as MonthlyBudgetItem[];

              normalized[key] = items;
            }
          });
        }

        setBudgets(normalized);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PERSONAL_BUDGET_STORAGE_KEY, JSON.stringify(budgets));
    } catch {
    }
  }, [budgets]);

  const incomeRecords = useMemo(
    () =>
      records.filter((r) => {
        if (r.type !== 'income' || r.category === 'Préstamos') return false;
        const d = new Date(r.date);
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      }),
    [records, selectedYear, selectedMonth],
  );

  const expenseRecords = useMemo(
    () =>
      records.filter((r) => {
        if (r.type !== 'expense' || r.category === 'Préstamos / Deudas') return false;
        const d = new Date(r.date);
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      }),
    [records, selectedYear, selectedMonth],
  );

  const financingRecords = useMemo(
    () =>
      records.filter((r) => {
        const isFinancing =
          (r.type === 'income' && r.category === 'Préstamos') ||
          (r.type === 'expense' && r.category === 'Préstamos / Deudas');
        if (!isFinancing) return false;
        const d = new Date(r.date);
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      }),
    [records, selectedYear, selectedMonth],
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const selectedKey = useMemo(
    () => `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`,
    [selectedYear, selectedMonth],
  );

  const expenseCategories = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.type === 'expense' && r.category && r.category !== 'Préstamos / Deudas') {
        set.add(r.category);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const budgetItems = budgets[selectedKey] ?? [];
  const currentBudget = budgetItems.reduce((acc, item) => acc + item.amount, 0);

  const { monthlyExpense, monthlyExpenseByCategory } = useMemo(() => {
    const filtered = records.filter((r) => {
      if (r.type !== 'expense') return false;
      if (r.category === 'Préstamos / Deudas') return false;
      if (r.status !== 'paid') return false;
      const d = new Date(r.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });

    const byCategory: Record<string, number> = {};
    let total = 0;

    filtered.forEach((r) => {
      total += r.amount;
      const key = r.category || 'Sin categoría';
      byCategory[key] = (byCategory[key] || 0) + r.amount;
    });

    return {
      monthlyExpense: total,
      monthlyExpenseByCategory: byCategory,
    };
  }, [records, selectedYear, selectedMonth]);

  const filteredStats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let pendingIncome = 0;
    let pendingExpense = 0;

    incomeRecords.forEach((r) => {
      if (r.status === 'paid') {
        totalIncome += r.amount;
      } else {
        pendingIncome += r.amount;
      }
    });

    expenseRecords.forEach((r) => {
      if (r.status === 'paid') {
        totalExpense += r.amount;
      } else {
        pendingExpense += r.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      pendingIncome,
      pendingExpense,
      totalLabor: 0,
    };
  }, [incomeRecords, expenseRecords]);

  const remaining = currentBudget - monthlyExpense;
  const usedPercentage = currentBudget > 0 ? Math.min((monthlyExpense / currentBudget) * 100, 140) : 0;

  const handleAddBudgetItem = () => {
    const label = newItemLabel.trim();
    const rawAmount = newItemAmount.replace(',', '.');
    const amount = Number(rawAmount);

    if (!label || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    setBudgets((prev) => {
      const existing = prev[selectedKey] ?? [];
      const lowerLabel = label.toLowerCase();
      const autoLinkedCategory =
        expenseCategories.find((cat) => cat.toLowerCase() === lowerLabel) || undefined;
      return {
        ...prev,
        [selectedKey]: [
          ...existing,
          {
            id: uuidv4(),
            label,
            amount,
            linkedCategory: autoLinkedCategory,
          },
        ],
      };
    });

    setNewItemLabel('');
    setNewItemAmount('');
  };

  const handleUpdateBudgetItemAmount = (id: string, value: string) => {
    const raw = value.replace(',', '.');
    const amount = Number(raw);
    setBudgets((prev) => {
      const existing = prev[selectedKey] ?? [];
      return {
        ...prev,
        [selectedKey]: existing.map((item) =>
          item.id === id
            ? {
                ...item,
                amount: Number.isFinite(amount) && amount > 0 ? amount : 0,
              }
            : item,
        ),
      };
    });
  };

  const handleRemoveBudgetItem = (id: string) => {
    setBudgets((prev) => {
      const existing = prev[selectedKey] ?? [];
      const nextItems = existing.filter((item) => item.id !== id);
      return {
        ...prev,
        [selectedKey]: nextItems,
      };
    });
  };

  const handleLinkBudgetItemCategory = (id: string, category: string) => {
    setBudgets((prev) => {
      const existing = prev[selectedKey] ?? [];
      return {
        ...prev,
        [selectedKey]: existing.map((item) =>
          item.id === id
            ? {
                ...item,
                linkedCategory: category || undefined,
              }
            : item,
        ),
      };
    });
  };

  const handleCopyBudgetFromPreviousMonth = () => {
    let prevMonth = selectedMonth - 1;
    let prevYear = selectedYear;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = selectedYear - 1;
    }
    const prevKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;
    const prevItems = budgets[prevKey] ?? [];

    if (prevItems.length === 0) {
      alert('No hay presupuesto en el mes anterior para copiar.');
      return;
    }

    const newItems = prevItems.map((item) => ({
      ...item,
      id: uuidv4(),
    }));

    setBudgets((prev) => ({
      ...prev,
      [selectedKey]: newItems,
    }));
  };

  const handleCreateExpenseFromBudget = (item: MonthlyBudgetItem) => {
    const today = new Date();
    const dateForMonth = new Date(selectedYear, selectedMonth, Math.min(today.getDate(), 28));
    const isoDate = dateForMonth.toISOString().split('T')[0];

    const baseCategory = item.linkedCategory || item.label;

    const partial: Partial<FinanceRecord> = {
      type: 'expense',
      title: item.label,
      amount: item.amount,
      currency: 'PEN',
      status: 'paid',
      paymentMethod: 'cash',
      category: baseCategory,
      source: 'manual',
      date: isoDate,
    };

    setEditingId(null);
    setEditingRecord(partial);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: FinanceRecord) => {
    setEditingId(record.id);
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este registro personal? Esta acción afectará tus cálculos personales.')) {
      deleteRecord(id);
    }
  };

  const handleSave = (data: Partial<FinanceRecord>) => {
    if (editingId) {
      updateRecord(editingId, data);
    } else {
      addRecord(data as any);
    }
    setIsModalOpen(false);
  };

  const handleSaveFromInbox = (data: Partial<FinanceRecord>) => {
    addRecord(data as any);
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando finanzas personales...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Finanzas Personales
          </h1>
          <p className="text-muted-foreground mt-1">
            Control de ingresos, gastos y flujo de caja personal
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsInboxOpen(true)}
            className="gap-2 border-dashed border-primary/50 hover:border-primary text-primary hover:bg-primary/5"
          >
            <Inbox className="w-4 h-4" /> Inbox (Bot)
          </Button>
          <FinanceSyncButton
            records={allRecords}
            onSyncComplete={importRecords}
            storageKey="personal_finance_records"
            budgets={budgets}
            onBudgetsSyncComplete={setBudgets}
          />
          <Button onClick={handleCreate} className="gap-2 shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-4 h-4" /> Nuevo Registro
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg border border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Mes:</span>
            <select
              className="h-9 rounded-md border bg-background px-3 text-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {MONTH_LABELS.map((label, index) => (
                <option key={label} value={index}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Año:</span>
            <input
              type="number"
              className="h-9 w-24 rounded-md border bg-background px-3 text-sm"
              value={selectedYear}
              onChange={(e) => {
                const value = Number(e.target.value) || new Date().getFullYear();
                setSelectedYear(value);
              }}
              min={2000}
              max={2100}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="incomes" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted/50 p-1 w-full sm:w-auto grid grid-cols-2 sm:flex">
            <TabsTrigger value="budget" className="gap-2">
              <Wallet className="w-4 h-4" /> Presupuesto
            </TabsTrigger>
            <TabsTrigger value="incomes" className="gap-2">
              <TrendingUp className="w-4 h-4" /> Ingresos
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-2">
              <TrendingDown className="w-4 h-4" /> Gastos
            </TabsTrigger>
            <TabsTrigger value="financing" className="gap-2">
              <Landmark className="w-4 h-4" /> Financiamiento
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-2">
              <PieChart className="w-4 h-4" /> Resumen
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="budget" className="mt-0">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Presupuesto mensual</h2>
                <p className="text-sm text-muted-foreground">
                  Define un límite de gastos por mes y compara con lo que ya has gastado.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {budgetItems.length === 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyBudgetFromPreviousMonth}
                    className="mr-2"
                  >
                    Copiar del mes anterior
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Nuevo ítem:</span>
                  <input
                    className="h-9 rounded-md border bg-background px-2 text-xs w-32"
                    placeholder="Ej. Comida"
                    value={newItemLabel}
                    onChange={(e) => setNewItemLabel(e.target.value)}
                  />
                  <div className="flex items-center rounded-md border bg-background px-2 h-9">
                    <span className="text-xs mr-1 text-muted-foreground">S/</span>
                    <input
                      type="number"
                      className="w-24 bg-transparent text-sm outline-none"
                      placeholder="0"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value)}
                      min={0}
                      step={10}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="ml-1 text-xs"
                    onClick={handleAddBudgetItem}
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg divide-y bg-muted/40">
              <div className="grid grid-cols-12 px-4 py-2 text-[11px] text-muted-foreground">
                <div className="col-span-5">Ítem de presupuesto</div>
                <div className="col-span-3 text-right">Presupuesto</div>
                <div className="col-span-4 text-right">Gastado (real)</div>
              </div>
              {budgetItems.length === 0 ? (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  Aún no tienes ítems de presupuesto para este mes. Agrega categorías como comida, gimnasio, transporte, etc.
                </div>
              ) : (
                budgetItems.map((item) => {
                  const spentForItem =
                    item.linkedCategory && monthlyExpenseByCategory[item.linkedCategory]
                      ? monthlyExpenseByCategory[item.linkedCategory]
                      : 0;
                  const diff = item.amount - spentForItem;
                  return (
                    <div key={item.id} className="grid grid-cols-12 px-4 py-3 items-center gap-2">
                      <div className="col-span-5 text-sm truncate" title={item.label}>
                        <div className="font-medium truncate">{item.label}</div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>Vincular a categoría:</span>
                          <select
                            className="h-7 rounded-md border bg-background px-2 text-[11px] max-w-[160px]"
                            value={item.linkedCategory || ''}
                            onChange={(e) => handleLinkBudgetItemCategory(item.id, e.target.value)}
                          >
                            <option value="">Sin categoría</option>
                            {expenseCategories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-3 flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">S/</span>
                          <input
                            type="number"
                            className="w-24 bg-background border rounded-md px-2 py-1 text-sm text-right"
                            value={item.amount}
                            min={0}
                            step={10}
                            onChange={(e) => handleUpdateBudgetItemAmount(item.id, e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="text-[11px] text-muted-foreground hover:text-destructive underline-offset-2 hover:underline"
                          onClick={() => handleRemoveBudgetItem(item.id)}
                        >
                          Quitar
                        </button>
                      </div>
                      <div className="col-span-4 flex flex-col items-end gap-1">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm">
                            {item.linkedCategory
                              ? formatCurrency(spentForItem)
                              : formatCurrency(0)}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] px-2"
                            onClick={() => handleCreateExpenseFromBudget(item)}
                          >
                            Registrar gasto
                          </Button>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.linkedCategory
                            ? diff >= 0
                              ? `Te quedan ${formatCurrency(diff)} en esta categoría`
                              : `Te pasaste ${formatCurrency(Math.abs(diff))}`
                            : 'Sin categoría vinculada, solo se muestra presupuesto.'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Presupuesto definido</div>
                <div className="text-2xl font-semibold">
                  {currentBudget > 0 ? formatCurrency(currentBudget) : 'Sin definir'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Se guarda solo para este mes y año en tus finanzas personales.
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Gasto del mes</div>
                <div className="text-2xl font-semibold text-rose-600">
                  {monthlyExpense > 0 ? formatCurrency(monthlyExpense) : formatCurrency(0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Solo se consideran gastos pagados que no son préstamos ni deudas.
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {remaining >= 0 ? 'Disponible' : 'Te pasaste del presupuesto'}
                </div>
                <div
                  className={`text-2xl font-semibold ${
                    remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {currentBudget > 0 ? formatCurrency(Math.abs(remaining)) : formatCurrency(0)}
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      remaining >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${usedPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {currentBudget > 0
                    ? `Has usado ${Math.min(
                        (monthlyExpense / (currentBudget || 1)) * 100,
                        999,
                      ).toFixed(1)}% de tu presupuesto de este mes.`
                    : 'Define un presupuesto para comenzar a controlar tu mes.'}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incomes" className="mt-0">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Ingresos</h2>
            </div>
            <FinanceTable records={incomeRecords} onEdit={handleEdit} onDelete={handleDelete} onUpdate={updateRecord} />
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="mt-0">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gastos</h2>
            </div>
            <FinanceTable records={expenseRecords} onEdit={handleEdit} onDelete={handleDelete} onUpdate={updateRecord} />
          </div>
        </TabsContent>

        <TabsContent value="financing" className="mt-0">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Financiamiento (Préstamos y Deudas)</h2>
            </div>
            <FinanceTable records={financingRecords} onEdit={handleEdit} onDelete={handleDelete} onUpdate={updateRecord} />
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-0 space-y-6">
          <FinanceStats stats={filteredStats} mode="personal" />
          <FinanceSummary records={allRecords} mode="personal" />
        </TabsContent>
      </Tabs>

      <FinanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={editingRecord}
        onSave={handleSave}
        categoryStorageKey="personal_finance_categories_config_v1"
      />
      <InboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        onSave={handleSaveFromInbox}
        mode="personal"
      />
    </div>
  );
}
