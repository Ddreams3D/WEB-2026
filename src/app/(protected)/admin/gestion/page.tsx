'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Users } from 'lucide-react';
import { OrdersView } from '@/features/admin/orders/OrdersView';
import { UsersView } from '@/features/admin/users/UsersView';

export default function GestionPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Gestión de Comercio y Usuarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Centro de control unificado para pedidos y usuarios
          </p>
        </div>
      </div>

      <Tabs defaultValue="pedidos" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6 bg-muted/50 p-1">
          <TabsTrigger 
            value="pedidos" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Package className="w-4 h-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger 
            value="usuarios" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Users className="w-4 h-4" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos" className="mt-0">
          <OrdersView hideHeader={true} />
        </TabsContent>
        
        <TabsContent value="usuarios" className="mt-0">
          <UsersView hideHeader={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
