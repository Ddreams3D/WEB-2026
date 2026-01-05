import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Mail, Calendar } from '@/lib/icons';
import { Order } from '@/shared/types/domain';
import { formatDate } from '../utils/orderUtils';

interface OrderCustomerInfoProps {
  order: Order;
}

export function OrderCustomerInfo({ order }: OrderCustomerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Información del Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Nombre / Empresa:</span>
              <p className="font-medium">{order.userName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{order.userEmail}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {order.shippingAddress && (
              <div>
                <span className="text-sm text-muted-foreground">Dirección de Envío:</span>
                <p className="font-medium">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
              </div>
            )}
            {order.estimatedDeliveryDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Entrega estimada: {formatDate(order.estimatedDeliveryDate)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
