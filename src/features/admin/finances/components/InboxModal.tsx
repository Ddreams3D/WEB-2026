import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { InboxItem, FinanceRecord } from '../types';
import { InboxService } from '../services/InboxService';
import { Loader2, CheckCircle2, XCircle, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';
import { FinanceModal } from '../FinanceModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationContext';

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<FinanceRecord>) => void;
  mode?: 'business' | 'personal' | 'all';
}

export function InboxModal({ isOpen, onClose, onSave, mode = 'all' }: InboxModalProps) {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // State for the approval flow
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const { markAsRead, addLocalNotification } = useNotifications();

  // Load items when modal opens
  useEffect(() => {
    if (isOpen) {
      const load = async () => {
        setLoading(true);
        try {
          const data = await InboxService.getInbox();
          const filtered = data.filter((item) => {
            if (mode === 'personal') return item.context === 'personal';
            if (mode === 'business') return item.context !== 'personal';
            return true;
          });
          setItems(filtered.sort((a, b) => b.createdAt - a.createdAt));
        } catch (error) {
          console.error('Failed to load inbox', error);
          addLocalNotification(
            'No se pudo cargar el Inbox del Bot',
            'Revisa tu conexión o intenta de nuevo en unos minutos.',
            'warning'
          );
        } finally {
          setLoading(false);
        }
      };

      load();
    }
  }, [isOpen, mode]);

  const handleApproveClick = (item: InboxItem) => {
    setSelectedItem(item);
    setIsApprovalModalOpen(true);
  };

  const handleRejectClick = async (item: InboxItem) => {
    if (!confirm('¿Estás seguro de rechazar y eliminar este registro del inbox?')) return;
    
    setProcessingId(item.id);
    try {
      await InboxService.removeFromInbox([item.id]);
      setItems(prev => prev.filter(i => i.id !== item.id));
      
      // Also mark notification as read if it exists
      markAsRead(`inbox-${item.id}`).catch(() => {});
      
    } catch (error) {
      console.error('Error rejecting item', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleApprovalSave = async (record: Partial<FinanceRecord>) => {
    if (!selectedItem) return;

    setProcessingId(selectedItem.id);
    setIsApprovalModalOpen(false); // Close approval modal first

    try {
      // 1. Add to main finance records
      // Add originInboxId to track provenance
      onSave({ ...record, originInboxId: selectedItem.id });

      // 2. Remove from Inbox
      await InboxService.removeFromInbox([selectedItem.id]);
      
      // 3. Update local list
      setItems(prev => prev.filter(i => i.id !== selectedItem.id));

      // 4. Mark notification as read
      markAsRead(`inbox-${selectedItem.id}`).catch(() => {});

    } catch (error) {
      console.error('Error approving item', error);
      alert('Hubo un error al procesar el registro. Por favor intenta de nuevo.');
    } finally {
      setProcessingId(null);
      setSelectedItem(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">📥 Inbox de Finanzas (Bot)</span>
              {items.length > 0 && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {items.length} pendientes
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 mt-4 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Cargando inbox...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                <CheckCircle2 className="w-12 h-12 text-green-500/50 mb-3" />
                <p className="font-medium">Todo al día</p>
                <p className="text-sm">No hay registros pendientes de aprobación.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "group relative bg-card hover:bg-muted/30 border rounded-lg p-4 transition-all duration-200",
                      processingId === item.id && "opacity-50 pointer-events-none"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Icon & Main Info */}
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                          item.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                          {item.type === 'income' ? <ArrowRight className="w-5 h-5 -rotate-45" /> : <ArrowRight className="w-5 h-5 rotate-45" />}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg font-mono tracking-tight">
                              {item.currency} {item.amount.toFixed(2)}
                            </span>
                            <span className={cn(
                              "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border",
                              item.type === 'income' 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-red-50 text-red-700 border-red-200"
                            )}>
                              {item.type === 'income' ? 'Ingreso' : 'Gasto'}
                            </span>
                            {item.context && (
                              <span className={cn(
                                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border",
                                item.context === 'personal' 
                                  ? "bg-purple-50 text-purple-700 border-purple-200" 
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              )}>
                                {item.context === 'personal' ? 'Personal' : 'Empresa'}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm font-medium text-foreground/90">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{format(new Date(item.createdAt), "d MMM yyyy, HH:mm", { locale: es })}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px] opacity-70">ID: {item.id.split('_')[1] || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-center">
                         {processingId === item.id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                         ) : (
                           <>
                             <Button 
                               size="sm" 
                               variant="ghost" 
                               className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                               onClick={() => handleRejectClick(item)}
                               title="Rechazar y Eliminar"
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                             <Button 
                               size="sm" 
                               className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                               onClick={() => handleApproveClick(item)}
                             >
                               Revisar y Aprobar
                               <ArrowRight className="w-3 h-3" />
                             </Button>
                           </>
                         )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedItem && (
        <FinanceModal
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          onSave={handleApprovalSave}
          record={{
            type: selectedItem.type,
            amount: selectedItem.amount,
            title: selectedItem.description,
            currency: selectedItem.currency,
            date: new Date(selectedItem.date).toISOString(),
            category: '',
            paymentMethod: 'cash',
            status: 'paid',
            source: 'manual',
            items: []
          }}
        />
      )}
    </>
  );
}
