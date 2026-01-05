import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from '@/lib/icons';
import { Order } from '@/shared/types/domain';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderIcon } from './OrderIcon';
import { formatDate, formatCurrency, getOrderTitle } from '../utils/orderUtils';

interface CompletedOrdersListProps {
  orders: Order[];
}

export function CompletedOrdersList({ orders }: CompletedOrdersListProps) {
  const completedOrders = orders.filter(o => ['completed', 'cancelled', 'refunded'].includes(o.status));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Completados</CardTitle>
        <CardDescription>
          Historial de pedidos entregados y cancelados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay pedidos completados aún.
            </div>
          ) : (
            completedOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <OrderIcon status={order.status} />
                  <div>
                    <h3 className="font-semibold">#{order.id.substring(0, 8).toUpperCase()}</h3>
                    <p className="text-sm text-muted-foreground">{getOrderTitle(order)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-medium">{formatCurrency(order.total)}</span>
                  <Link href={`/pedidos/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
