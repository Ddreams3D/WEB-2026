import { useState, useEffect } from 'react';
import { FinanceRecord, FinanceItem, TransactionType } from '../types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_ITEM: FinanceItem = {
  id: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
  total: 0
};

const DEFAULT_FORM: Partial<FinanceRecord> = {
  type: 'income',
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  currency: 'PEN',
  status: 'paid',
  items: [],
  amount: 0
};

export function useFinanceForm(initialData?: FinanceRecord | null) {
  const [formData, setFormData] = useState<Partial<FinanceRecord>>(DEFAULT_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date.split('T')[0] // Ensure date format for input
      });
    } else {
      setFormData({
        ...DEFAULT_FORM,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const updateField = (field: keyof FinanceRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Item Management
  const addItem = () => {
    const newItem = { ...DEFAULT_ITEM, id: uuidv4() };
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const updateItem = (id: string, field: keyof FinanceItem, value: any) => {
    setFormData(prev => {
      const newItems = [...(prev.items || [])];
      const index = newItems.findIndex(item => item.id === id);
      if (index === -1) return prev;

      const item = { ...newItems[index], [field]: value };
      
      // Auto-calculate total
      if (field === 'quantity' || field === 'unitPrice') {
        item.total = item.quantity * item.unitPrice;
      }
      
      newItems[index] = item;
      
      // Auto-calculate total amount
      const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
      
      return { ...prev, items: newItems, amount: totalAmount };
    });
  };

  const removeItem = (id: string) => {
    setFormData(prev => {
      const newItems = (prev.items || []).filter(item => item.id !== id);
      const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
      return { ...prev, items: newItems, amount: totalAmount };
    });
  };

  return {
    formData,
    updateField,
    addItem,
    updateItem,
    removeItem,
    setFormData
  };
}
