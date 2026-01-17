'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Landmark, PieChart, Inbox } from 'lucide-react';
import { useFinances } from './hooks/useFinances';
import { FinanceTable } from './components/FinanceTable';
import { FinanceStats } from './components/FinanceStats';
import { FinanceSummary } from './components/FinanceSummary';
import { FinanceSyncButton } from './components/FinanceSyncButton';
import { FinanceModal } from './FinanceModal';
import { InboxModal } from './components/InboxModal';
import { FinanceRecord } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PersonalFinancesView() {
  const { records, allRecords, importRecords, loading, addRecord, updateRecord, deleteRecord, stats } = useFinances(
    'personal_finance_records',
    [],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinanceRecord | null>(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  const incomeRecords = useMemo(
    () => records.filter((r) => r.type === 'income' && r.category !== 'Préstamos'),
    [records],
  );

  const expenseRecords = useMemo(
    () => records.filter((r) => r.type === 'expense' && r.category !== 'Préstamos / Deudas'),
    [records],
  );

  const financingRecords = useMemo(
    () =>
      records.filter(
        (r) =>
          (r.type === 'income' && r.category === 'Préstamos') ||
          (r.type === 'expense' && r.category === 'Préstamos / Deudas'),
      ),
    [records],
  );

  const handleCreate = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: FinanceRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este registro personal? Esta acción afectará tus cálculos personales.')) {
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
          <FinanceSyncButton 
            records={allRecords} 
            onSyncComplete={importRecords} 
            storageKey="personal_finance_records" 
          />
          <Button 
            variant="outline" 
            onClick={() => setIsInboxOpen(true)}
            className="gap-2 border-dashed border-primary/50 hover:border-primary text-primary hover:bg-primary/5"
          >
            <Inbox className="w-4 h-4" /> Inbox (Bot)
          </Button>
          <Button onClick={handleCreate} className="gap-2 shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-4 h-4" /> Nuevo Registro
          </Button>
        </div>
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
            <FinanceTable records={incomeRecords} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="mt-0">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gastos</h2>
            </div>
            <FinanceTable records={expenseRecords} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </TabsContent>

        <TabsContent value="financing" className="mt-0">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Financiamiento (Préstamos y Deudas)</h2>
            </div>
            <FinanceTable records={financingRecords} onEdit={handleEdit} onDelete={handleDelete} />
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
      <InboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        onSave={handleSaveFromInbox}
        mode="personal"
      />
    </div>
  );
}
