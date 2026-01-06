'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, List, BarChart3, TrendingUp, TrendingDown, Landmark, PieChart } from 'lucide-react';
import { useFinances } from './hooks/useFinances';
import { FinanceTable } from './components/FinanceTable';
import { FinanceStats } from './components/FinanceStats';
import { FinanceSummary } from './components/FinanceSummary';
import { FinanceModal } from './FinanceModal';
import { FinanceRecord } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function FinancesView() {
  const { records, loading, addRecord, updateRecord, deleteRecord, stats } = useFinances();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinanceRecord | null>(null);

  // Filter records for each tab
  const incomeRecords = useMemo(() => 
    records.filter(r => r.type === 'income' && r.category !== 'Préstamos'),
  [records]);

  const expenseRecords = useMemo(() => 
    records.filter(r => r.type === 'expense' && r.category !== 'Préstamos / Deudas'),
  [records]);

  const financingRecords = useMemo(() => 
    records.filter(r => 
      (r.type === 'income' && r.category === 'Préstamos') ||
      (r.type === 'expense' && r.category === 'Préstamos / Deudas')
    ),
  [records]);

  const handleCreate = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: FinanceRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este registro? Esta acción afectará los cálculos financieros.')) {
      deleteRecord(id);
    }
  };

  const handleSave = (data: Partial<FinanceRecord>) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data);
    } else {
      addRecord(data as any);
    }
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando datos financieros...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Finanzas y Transacciones
          </h1>
          <p className="text-muted-foreground mt-1">
            Control de ingresos, gastos y flujo de caja
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" /> Nuevo Registro
        </Button>
      </div>

      <Tabs defaultValue="incomes" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted/50 p-1 w-full sm:w-auto grid grid-cols-2 sm:flex">
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

        <TabsContent value="incomes" className="mt-0">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Ingresos</h2>
            </div>
            <FinanceTable 
              records={incomeRecords} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="mt-0">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gastos</h2>
            </div>
            <FinanceTable 
              records={expenseRecords} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </div>
        </TabsContent>

        <TabsContent value="financing" className="mt-0">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Financiamiento (Préstamos y Deudas)</h2>
            </div>
            <FinanceTable 
              records={financingRecords} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-0 space-y-6">
          <FinanceStats stats={stats} />
          <FinanceSummary records={records} />
        </TabsContent>
      </Tabs>

      <FinanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        record={editingRecord}
        onSave={handleSave}
      />
    </div>
  );
}
