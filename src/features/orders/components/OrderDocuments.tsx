import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye } from '@/lib/icons';
import { Order } from '@/shared/types/domain';
import { formatDate } from '../utils/orderUtils';

interface OrderDocumentsProps {
  order: Order;
}

export function OrderDocuments({ order }: OrderDocumentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Documentos del Pedido
        </CardTitle>
        <CardDescription>
          Documentos generados automáticamente para este pedido.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mock documents for now since Order doesn't have a documents field yet */}
          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">Resumen del Pedido</p>
                <p className="text-sm text-muted-foreground">Generado el {formatDate(order.createdAt)}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
