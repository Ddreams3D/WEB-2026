import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Order } from '@/shared/types/domain';
import { getProgressPercentage } from '../utils/orderUtils';

interface OrderProgressProps {
  order: Order;
}

export function OrderProgress({ order }: OrderProgressProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso del Pedido</span>
            <span>{getProgressPercentage(order.status)}%</span>
          </div>
          <Progress value={getProgressPercentage(order.status)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
