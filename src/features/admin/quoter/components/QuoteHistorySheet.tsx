import React, { useEffect, useState } from 'react';
import { Sheet } from '@/components/ui/simple-sheet';
import { Quote } from '../types';
import { QuotesService } from '../services/quotes.service';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { QuoteToSaleModal, SaleDetails } from './QuoteToSaleModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Loader2, ArrowRight, CheckCircle2, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuoteHistorySheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function QuoteHistorySheet({ isOpen, onClose }: QuoteHistorySheetProps) {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [saleModalOpen, setSaleModalOpen] = useState(false);
    const [selectedQuoteForSale, setSelectedQuoteForSale] = useState<Quote | null>(null);
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        quoteId: string | null;
    }>({ isOpen: false, quoteId: null });

    useEffect(() => {
        if (isOpen) {
            loadQuotes();
        }
    }, [isOpen]);

    const loadQuotes = async () => {
        setLoading(true);
        try {
            const data = await QuotesService.getRecentQuotes(20);
            setQuotes(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar historial");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenSaleModal = (quote: Quote) => {
        setSelectedQuoteForSale(quote);
        setSaleModalOpen(true);
    };

    const handleConfirmSale = async (details: SaleDetails) => {
        if (!selectedQuoteForSale?.id) return;
        
        setProcessingId(selectedQuoteForSale.id);
        try {
            await QuotesService.convertToSale(selectedQuoteForSale, details);
            toast.success("¡Venta registrada exitosamente!");
            await loadQuotes();
        } catch (error) {
            console.error(error);
            toast.error("Error al registrar venta");
        } finally {
            setProcessingId(null);
            setSaleModalOpen(false);
            setSelectedQuoteForSale(null);
        }
    };

    const handleDelete = (quoteId: string) => {
        setConfirmState({
            isOpen: true,
            quoteId
        });
    };

    const confirmDelete = async () => {
        if (!confirmState.quoteId) return;

        const quoteId = confirmState.quoteId;
        setProcessingId(quoteId);
        try {
            await QuotesService.deleteQuote(quoteId);
            toast.success("Cotización eliminada");
            await loadQuotes();
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar cotización");
        } finally {
            setProcessingId(null);
            setConfirmState({ isOpen: false, quoteId: null });
        }
    };

    const getStatusBadge = (status: Quote['status']) => {
        switch (status) {
            case 'accepted': return <Badge className="bg-emerald-500">Vendido</Badge>;
            case 'sent': return <Badge variant="secondary">Enviado</Badge>;
            case 'draft': return <Badge variant="outline">Borrador</Badge>;
            case 'rejected': return <Badge variant="destructive">Rechazado</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Sheet
            isOpen={isOpen}
            onClose={onClose}
            title="Historial de Cotizaciones"
            description="Últimas 20 cotizaciones generadas"
            className="w-full sm:max-w-md"
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center px-6 pb-4">
                    <Button variant="ghost" size="sm" onClick={loadQuotes} disabled={loading}>
                        Refrescar
                    </Button>
                </div>
                
                <ScrollArea className="flex-1 px-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : quotes.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No hay cotizaciones guardadas.
                        </div>
                    ) : (
                        <div className="space-y-4 pb-6">
                            {quotes.map((quote) => (
                                <div key={quote.id} className="border rounded-lg p-4 space-y-3 bg-card hover:bg-accent/5 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-sm">{quote.projectName}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                {format(quote.createdAt, "d MMM yyyy, HH:mm", { locale: es })}
                                            </p>
                                        </div>
                                        {getStatusBadge(quote.status)}
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <div className="text-muted-foreground">
                                            {quote.clientName}
                                        </div>
                                        <div className="font-mono font-bold">
                                            S/. {quote.totalBilled.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="pt-2 flex gap-2">
                                        {quote.status !== 'accepted' ? (
                                            <>
                                                <Button 
                                                    size="sm" 
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    onClick={() => handleOpenSaleModal(quote)}
                                                    disabled={!!processingId}
                                                >
                                                    {processingId === quote.id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                                                    ) : (
                                                        <span className="text-xs font-bold mr-2">S/.</span>
                                                    )}
                                                    Registrar Venta
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-destructive hover:bg-destructive/10 border-destructive/20"
                                                    onClick={() => quote.id && handleDelete(quote.id)}
                                                    disabled={!!processingId}
                                                    title="Eliminar cotización"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <Button size="sm" variant="outline" className="w-full" disabled>
                                                <CheckCircle2 className="w-3 h-3 mr-2 text-emerald-500" />
                                                Venta Registrada
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            <QuoteToSaleModal 
                isOpen={saleModalOpen}
                onClose={() => {
                    setSaleModalOpen(false);
                    setSelectedQuoteForSale(null);
                }}
                quote={selectedQuoteForSale}
                onConfirm={handleConfirmSale}
            />

            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ isOpen: false, quoteId: null })}
                onConfirm={confirmDelete}
                title="Eliminar Cotización"
                message="¿Estás seguro de que deseas eliminar esta cotización? Esta acción no se puede deshacer."
                variant="danger"
                confirmText="Eliminar"
                isLoading={!!processingId}
            />
        </Sheet>
    );
}
