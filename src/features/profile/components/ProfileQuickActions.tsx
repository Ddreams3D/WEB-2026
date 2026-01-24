import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const ProfileQuickActions: React.FC = () => {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/catalogo-impresion-3d">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Ir al Catálogo
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
