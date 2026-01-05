import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, MessageSquare } from 'lucide-react';
import type { CheckoutFormData } from '@/lib/validators/checkout.schema';

interface CheckoutFormProps {
  formData: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CheckoutForm({ formData, errors, handleInputChange }: CheckoutFormProps) {
  return (
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
  );
}
