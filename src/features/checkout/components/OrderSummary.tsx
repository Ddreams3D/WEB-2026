import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, MessageSquare } from 'lucide-react';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import type { CartItem } from '@/shared/types';
import type { CheckoutFormData } from '@/lib/validators/checkout.schema';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  formatPrice: (price: number) => string;
  handleWhatsAppOrder: () => void;
  formData: CheckoutFormData;
}

export function OrderSummary({ items, totalPrice, formatPrice, handleWhatsAppOrder, formData }: OrderSummaryProps) {
  return (
    <div className="lg:col-span-5">
      <Card className="border-border/50 shadow-md sticky top-24">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Resumen del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[300px] overflow-y-auto p-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                  {item.product.images && item.product.images.length > 0 ? (
                    <ProductImage
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                  {item.customizations && item.customizations.length > 0 && (
                     <p className="text-xs text-muted-foreground">
                       {item.customizations.map(c => c.value).join(', ')}
                     </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                    <p className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="p-6 space-y-3 bg-muted/10">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Envío</span>
              <span className="text-muted-foreground text-xs italic">(A coordinar)</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full h-12 text-base gap-2"
            variant="success"
            onClick={handleWhatsAppOrder}
            disabled={!formData.name || !formData.city}
          >
            <MessageSquare className="h-5 w-5" />
            Enviar Pedido por WhatsApp
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
