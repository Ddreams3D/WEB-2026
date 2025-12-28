'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuoteItem {
  id: string;
  fileName: string;
  fileUrl: string;
  material: string;
  quantity: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  volume: number; // cm³
  weight: number; // gramos estimados
  complexity: 'low' | 'medium' | 'high';
  printTime: number; // horas estimadas
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface Quote {
  id: string;
  title: string;
  description: string;
  items: QuoteItem[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  approvedBy?: string;
  rejectionReason?: string;
}

interface MaterialPricing {
  material: string;
  pricePerGram: number;
  setupCost: number;
  complexityMultiplier: {
    low: number;
    medium: number;
    high: number;
  };
}

interface QuoteContextType {
  // Estado
  currentQuote: Quote | null;
  quotes: Quote[];
  materials: MaterialPricing[];
  loading: boolean;
  
  // Funciones de cotización
  createQuote: (title: string, description: string) => Quote;
  addItemToQuote: (item: Omit<QuoteItem, 'id' | 'unitPrice' | 'totalPrice'>) => void;
  removeItemFromQuote: (itemId: string) => void;
  updateQuoteItem: (itemId: string, updates: Partial<QuoteItem>) => void;
  calculateItemPrice: (item: Omit<QuoteItem, 'id' | 'unitPrice' | 'totalPrice'>) => { unitPrice: number; totalPrice: number };
  
  // Gestión de cotizaciones
  saveQuote: (quote: Quote) => Promise<boolean>;
  submitQuote: (quoteId: string) => Promise<boolean>;
  updateQuote: (quoteId: string, updates: Partial<Quote>) => Promise<boolean>;
  deleteQuote: (quoteId: string) => Promise<boolean>;
  loadQuotes: () => Promise<void>;
  getQuoteById: (id: string) => Quote | null;
  
  // Utilidades
  estimatePrintTime: (volume: number, complexity: string) => number;
  calculateVolume: (dimensions: { length: number; width: number; height: number }) => number;
  getComplexityFromFile: (fileName: string) => 'low' | 'medium' | 'high';
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};

interface QuoteProviderProps {
  children: ReactNode;
}

export const QuoteProvider: React.FC<QuoteProviderProps> = ({ children }) => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  // Precios de materiales (mock data)
  const materials: MaterialPricing[] = [
    {
      material: 'PLA',
      pricePerGram: 0.08,
      setupCost: 5.00,
      complexityMultiplier: { low: 1.0, medium: 1.2, high: 1.5 }
    },
    {
      material: 'ABS',
      pricePerGram: 0.10,
      setupCost: 7.00,
      complexityMultiplier: { low: 1.1, medium: 1.3, high: 1.6 }
    },
    {
      material: 'PETG',
      pricePerGram: 0.12,
      setupCost: 8.00,
      complexityMultiplier: { low: 1.2, medium: 1.4, high: 1.7 }
    },
    {
      material: 'TPU',
      pricePerGram: 0.15,
      setupCost: 10.00,
      complexityMultiplier: { low: 1.3, medium: 1.6, high: 2.0 }
    }
  ];

  const createQuote = (title: string, description: string): Quote => {
    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      title,
      description,
      items: [],
      status: 'draft',
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user' // Obtener del contexto de auth
    };
    
    setCurrentQuote(newQuote);
    return newQuote;
  };

  const calculateItemPrice = (item: Omit<QuoteItem, 'id' | 'unitPrice' | 'totalPrice'>) => {
    const materialPricing = materials.find(m => m.material === item.material);
    if (!materialPricing) {
      return { unitPrice: 0, totalPrice: 0 };
    }

    const basePrice = item.weight * materialPricing.pricePerGram;
    const complexityMultiplier = materialPricing.complexityMultiplier[item.complexity];
    const setupCost = materialPricing.setupCost;
    
    const unitPrice = (basePrice * complexityMultiplier) + (setupCost / item.quantity);
    const totalPrice = unitPrice * item.quantity;
    
    return {
      unitPrice: Math.round(unitPrice * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100
    };
  };

  const addItemToQuote = (itemData: Omit<QuoteItem, 'id' | 'unitPrice' | 'totalPrice'>) => {
    if (!currentQuote) return;
    
    const pricing = calculateItemPrice(itemData);
    const newItem: QuoteItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      ...pricing
    };
    
    const updatedItems = [...currentQuote.items, newItem];
    const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.18; // IGV 18%
    const total = subtotal + tax;
    
    const updatedQuote = {
      ...currentQuote,
      items: updatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      updatedAt: new Date().toISOString()
    };
    
    setCurrentQuote(updatedQuote);
  };

  const removeItemFromQuote = (itemId: string) => {
    if (!currentQuote) return;
    
    const updatedItems = currentQuote.items.filter(item => item.id !== itemId);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    
    const updatedQuote = {
      ...currentQuote,
      items: updatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      updatedAt: new Date().toISOString()
    };
    
    setCurrentQuote(updatedQuote);
  };

  const updateQuoteItem = (itemId: string, updates: Partial<QuoteItem>) => {
    if (!currentQuote) return;
    
    const updatedItems = currentQuote.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, ...updates };
        if ('material' in updates || 'quantity' in updates || 'complexity' in updates || 'weight' in updates) {
          const pricing = calculateItemPrice(updatedItem);
          return { ...updatedItem, ...pricing };
        }
        return updatedItem;
      }
      return item;
    });
    
    const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    
    const updatedQuote = {
      ...currentQuote,
      items: updatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      updatedAt: new Date().toISOString()
    };
    
    setCurrentQuote(updatedQuote);
  };

  const saveQuote = async (quote: Quote): Promise<boolean> => {
    try {
      setLoading(true);
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingIndex = quotes.findIndex(q => q.id === quote.id);
      if (existingIndex >= 0) {
        const updatedQuotes = [...quotes];
        updatedQuotes[existingIndex] = quote;
        setQuotes(updatedQuotes);
      } else {
        setQuotes(prev => [...prev, quote]);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving quote:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitQuote = async (quoteId: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedQuotes = quotes.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'pending' as const, updatedAt: new Date().toISOString() }
          : quote
      );
      
      setQuotes(updatedQuotes);
      
      if (currentQuote?.id === quoteId) {
        setCurrentQuote(prev => prev ? { ...prev, status: 'pending' } : null);
      }
      
      return true;
    } catch (error) {
      console.error('Error submitting quote:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuote = async (quoteId: string, updates: Partial<Quote>): Promise<boolean> => {
    try {
      setLoading(true);
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedQuotes = quotes.map(quote => 
        quote.id === quoteId 
          ? { ...quote, ...updates, updatedAt: new Date().toISOString() }
          : quote
      );
      
      setQuotes(updatedQuotes);
      
      if (currentQuote?.id === quoteId) {
        setCurrentQuote(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating quote:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuote = async (quoteId: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simular eliminación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedQuotes = quotes.filter(quote => quote.id !== quoteId);
      setQuotes(updatedQuotes);
      
      if (currentQuote?.id === quoteId) {
        setCurrentQuote(null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting quote:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadQuotes = async (): Promise<void> => {
    try {
      setLoading(true);
      // Simular carga de cotizaciones
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockQuotes: Quote[] = [
        {
          id: 'quote-1',
          title: 'Prototipos Automotrices',
          description: 'Piezas de prototipado para nuevo modelo',
          items: [],
          status: 'approved',
          subtotal: 1500.00,
          discount: 0,
          tax: 270.00,
          total: 1770.00,
          validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'user-1',
          approvedBy: 'admin-1'
        }
      ];
      
      setQuotes(mockQuotes);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuoteById = (id: string): Quote | null => {
    return quotes.find(quote => quote.id === id) || null;
  };

  const estimatePrintTime = (volume: number, complexity: string): number => {
    const baseTimePerCm3 = 0.5; // horas por cm³
    const complexityMultipliers = { low: 1, medium: 1.5, high: 2.5 };
    const multiplier = complexityMultipliers[complexity as keyof typeof complexityMultipliers] || 1;
    
    return Math.round((volume * baseTimePerCm3 * multiplier) * 100) / 100;
  };

  const calculateVolume = (dimensions: { length: number; width: number; height: number }): number => {
    return Math.round((dimensions.length * dimensions.width * dimensions.height) * 100) / 100;
  };

  const getComplexityFromFile = (fileName: string): 'low' | 'medium' | 'high' => {
    // Lógica simple basada en el nombre del archivo
    const name = fileName.toLowerCase();
    if (name.includes('complex') || name.includes('detailed') || name.includes('intricate')) {
      return 'high';
    } else if (name.includes('medium') || name.includes('moderate')) {
      return 'medium';
    }
    return 'low';
  };

  const value: QuoteContextType = {
    currentQuote,
    quotes,
    materials,
    loading,
    createQuote,
    addItemToQuote,
    removeItemFromQuote,
    updateQuoteItem,
    calculateItemPrice,
    saveQuote,
    submitQuote,
    updateQuote,
    deleteQuote,
    loadQuotes,
    getQuoteById,
    estimatePrintTime,
    calculateVolume,
    getComplexityFromFile
  };

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
};

export default QuoteProvider;

// Export types for external use
export type { Quote, QuoteItem };
export type QuoteStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';