'use client';

import { useState, useEffect } from 'react';
import { useQuote } from '@/contexts/QuoteContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from '@/lib/icons';
import { QuoteStatus } from '@/features/quotes/types';

import { QuoteStats } from './components/QuoteStats';
import { QuoteFilters } from './components/QuoteFilters';
import { QuoteList } from './components/QuoteList';
import { QuoteCreate } from './components/QuoteCreate';
import { QuoteCalculator } from './components/QuoteCalculator';

export default function QuotesPageClient() {
  const { quotes, deleteQuote } = useQuote();
  
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const [filteredQuotes, setFilteredQuotes] = useState(quotes);

  useEffect(() => {
    let filtered = quotes;
    
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }
    
    setFilteredQuotes(filtered);
  }, [quotes, searchTerm, statusFilter]);

  const handleCreateQuote = () => {
    setActiveTab('create');
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      await deleteQuote(quoteId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Cotizaciones en Lote
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona múltiples cotizaciones para proyectos de impresión 3D
          </p>
        </div>
        <Button onClick={handleCreateQuote}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cotización
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista de Cotizaciones</TabsTrigger>
          <TabsTrigger value="create">Crear Cotización</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
        </TabsList>

        {/* Lista de Cotizaciones */}
        <TabsContent value="list" className="space-y-6">
          <QuoteStats quotes={quotes} />
          
          <QuoteFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setActiveTab={setActiveTab}
          />
          
          <QuoteList 
            filteredQuotes={filteredQuotes}
            handleCreateQuote={handleCreateQuote}
            handleDeleteQuote={handleDeleteQuote}
          />
        </TabsContent>

        {/* Crear Cotización */}
        <TabsContent value="create" className="space-y-6">
          <QuoteCreate setActiveTab={setActiveTab} />
        </TabsContent>

        {/* Calculadora */}
        <TabsContent value="calculator" className="space-y-6">
          <QuoteCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
