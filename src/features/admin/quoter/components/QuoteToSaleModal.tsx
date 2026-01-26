import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Quote } from '../types';
import { PaymentMethod } from '../../finances/types';
import { Loader2, DollarSign } from 'lucide-react';

interface QuoteToSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
  onConfirm: (details: SaleDetails) => Promise<void>;
}

export interface SaleDetails {
  clientName: string;
  paymentMethod: PaymentMethod;
  paymentPhase: 'full' | 'deposit';
  amount: number;
}

export function QuoteToSaleModal({ isOpen, onClose, quote, onConfirm }: QuoteToSaleModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientName, setClientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [paymentPhase, setPaymentPhase] = useState<'full' | 'deposit'>('full');
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    if (quote) {
      setClientName(quote.clientName || 'Cliente sin nombre');
      setAmount(quote.totalBilled.toFixed(2));
      setPaymentPhase('full');
      setPaymentMethod('transfer');
    }
  }, [quote]);

  // When phase changes, adjust amount logic if needed
  useEffect(() => {
    if (quote && paymentPhase === 'full') {
        setAmount(quote.totalBilled.toFixed(2));
    } else if (quote && paymentPhase === 'deposit') {
        setAmount((quote.totalBilled * 0.5).toFixed(2)); // Default 50% deposit
    }
  }, [paymentPhase, quote]);

  const remaining = quote ? (quote.totalBilled - (parseFloat(amount) || 0)) : 0;

  const handleSubmit = async () => {
    if (!quote) return;

    setIsProcessing(true);
    try {
        await onConfirm({
            clientName,
            paymentMethod,
            paymentPhase,
            amount: parseFloat(amount) || 0
        });
        onClose();
    } catch (error) {
        console.error(error);
    } finally {
        setIsProcessing(false);
    }
  };

  if (!quote) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Venta</DialogTitle>
          <DialogDescription>
            Confirma los detalles finales antes de registrar el ingreso.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
            {/* 1. Client Name */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientName" className="text-right">
                    Cliente
                </Label>
                <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="col-span-3"
                />
            </div>

            {/* 2. Payment Method */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                    Método
                </Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona método" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="transfer">Transferencia BCP/Interbank</SelectItem>
                        <SelectItem value="yape">Yape</SelectItem>
                        <SelectItem value="plin">Plin</SelectItem>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="credit_card">Tarjeta Crédito/Débito</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 3. Payment Phase */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Tipo</Label>
                <RadioGroup 
                    value={paymentPhase} 
                    onValueChange={(v) => setPaymentPhase(v as any)}
                    className="col-span-3 flex flex-col space-y-1"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="r1" />
                        <Label htmlFor="r1">Pago Completo (S/. {quote.totalBilled.toFixed(2)})</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deposit" id="r2" />
                        <Label htmlFor="r2">Adelanto (50%)</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* 4. Amount */}
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="amount" className="text-right pt-2">
                    Monto
                </Label>
                <div className="col-span-3 space-y-2">
                    <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="amount"
                            type="number"
                            step="0.10"
                            className="pl-8"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    
                    {paymentPhase === 'deposit' && (
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-border/50">
                            <div className="flex justify-between">
                                <span>Total Cotizado:</span>
                                <span className="font-medium">S/. {quote.totalBilled.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-orange-600 mt-1 font-medium">
                                <span>Saldo Pendiente:</span>
                                <span>S/. {remaining > 0 ? remaining.toFixed(2) : '0.00'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                </>
            ) : (
                'Confirmar Venta'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
