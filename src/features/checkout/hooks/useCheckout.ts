import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validators/checkout.schema';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';
import { OrderService } from '@/services/order.service';
import { Order, OrderItem } from '@/shared/types/domain';
import { useToast } from '@/components/ui/ToastManager';

export function useCheckout() {
  const router = useRouter();
  const { items, isLoading, total: totalPrice, refreshPrices, clearCart } = useCart();
  const { user } = useAuth();
  const { showError } = useToast();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    city: '',
    address: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);

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
  }, [refreshPrices]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleWhatsAppOrder = async () => {
    if (isProcessing) return;

    const result = checkoutSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CheckoutFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      showError('Faltan datos', 'Por favor completa la información requerida.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Preparar items del pedido
      const orderItems: OrderItem[] = items.map(item => ({
        id: item.id, // ID del item en carrito
        productId: item.product.id,
        type: item.product.kind === 'service' ? 'service' : 'product',
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
        image: item.product.images?.[0]?.url,
        customizations: item.customizations?.reduce((acc, curr) => ({
            ...acc,
            [curr.name]: curr.value
        }), {})
      }));

      // 2. Crear objeto de pedido
      // Usamos un ID temporal si no hay usuario, o el ID del usuario actual
      const userId = user?.id || `guest_${Date.now()}`;
      
      const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'history'> = {
        userId: userId,
        userEmail: user?.email || '',
        userName: formData.name,
        items: orderItems,
        subtotal: totalPrice, // Asumiendo que subtotal == total por ahora (sin shipping/tax separados)
        tax: 0,
        shippingCost: 0, // Envío gratis o por coordinar
        discount: 0,
        total: totalPrice,
        currency: 'PEN',
        status: 'pending_payment',
        paymentStatus: 'pending',
        shippingMethod: 'delivery', // Default
        shippingAddress: {
            street: formData.address || '',
            city: formData.city,
            state: '', // No capturado
            zip: '',   // No capturado
            country: 'Peru',
            reference: ''
        },
        customerPhone: '', // Podríamos pedirlo en el form
        notes: formData.notes
      };

      // 3. Guardar en Firestore
      const orderId = await OrderService.createOrder(orderData);

      // 4. Generar mensaje de WhatsApp con ID de pedido
      const messageBody = generateWhatsAppMessage(orderId);
      const whatsappUrl = `https://wa.me/${PHONE_BUSINESS}?text=${messageBody}`;
      
      // 5. Limpiar carrito y redirigir
      clearCart();
      window.open(whatsappUrl, '_blank');
      
      // Opcional: Redirigir a una página de "Gracias / Continuar en WhatsApp"
      // router.push(`/order-confirmation?id=${orderId}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Error', 'Hubo un problema al procesar tu pedido. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateWhatsAppMessage = useCallback((orderId?: string) => {
    // 1. Encabezado del mensaje
    let message = `*¡Hola Ddreams! Quiero realizar un pedido 🛍️*\n`;
    if (orderId) message += `🆔 *ID Pedido:* #${orderId.slice(-6).toUpperCase()}\n\n`;
    else message += `\n`;
    
    // 2. Datos del cliente
    message += `*Mis Datos:*\n`;
    message += `👤 Nombre: ${formData.name}\n`;
    message += `📍 Ciudad: ${formData.city}\n`;
    if (formData.address) message += `🏠 Dirección: ${formData.address}\n`;
    
    // 3. Resumen del pedido
    message += `\n*Mi Pedido:*\n`;
    items.forEach(item => {
      const variantText = item.customizations && item.customizations.length > 0
        ? ` (${item.customizations.map(c => c.value).join(', ')})` 
        : '';
      
      message += `▪️ ${item.quantity}x ${item.product.name}${variantText} - ${formatPrice(item.product.price * item.quantity)}\n`;
    });
    
    // 4. Totales y notas
    message += `\n*Total a Pagar: ${formatPrice(totalPrice)}*\n`;
    
    if (formData.notes) {
      message += `\n📝 Nota: ${formData.notes}`;
    }

    message += `\n\n¿Cómo puedo proceder con el pago?`;

    return encodeURIComponent(message);
  }, [formData, items, totalPrice]);

  return {
    items,
    isLoading: isLoading || isProcessing,
    totalPrice,
    formData,
    errors,
    handleInputChange,
    handleWhatsAppOrder,
    formatPrice
  };
}
