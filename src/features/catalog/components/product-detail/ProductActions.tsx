import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, ShoppingCart, Check } from 'lucide-react';
import { StoreProduct as Product, Service } from '@/shared/types/domain';

interface ProductActionsProps {
  product: Product | Service;
  activeTab: string;
  isAdding: boolean;
  handleAction: () => void;
}

export function ProductActions({ product, activeTab, isAdding, handleAction }: ProductActionsProps) {
  return (
    <div className="flex flex-col gap-4 pt-6 border-t border-border">
      <Button 
        size="lg" 
        variant="gradient"
        className="w-full text-lg h-14 rounded-xl font-bold shadow-lg hover:shadow-xl"
        onClick={handleAction}
        disabled={isAdding}
      >
        {isAdding ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            Procesando...
          </span>
        ) : (
          <>
            {(() => {
              const currentTab = product.tabs?.find(t => t.id === activeTab);
              if (currentTab?.ctaText) {
                return (
                  <>
                    <MessageSquare className="w-5 h-5 mr-2.5" />
                    {currentTab.ctaText}
                  </>
                );
              }
              
              if (product.kind === 'product' && product.price > 0) {
                return (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2.5" />
                    Agregar al Carrito
                  </>
                );
              }
              
              return (
                <>
                  <MessageSquare className="w-5 h-5 mr-2.5" />
                  Consultar
                </>
              );
            })()}
          </>
        )}
      </Button>
      {product.kind !== 'service' && product.price > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-success/10 py-2 rounded-lg">
          <Check className="w-4 h-4 text-success" />
          <span className="font-medium">Compra 100% segura garantizada por Ddreams 3D</span>
        </div>
      )}
    </div>
  );
}
