import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Order } from '@/shared/types/domain';

interface ProfileOrdersTabProps {
  orders: Order[];
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const ProfileOrdersTab: React.FC<ProfileOrdersTabProps> = ({
  orders,
  getStatusColor,
  getStatusLabel
}) => {
  return (
    <div className="space-y-4">
      {orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order.id} className="border-border/50 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    Pedido #{order.id.substring(0, 8).toUpperCase()}
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-normal", getStatusColor(order.status))}>
                      {getStatusLabel(order.status)}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/pedidos/${order.id}`}>Ver Detalles</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{order.items.length} items</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Entrega: {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : 'Pendiente'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No tienes pedidos recientes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ¡Es un buen momento para iniciar tu primer proyecto!
            </p>
            <Button asChild>
              <Link href="/catalogo-impresion-3d">Explorar Catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
