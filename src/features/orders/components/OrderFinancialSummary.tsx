import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/shared/types/domain';
import { formatCurrency } from '../utils/orderUtils';

interface OrderFinancialSummaryProps {
  order: Order;
}

export function OrderFinancialSummary({ order }: OrderFinancialSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen Financiero</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Envío:</span>
              <span>{formatCurrency(order.shippingCost)}</span>
          </div>
           {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento:</span>
                  <span>-{formatCurrency(order.discount)}</span>
              </div>
          )}
           {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                  <span>Impuestos:</span>
                  <span>{formatCurrency(order.tax)}</span>
              </div>
          )}
          <Separator className="my-2"/>
           <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
