'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote } from '../types';
import Link from 'next/link';
import { Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface QuoteListProps {
  filteredQuotes: Quote[];
  handleCreateQuote: () => void;
  handleDeleteQuote: (id: string) => void;
}

export function QuoteList({ filteredQuotes, handleCreateQuote, handleDeleteQuote }: QuoteListProps) {
  if (filteredQuotes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No se encontraron cotizaciones</p>
          <Button onClick={handleCreateQuote}>Crear Nueva Cotización</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {filteredQuotes.map((quote) => (
        <Card key={quote.id}>
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">{quote.title}</h3>
              <p className="text-sm text-muted-foreground">ID: {quote.id}</p>
              <p className="text-sm text-muted-foreground">
                Creada: {format(new Date(quote.createdAt), 'PPP', { locale: es })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {quote.status}
              </span>
              <div className="font-bold text-lg mx-4">
                S/ {quote.total.toFixed(2)}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/cotizaciones/${quote.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteQuote(quote.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
