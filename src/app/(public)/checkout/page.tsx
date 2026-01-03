'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, User, MessageSquare, ShoppingCart } from '@/lib/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';

import { checkoutSchema, type CheckoutFormData } from '@/lib/validators/checkout.schema';
import { ZodError } from 'zod';

export default function CheckoutPage() {
  const router = useRouter();
  // Fixed: totalPrice -> total, removed formatPrice (implemented locally)
  const { items, isLoading, total: totalPrice, refreshPrices } = useCart();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    city: '',
    address: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  // Utility to format price
  const formatPrice = (price: number) => {
    return `S/ ${price.toFixed(2)}`;
  };

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.replace('/catalogo-impresion-3d');
    }
  }, [items, isLoading, router]);

  // Refresh prices on mount to ensure SSoT
  useEffect(() => {
    refreshPrices();
  }, []); // Run once on mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const generateWhatsAppMessage = () => {
    // 1. Encabezado del mensaje
    let message = `*¡Hola Ddreams! Quiero realizar un pedido 🛍️*\n\n`;
    
    // 2. Datos del cliente
    message += `*Mis Datos:*\n`;
    message += `👤 Nombre: ${formData.name}\n`;
    message += `📍 Ciudad: ${formData.city}\n`;
    if (formData.address) message += `🏠 Dirección: ${formData.address}\n`;
    
    // 3. Resumen del pedido
    message += `\n*Mi Pedido:*\n`;
    items.forEach(item => {
      // Fixed: item.customizations instead of item.selectedVariant
      const variantText = item.customizations && item.customizations.length > 0
        ? ` (${item.customizations.map(c => c.value).join(', ')})` 
        : '';
      
      // Fixed: item.product.price instead of item.price
      message += `▪️ ${item.quantity}x ${item.product.name}${variantText} - ${formatPrice(item.product.price * item.quantity)}\n`;
    });
    
    // 4. Totales y notas
    message += `\n*Total a Pagar: ${formatPrice(totalPrice)}*\n`;
    
    if (formData.notes) {
      message += `\n📝 Nota: ${formData.notes}`;
    }

    message += `\n\n¿Cómo puedo proceder con el pago?`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    const result = checkoutSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CheckoutFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${PHONE_BUSINESS}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Cargando tu pedido...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background/50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al carrito
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Finalizar Pedido</h1>
          <p className="text-muted-foreground mt-2">Completa tus datos para enviar tu pedido por WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Datos de Contacto
                </CardTitle>
                <CardDescription>
                  Necesitamos estos datos para coordinar la entrega y el pago.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Ej: Juan Pérez" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`bg-background ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad <span className="text-red-500">*</span></Label>
                      <Input 
                        id="city" 
                        name="city" 
                        placeholder="Ej: Arequipa" 
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`bg-background ${errors.city ? 'border-red-500' : ''}`}
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección (Opcional)</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        placeholder="Calle, número, referencia..." 
                        value={formData.address}
                        onChange={handleInputChange}
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas adicionales (Opcional)</Label>
                    <Textarea 
                      id="notes" 
                      name="notes" 
                      placeholder="Ej: Quiero que el envío sea por Olva Courier, o detalles sobre el color..." 
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="bg-background min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">¿Cómo funciona?</p>
                <p>Al hacer clic en &quot;Enviar Pedido&quot;, se abrirá WhatsApp con un resumen de tu compra. Allí coordinaremos el pago (Yape, Plin o Transferencia) y los detalles del envío.</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resumen */}
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
                        {/* Fixed: Display customizations if any */}
                        {item.customizations && item.customizations.length > 0 && (
                           <p className="text-xs text-muted-foreground">
                             {item.customizations.map(c => c.value).join(', ')}
                           </p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                          {/* Fixed: Use item.product.price */}
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

        </div>
      </div>
    </div>
  );
}
