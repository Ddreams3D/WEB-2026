import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone } from '@/lib/icons';

export function OrderSupportSidebar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ayuda</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
            ¿Tienes problemas con tu pedido? Contáctanos.
        </p>
        <Button variant="outline" className="w-full justify-start mb-2">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contactar Soporte
        </Button>
         <Button variant="outline" className="w-full justify-start">
            <Phone className="mr-2 h-4 w-4" />
            Llamar
        </Button>
      </CardContent>
    </Card>
  );
}
