import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/shared/types/domain';

interface UseOrderFormProps {
  order: Order | null;
  isOpen: boolean;
  onSave: (orderId: string, status: OrderStatus) => Promise<void> | void;
  onClose: () => void;
}

export function useOrderForm({ order, isOpen, onSave, onClose }: UseOrderFormProps) {
  const [status, setStatus] = useState<OrderStatus>('quote_requested');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || status === order.status) return;
    
    setIsSubmitting(true);
    try {
      await onSave(order.id, status);
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    status,
    setStatus,
    isSubmitting,
    handleSubmit
  };
}
