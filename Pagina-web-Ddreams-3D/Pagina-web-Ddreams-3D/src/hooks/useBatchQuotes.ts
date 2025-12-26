'use client';

import { useState, useCallback } from 'react';
import { useQuote } from '@/contexts/QuoteContext';
import { useB2B } from '@/contexts/B2BContext';
import { Quote, QuoteItem, QuoteStatus } from '@/contexts/QuoteContext';

interface BatchQuoteFilters {
  status?: QuoteStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
  tags?: string[];
}

interface BatchQuoteStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
}

interface BatchQuoteActions {
  createBatchQuote: (items: Omit<QuoteItem, 'id'>[]) => Promise<Quote>;
  duplicateQuote: (quoteId: string) => Promise<Quote>;
  bulkUpdateStatus: (quoteIds: string[], status: QuoteStatus) => Promise<void>;
  bulkDelete: (quoteIds: string[]) => Promise<void>;
  exportQuotes: (quoteIds: string[], format: 'csv' | 'pdf' | 'excel') => Promise<void>;
  calculateBatchTotal: (items: QuoteItem[]) => number;
  applyBulkDiscount: (quoteIds: string[], discount: number) => Promise<void>;
  sendBulkQuotes: (quoteIds: string[]) => Promise<void>;
}

interface UseBatchQuotesState {
  quotes: Quote[];
  filteredQuotes: Quote[];
  selectedQuotes: string[];
  filters: BatchQuoteFilters;
  stats: BatchQuoteStats;
  isLoading: boolean;
  error: string | null;
  sortBy: 'date' | 'amount' | 'status' | 'client';
  sortOrder: 'asc' | 'desc';
}

type UseBatchQuotesReturn = UseBatchQuotesState & BatchQuoteActions & {
  setFilters: (filters: Partial<BatchQuoteFilters>) => void;
  setSortBy: (sortBy: UseBatchQuotesState['sortBy']) => void;
  setSortOrder: (sortOrder: UseBatchQuotesState['sortOrder']) => void;
  toggleQuoteSelection: (quoteId: string) => void;
  selectAllQuotes: () => void;
  clearSelection: () => void;
  refreshQuotes: () => Promise<void>;
};

/**
 * Hook personalizado para manejar cotizaciones en lote
 * Proporciona funcionalidades avanzadas para usuarios B2B
 */
export const useBatchQuotes = (): UseBatchQuotesReturn => {
  const { 
    quotes, 
    createQuote, 
    // TODO: Implementar estas funciones en QuoteContext
    // updateQuote, 
    // deleteQuote, 
    // sendQuote,
    loadQuotes 
  } = useQuote();
  const { currentCompany } = useB2B();
  
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [filters, setFiltersState] = useState<BatchQuoteFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<UseBatchQuotesState['sortBy']>('date');
  const [sortOrder, setSortOrder] = useState<UseBatchQuotesState['sortOrder']>('desc');

  // Filtrar cotizaciones por empresa actual
  const filteredQuotesByCompany = quotes.filter(quote => 
    currentCompany ? quote.companyId === currentCompany.id : true
  );

  // Aplicar filtros y ordenamiento
  const filteredQuotes = useCallback(() => {
    let filtered = [...filteredQuotesByCompany];

    // Aplicar filtros
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(quote => filters.status!.includes(quote.status));
    }

    if (filters.dateRange) {
      filtered = filtered.filter(quote => {
        const quoteDate = new Date(quote.createdAt);
        return quoteDate >= filters.dateRange!.start && quoteDate <= filters.dateRange!.end;
      });
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(quote => quote.total >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(quote => quote.total <= filters.maxAmount!);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(quote => 
        quote.title.toLowerCase().includes(searchLower) ||
        quote.description.toLowerCase().includes(searchLower)
      );
    }

    // TODO: Implementar filtrado por tags cuando se agregue la propiedad al tipo Quote
    // if (filters.tags && filters.tags.length > 0) {
    //   filtered = filtered.filter(quote => 
    //     filters.tags!.some(tag => quote.tags?.includes(tag))
    //   );
    // }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.total - b.total;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'client':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [filteredQuotesByCompany, filters, sortBy, sortOrder]);

  // Calcular estadísticas
  const stats = useCallback((): BatchQuoteStats => {
    const total = filteredQuotesByCompany.length;
    const pending = filteredQuotesByCompany.filter(q => q.status === 'pending').length;
    const approved = filteredQuotesByCompany.filter(q => q.status === 'approved').length;
    const rejected = filteredQuotesByCompany.filter(q => q.status === 'rejected').length;
    const totalValue = filteredQuotesByCompany.reduce((sum, q) => sum + q.total, 0);
    const averageValue = total > 0 ? totalValue / total : 0;
    const conversionRate = total > 0 ? (approved / total) * 100 : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      totalValue,
      averageValue,
      conversionRate
    };
  }, [filteredQuotesByCompany]);

  /**
   * Crear cotización en lote
   */
  const createBatchQuote = async (items: Omit<QuoteItem, 'id'>[]): Promise<Quote> => {
    if (!currentCompany) {
      throw new Error('No hay empresa seleccionada');
    }

    setIsLoading(true);
    setError(null);

    try {
      const quoteData = {
        companyId: currentCompany.id,
        clientName: currentCompany.name,
        clientEmail: currentCompany.email,
        title: `Cotización en lote - ${new Date().toLocaleDateString()}`,
        description: 'Cotización generada en lote',
        items: items.map((item, index) => ({
          ...item,
          id: `item-${Date.now()}-${index}`
        })),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        tags: ['lote', 'b2b']
      };

      const newQuote = await createQuote(quoteData.title, quoteData.description);
      return newQuote;
    } catch (err) {
      const errorMessage = 'Error al crear cotización en lote';
      setError(errorMessage);
      console.error('Error creating batch quote:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Duplicar cotización
   */
  const duplicateQuote = async (quoteId: string): Promise<Quote> => {
    setIsLoading(true);
    setError(null);

    try {
      const originalQuote = quotes.find(q => q.id === quoteId);
      if (!originalQuote) {
        throw new Error('Cotización no encontrada');
      }

      const duplicatedData = {
        ...originalQuote,
        id: undefined,
        title: `${originalQuote.title} (Copia)`,
        status: 'draft' as QuoteStatus,
        createdAt: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      const newQuote = await createQuote(duplicatedData.title || 'Cotización duplicada', duplicatedData.description || 'Cotización duplicada');
      return newQuote;
    } catch (err) {
      const errorMessage = 'Error al duplicar cotización';
      setError(errorMessage);
      console.error('Error duplicating quote:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualizar estado en lote
   * TODO: Implementar cuando updateQuote esté disponible en QuoteContext
   */
  const bulkUpdateStatus = async (_quoteIds: string[], _status: QuoteStatus): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implementar actualización en lote
      console.warn('bulkUpdateStatus no implementado - updateQuote no disponible');
      throw new Error('Función no implementada');
    } catch (err) {
      const errorMessage = 'Error al actualizar estado en lote';
      setError(errorMessage);
      console.error('Error bulk updating status:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Eliminar en lote
   * TODO: Implementar cuando deleteQuote esté disponible en QuoteContext
   */
  const bulkDelete = async (_quoteIds: string[]): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implementar eliminación en lote
      console.warn('bulkDelete no implementado - deleteQuote no disponible');
      throw new Error('Función no implementada');
      
      // Limpiar selección
      setSelectedQuotes([]);
    } catch (err) {
      const errorMessage = 'Error al eliminar cotizaciones en lote';
      setError(errorMessage);
      console.error('Error bulk deleting quotes:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Exportar cotizaciones
   */
  const exportQuotes = async (quoteIds: string[], _format: 'csv' | 'pdf' | 'excel'): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const _quotesToExport = quotes.filter(q => quoteIds.includes(q.id));
      
      // Simular exportación (en implementación real, esto llamaría a una API)
      // Aquí iría la lógica real de exportación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (err) {
      const errorMessage = 'Error al exportar cotizaciones';
      setError(errorMessage);
      console.error('Error exporting quotes:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calcular total de lote
   */
  const calculateBatchTotal = (items: QuoteItem[]): number => {
    return items.reduce((total: number, item: QuoteItem) => total + item.totalPrice, 0);
  };

  /**
   * Aplicar descuento en lote
   */
  const applyBulkDiscount = async (_quoteIds: string[], _discount: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implementar cuando updateQuote esté disponible
      console.warn('applyBulkDiscount no implementado - updateQuote no disponible');
      throw new Error('Función no implementada');
    } catch (err) {
      const errorMessage = 'Error al aplicar descuento en lote';
      setError(errorMessage);
      console.error('Error applying bulk discount:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Enviar cotizaciones en lote
   * TODO: Implementar cuando sendQuote esté disponible en QuoteContext
   */
  const sendBulkQuotes = async (_quoteIds: string[]): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implementar envío en lote
      console.warn('sendBulkQuotes no implementado - sendQuote no disponible');
      throw new Error('Función no implementada');
    } catch (err) {
      const errorMessage = 'Error al enviar cotizaciones en lote';
      setError(errorMessage);
      console.error('Error sending bulk quotes:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Establecer filtros
   */
  const setFilters = (newFilters: Partial<BatchQuoteFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  /**
   * Alternar selección de cotización
   */
  const toggleQuoteSelection = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  /**
   * Seleccionar todas las cotizaciones filtradas
   */
  const selectAllQuotes = () => {
    const filteredIds = filteredQuotes().map(q => q.id);
    setSelectedQuotes(filteredIds);
  };

  /**
   * Limpiar selección
   */
  const clearSelection = () => {
    setSelectedQuotes([]);
  };

  /**
   * Refrescar cotizaciones
   */
  const refreshQuotes = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await loadQuotes();
    } catch (err) {
      setError('Error al refrescar cotizaciones');
      console.error('Error refreshing quotes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estado
    quotes,
    filteredQuotes: filteredQuotes(),
    selectedQuotes,
    filters,
    stats: stats(),
    isLoading,
    error,
    sortBy,
    sortOrder,
    
    // Acciones
    createBatchQuote,
    duplicateQuote,
    bulkUpdateStatus,
    bulkDelete,
    exportQuotes,
    calculateBatchTotal,
    applyBulkDiscount,
    sendBulkQuotes,
    setFilters,
    setSortBy,
    setSortOrder,
    toggleQuoteSelection,
    selectAllQuotes,
    clearSelection,
    refreshQuotes
  };
};

export default useBatchQuotes;