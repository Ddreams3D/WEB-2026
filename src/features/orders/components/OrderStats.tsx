import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Factory, Truck, TrendingUp } from '@/lib/icons';
import { Order } from '@/shared/types/domain';

interface OrderStatsProps {
  orders: Order[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const activeOrders = orders.filter(o => !['completed', 'cancelled', 'refunded'].includes(o.status));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Activos</p>
              <p className="text-2xl font-bold">
                {activeOrders.length}
              </p>
            </div>
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Proceso</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
            <Factory className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Enviados</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'shipped').length}
              </p>
            </div>
            <Truck className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  activeOrders.reduce((sum, order) => sum + order.total, 0)
                )}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
