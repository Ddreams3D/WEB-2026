import { useState, useEffect, useRef } from 'react';
import { FinanceRecord, TransactionType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock initial data for demonstration if empty (módulo de empresa)
const INITIAL_DATA: FinanceRecord[] = [];

const COMPANY_STORAGE_KEY = 'finance_records';
const PERSONAL_STORAGE_KEY = 'personal_finance_records';
const OWNER_WITHDRAW_CATEGORY = 'Retiros del dueño / Finanzas personales';
const PERSONAL_INCOME_FROM_COMPANY_CATEGORY = 'Ingreso desde Ddreams 3D';

export function useFinances(
  storageKey: string = 'finance_records',
  initialData: FinanceRecord[] = INITIAL_DATA,
) {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const initialDataRef = useRef<FinanceRecord[]>(initialData);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setRecords(JSON.parse(stored));
        } else {
          // Initialize with some data if empty for first time
          setRecords(initialDataRef.current);
          localStorage.setItem(storageKey, JSON.stringify(initialDataRef.current));
        }
      } catch (error) {
        console.error('Error loading finance records:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [storageKey]);

  // Save to localStorage whenever records change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [records, loading, storageKey]);

  const addRecord = (record: Omit<FinanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();

    const newRecord: FinanceRecord = {
      ...record,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    setRecords(prev => [newRecord, ...prev]);

    if (
      storageKey === COMPANY_STORAGE_KEY &&
      newRecord.type === 'expense' &&
      newRecord.category === OWNER_WITHDRAW_CATEGORY
    ) {
      try {
        const personalRaw = localStorage.getItem(PERSONAL_STORAGE_KEY);
        const personalRecords: FinanceRecord[] = personalRaw ? JSON.parse(personalRaw) : [];

        const personalRecord: FinanceRecord = {
          id: uuidv4(),
          date: newRecord.date,
          type: 'income',
          title: 'Ingreso desde Ddreams 3D',
          clientName: 'Ddreams 3D',
          clientContact: newRecord.clientContact,
          clientRuc: newRecord.clientRuc,
          amount: newRecord.amount,
          currency: newRecord.currency,
          status: newRecord.status,
          paymentMethod: newRecord.paymentMethod,
          category: PERSONAL_INCOME_FROM_COMPANY_CATEGORY,
          source: 'manual',
          items: newRecord.items,
          notes: newRecord.notes,
          createdAt: now,
          updatedAt: now,
          relatedOrderId: newRecord.relatedOrderId,
          expenseType: undefined,
          paymentPhase: 'full',
        };

        const updatedPersonal = [personalRecord, ...personalRecords];
        localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify(updatedPersonal));
      } catch (error) {
        console.error('Error creando registro espejo en finanzas personales:', error);
      }
    }

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
    setRecords(prev => prev.map(record => 
      record.id === id 
        ? { ...record, _deleted: true, updatedAt: Date.now() } 
        : record
    ));
  };

  const importRecords = (newRecords: FinanceRecord[]) => {
    setRecords(newRecords);
  };

  const getStats = () => {
    const activeRecords = records.filter(r => !r._deleted);
    
    const totalIncome = activeRecords
      .filter(r => r.type === 'income' && r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);
      
    const totalExpense = activeRecords
      .filter(r => r.type === 'expense' && r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);

    const pendingIncome = activeRecords
      .filter(r => r.type === 'income' && r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);

    const pendingExpense = activeRecords
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
    records: records.filter(r => !r._deleted),
    allRecords: records,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    importRecords,
    stats: getStats()
  };
}
