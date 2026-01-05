import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validators/checkout.schema';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';

export function useCheckout() {
  const router = useRouter();
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
  }, [refreshPrices]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const generateWhatsAppMessage = useCallback(() => {
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

  return {
    items,
    isLoading,
    totalPrice,
    formData,
    errors,
    handleInputChange,
    handleWhatsAppOrder,
    formatPrice
  };
}
