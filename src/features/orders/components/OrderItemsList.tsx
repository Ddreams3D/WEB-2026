import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/shared/types/domain';
import { formatCurrency } from '../utils/orderUtils';

interface OrderItemsListProps {
  order: Order;
}

export function OrderItemsList({ order }: OrderItemsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Items del Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                      {item.type === 'service' ? 'Servicio' : 'Producto'}
                  </p>
                  
                  {item.customizations && (
                      <div className="mt-2 text-sm bg-muted p-2 rounded">
                          <p className="font-medium text-xs text-muted-foreground mb-1">Personalización:</p>
                          <pre className="whitespace-pre-wrap font-sans text-xs">
                              {JSON.stringify(item.customizations, null, 2)}
                          </pre>
                      </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                    <div>
                      <span>Cantidad: </span>
                      <span className="font-medium text-foreground">{item.quantity}</span>
                    </div>
                    <div>
                      <span>Precio Unitario: </span>
                      <span className="font-medium text-foreground">{formatCurrency(item.price)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{formatCurrency(item.total)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
