'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuote } from '@/contexts/QuoteContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { QuoteDetail } from './types';
import { QuoteDetailHeader } from './components/detail/QuoteDetailHeader';
import { QuoteGeneralInfo } from './components/detail/QuoteGeneralInfo';
import { QuoteItemsList } from './components/detail/QuoteItemsList';
import { QuoteFinancials } from './components/detail/QuoteFinancials';
import { QuoteClientInfo } from './components/detail/QuoteClientInfo';
import { QuoteNotes } from './components/detail/QuoteNotes';

export default function QuoteDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { quotes } = useQuote();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && quotes.length > 0) {
      const foundQuote = quotes.find(q => q.id === params.id);
      if (foundQuote) {
        // Simular estructura de cotización detallada
        const detailedQuote: QuoteDetail = {
          id: foundQuote.id,
          number: `COT-${foundQuote.id.slice(-6).toUpperCase()}`,
          title: foundQuote.title,
          description: foundQuote.description || '',
          status: foundQuote.status as QuoteDetail['status'],
          currency: foundQuote.currency,
          items: foundQuote.items.map((item, index) => ({
            id: item.id,
            name: item.fileName || `Pieza ${index + 1}`,
            description: item.notes || 'Modelo 3D personalizado',
            material: item.material || 'PLA',
            quality: item.complexity === 'high' ? 'Alta' : item.complexity === 'medium' ? 'Media' : 'Baja',
            infill: 20,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            estimatedTime: item.printTime,
            notes: item.notes
          })),
          subtotal: foundQuote.subtotal || foundQuote.total,
          tax: foundQuote.tax || 0,
          discount: foundQuote.discount || 0,
          total: foundQuote.total,
          validUntil: foundQuote.validUntil ? new Date(foundQuote.validUntil) : undefined,
          createdAt: new Date(foundQuote.createdAt),
          updatedAt: new Date(foundQuote.updatedAt),
          clientInfo: {
            name: 'Cliente Registrado', // Simulado
            email: 'cliente@ejemplo.com',
            phone: '+51 999 999 999',
            company: 'Empresa S.A.C.',
            address: 'Av. Siempre Viva 123'
          },
          notes: 'Cotización generada automáticamente.'
        };
        setQuote(detailedQuote);
      }
      setLoading(false);
    }
  }, [params.id, quotes]);

  if (loading) return <div>Cargando...</div>;
  if (!quote) return <div>Cotización no encontrada</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Link href="/cotizaciones" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a Cotizaciones
      </Link>
      
      <QuoteDetailHeader quote={quote} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuoteGeneralInfo quote={quote} />
          <QuoteItemsList items={quote.items} />
          <QuoteNotes quote={quote} />
        </div>
        <div className="space-y-6">
          <QuoteFinancials quote={quote} />
          <QuoteClientInfo client={quote.clientInfo} />
        </div>
      </div>
    </div>
  );
}
