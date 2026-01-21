export type WhatsAppTemplateId = 
  | 'general_contact'
  | 'product_inquiry'
  | 'service_quote'
  | 'cart_checkout'
  | 'cart_quote'
  | 'order_inquiry'
  | 'custom';

export interface WhatsAppTemplate {
  id: WhatsAppTemplateId;
  label: string; // For Admin UI
  message: string;
  variables: string[]; // List of variables this template accepts
}

export const WHATSAPP_TEMPLATES: Record<WhatsAppTemplateId, WhatsAppTemplate> = {
  general_contact: {
    id: 'general_contact',
    label: 'Contacto General',
    message: "Hola, vengo de su página web y me gustaría cotizar un proyecto.",
    variables: []
  },
  product_inquiry: {
    id: 'product_inquiry',
    label: 'Consulta de Producto',
    message: "Hola, me interesa el producto *{{productName}}*. ¿Podrían brindarme más información?",
    variables: ['productName']
  },
  service_quote: {
    id: 'service_quote',
    label: 'Cotización de Servicio',
    message: "Hola, quiero solicitar información sobre el servicio *{{serviceName}}*.\n\nDetalles:\n{{details}}",
    variables: ['serviceName', 'details']
  },
  cart_checkout: {
    id: 'cart_checkout',
    label: 'Pedido de Carrito',
    message: "*¡Hola Ddreams! Quiero realizar un pedido 🛍️*\n\n*Mis Datos:*\n👤 Nombre: {{customerName}}\n📍 Ciudad: {{city}}\n{{address}}\n\n*Mi Pedido:*\n{{orderSummary}}\n\n*Total a Pagar: {{total}}*\n\n{{notes}}\n\n¿Cómo puedo proceder con el pago?",
    variables: ['customerName', 'city', 'address', 'orderSummary', 'total', 'notes']
  },
  cart_quote: {
    id: 'cart_quote',
    label: 'Cotización de Carrito',
    message: "Hola Ddreams3D, estoy interesado en cotizar un diseño único y personalizado. ¿Podrían brindarme más información?",
    variables: []
  },
  order_inquiry: {
    id: 'order_inquiry',
    label: 'Consulta de Pedido',
    message: "🛒 *Consulta sobre Pedido - DDreams 3D*\n\n📋 *Número de Pedido:* {{orderId}}\n👤 *Cliente:* {{customerName}}\n\nHola, tengo una consulta sobre mi pedido. ¿Podrían ayudarme?\n\n¡Gracias! 😊",
    variables: ['orderId', 'customerName']
  },
  custom: {
    id: 'custom',
    label: 'Mensaje Personalizado',
    message: "{{message}}",
    variables: ['message']
  }
};
