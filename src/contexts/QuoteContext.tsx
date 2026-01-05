'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Quote, QuoteItem, MaterialPricing } from '@/features/quotes/types';

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
  // Mock implementation for disabled feature
  const value: QuoteContextType = {
    currentQuote: null,
    quotes: [],
    materials: [],
    loading: false,
    
    createQuote: (title, description) => ({
      id: 'temp-id',
      title,
      description,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [],
      total: 0,
      currency: 'PEN'
    }),
    addItemToQuote: () => {},
    removeItemFromQuote: () => {},
    updateQuoteItem: () => {},
    calculateItemPrice: () => ({ unitPrice: 0, totalPrice: 0 }),
    
    saveQuote: async () => true,
    submitQuote: async () => true,
    updateQuote: async () => true,
    deleteQuote: async () => true,
    loadQuotes: async () => {},
    getQuoteById: () => null,
    
    estimatePrintTime: () => 0,
    calculateVolume: () => 0,
    getComplexityFromFile: () => 'low'
  };

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
};

export default QuoteProvider;

// Export types for external use
export type { Quote, QuoteItem } from '@/features/quotes/types';
export type { QuoteStatus } from '@/features/quotes/types';
