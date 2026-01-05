import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, User } from '@/lib/icons';
import { Order } from '@/shared/types/domain';
import { OrderIcon } from './OrderIcon';
import { formatDate } from '../utils/orderUtils';

interface OrderTimelineProps {
  order: Order;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  // Helper for timeline specific date format with time
  const formatDateTime = (date: Date | string) => {
    if (!date) return '';
    return formatDate(date) + ' ' + (typeof date === 'string' ? new Date(date) : date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusLabel = (status: string) => {
    // This duplicates logic slightly but keeps component self-contained or we can export labels map from utils
    const labels: Record<string, string> = {
      'quote_requested': 'Cotización',
      'pending_payment': 'Pendiente de Pago',
      'paid': 'Pagado',
      'processing': 'En Proceso',
      'ready': 'Listo',
      'shipped': 'Enviado',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
      'refunded': 'Reembolsado'
    };
    return labels[status] || status;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Seguimiento del Pedido
        </CardTitle>
        <CardDescription>
          Historial completo de eventos y actualizaciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {order.history && order.history.length > 0 ? (
            [...order.history].reverse().map((event, index) => (
              <div key={index} className="relative">
                {index < order.history.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-background border-2 border-border rounded-full flex items-center justify-center">
                    <OrderIcon status={event.status} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold">{getStatusLabel(event.status)}</h3>
                      <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.note || 'Actualización de estado'}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {event.updatedBy && (
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {event.updatedBy === 'system' ? 'Sistema' : event.updatedBy}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center">No hay historial disponible.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
