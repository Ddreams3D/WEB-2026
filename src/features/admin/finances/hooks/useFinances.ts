import { useState, useEffect } from 'react';
import { FinanceRecord, TransactionType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock initial data for demonstration if empty
const INITIAL_DATA: FinanceRecord[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    type: 'income',
    title: 'Impresión 3D Prototipo',
    clientName: 'Cliente Ejemplo',
    amount: 150.00,
    currency: 'PEN',
    status: 'paid',
    paymentMethod: 'yape',
    category: 'Servicio de Impresión 3D',
    source: 'whatsapp',
    items: [
      { id: '1-1', description: 'Pieza PLA Negro', quantity: 1, unitPrice: 150, total: 150 }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export function useFinances() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem('finance_records');
        if (stored) {
          setRecords(JSON.parse(stored));
        } else {
          // Initialize with some data if empty for first time
          setRecords(INITIAL_DATA);
          localStorage.setItem('finance_records', JSON.stringify(INITIAL_DATA));
        }
      } catch (error) {
        console.error('Error loading finance records:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever records change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('finance_records', JSON.stringify(records));
    }
  }, [records, loading]);

  const addRecord = (record: Omit<FinanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: FinanceRecord = {
      ...record,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  const updateRecord = (id: string, updates: Partial<FinanceRecord>) => {
    setRecords(prev => prev.map(record => 
      record.id === id 
        ? { ...record, ...updates, updatedAt: Date.now() } 
        : record
    ));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  const getStats = () => {
    const totalIncome = records
      .filter(r => r.type === 'income' && r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);
      
    const totalExpense = records
      .filter(r => r.type === 'expense' && r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);

    const pendingIncome = records
      .filter(r => r.type === 'income' && r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);

    const pendingExpense = records
      .filter(r => r.type === 'expense' && r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      pendingIncome,
      pendingExpense
    };
  };

  return {
    records,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    stats: getStats()
  };
}
