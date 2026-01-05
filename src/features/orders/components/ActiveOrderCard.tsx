import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Eye, Activity } from '@/lib/icons';
import { Order } from '@/shared/types/domain';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderIcon } from './OrderIcon';
import { getProgressPercentage, formatDate, formatCurrency, getOrderTitle } from '../utils/orderUtils';

interface ActiveOrderCardProps {
  order: Order;
}

export function ActiveOrderCard({ order }: ActiveOrderCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <OrderIcon status={order.status} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  #{order.id.substring(0, 8).toUpperCase()}
                </h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-muted-foreground mb-2">{getOrderTitle(order)}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Creado: {formatDate(order.createdAt)}
                </span>
                {order.estimatedDeliveryDate && (
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Entrega estimada: {formatDate(order.estimatedDeliveryDate)}
                  </span>
                )}
                <span className="font-medium text-primary">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/pedidos/${order.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso del pedido</span>
            <span className="font-medium">{getProgressPercentage(order.status)}%</span>
          </div>
          <Progress value={getProgressPercentage(order.status)} className="h-2" />
        </div>
        
        {/* Timeline resumido */}
        {order.history && order.history.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Último movimiento:</span>
              <span className="font-medium">
                {order.history[order.history.length - 1]?.note || 'Actualización de estado'}
              </span>
              <span className="text-muted-foreground">
                • {formatDate(order.history[order.history.length - 1]?.timestamp)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
