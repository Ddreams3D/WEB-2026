'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, List, BarChart3, TrendingUp, TrendingDown, Landmark, PieChart, Inbox, Settings, Calculator, Receipt } from 'lucide-react';
import { useFinances } from './hooks/useFinances';
import { FinanceTable } from './components/FinanceTable';
import { FinanceStats } from './components/FinanceStats';
import { FinanceSummary } from './components/FinanceSummary';
import { FinanceSyncButton } from './components/FinanceSyncButton';
import { FinanceModal } from './FinanceModal';
import { FinanceSettingsModal } from './components/FinanceSettingsModal';
import { InboxModal } from './components/InboxModal';
import { FinanceRecord } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useRouter } from 'next/navigation';

import { useFinanceSettings } from './hooks/useFinanceSettings';
import { QuoterForm } from '../quoter/components/QuoterForm';
import { QuoterResults } from '../quoter/components/QuoterResults';

export function FinancesView() {
  const { records, allRecords, importRecords, loading, addRecord, updateRecord, deleteRecord, stats } = useFinances();
  const { settings, updateSettings, importSettings } = useFinanceSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinanceRecord | null>(null);
  
  // Quoter state
  const [quoteData, setQuoteData] = useState<any>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCalculateQuote = (data: any) => {
    setQuoteData(data);
  };

  // Check for URL param to open inbox
  useEffect(() => {
    if (searchParams.get('inbox') === 'open') {
      setIsInboxOpen(true);
      // Clean up URL without refresh
      router.replace('/admin/finanzas');
    }
  }, [searchParams, router]);

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
  
  // Handler for saving from Inbox
  const handleSaveFromInbox = (data: Partial<FinanceRecord>) => {
    addRecord(data as any);
    // Don't close modal here, it's handled by InboxModal internal flow or user closing it
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando datos financieros...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Finanzas Ddreams 3D
          </h1>
          <p className="text-muted-foreground mt-1">
            Control de ingresos, gastos y flujo de caja del negocio
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="text-muted-foreground hover:text-foreground"
            title="Configuración de Costos"
          >
            <Settings className="w-5 h-5" />
          </Button>

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
            storageKey="finance_records"
            settings={settings}
            onSettingsSyncComplete={importSettings}
          />
          <Button onClick={handleCreate} className="gap-2 shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-4 h-4" /> Nuevo Registro
          </Button>
        </div>
      </div>

      <Tabs defaultValue="quoter" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted/50 p-1 w-full sm:w-auto grid grid-cols-2 sm:flex">
            <TabsTrigger value="quoter" className="gap-2">
              <Calculator className="w-4 h-4" /> Cotizador
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

        <TabsContent value="quoter" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-muted-foreground" />
                        Parámetros del Trabajo
                    </h2>
                    <QuoterForm onCalculate={handleCalculateQuote} settings={settings} />
                </div>
            </div>

            <div className="lg:col-span-7">
                  {quoteData ? (
                      <QuoterResults data={quoteData} settings={settings} />
                  ) : (
                      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-muted/10 border border-dashed border-border rounded-xl p-8 text-center">
                          <Calculator className="w-12 h-12 mb-4 opacity-20" />
                          <h3 className="text-lg font-medium mb-1">Listo para calcular</h3>
                          <p className="max-w-xs mx-auto text-sm">
                              Ingresa los detalles del modelo (tiempo, peso) para ver el desglose de costos y precio sugerido.
                          </p>
                      </div>
                  )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incomes" className="mt-0">
          <div className="grid gap-6">
            <FinanceStats stats={stats} />
            <FinanceTable 
              records={incomeRecords} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onUpdate={updateRecord}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-0">
          <div className="grid gap-6">
            <FinanceStats stats={stats} />
            <FinanceTable 
              records={expenseRecords} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onUpdate={updateRecord}
            />
          </div>
        </TabsContent>

        <TabsContent value="financing" className="mt-0">
          <div className="grid gap-6">
             <div className="bg-muted/30 p-4 rounded-lg border border-dashed mb-4">
               <h3 className="font-semibold flex items-center gap-2">
                 <Landmark className="w-4 h-4 text-primary" />
                 Gestión de Deudas y Préstamos
               </h3>
               <p className="text-sm text-muted-foreground mt-1">
                 Aquí se registran movimientos de capital externo (préstamos recibidos o pagados) que no afectan directamente la utilidad operativa, pero sí el flujo de caja.
               </p>
             </div>
            <FinanceTable 
              records={financingRecords} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onUpdate={updateRecord}
            />
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-0">
          <FinanceSummary records={allRecords} />
        </TabsContent>
      </Tabs>

      <FinanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={editingRecord}
        onSave={handleSave}
        settings={settings}
      />
      
      <FinanceSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onUpdate={updateSettings}
      />

      <InboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        onSave={handleSaveFromInbox}
        mode="business"
      />
    </div>
  );
}
