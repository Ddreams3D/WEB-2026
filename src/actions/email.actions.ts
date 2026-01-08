import { z } from 'zod';
import { EmailService, SendEmailSchema, SendEmailInput } from '@/lib/email-service';
import { verifyAdminSession } from '@/lib/auth-admin';

// Re-export schema for client usage if needed
export { SendEmailSchema };

const OrderNotificationSchema = z.object({
  orderId: z.string().min(1, "ID de pedido requerido"),
  message: z.string().min(1, "El mensaje no puede estar vacío"),
  userEmail: z.string().email("Email de usuario inválido"),
});

/**
 * Server Action para enviar emails.
 * @security Protected by Admin Session
 */
export async function sendEmail(input: SendEmailInput) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required to send emails directly.');
  }
  // Delegar al servicio seguro
  return EmailService.send(input);
}

export async function sendOrderNotification(orderId: string, message: string, userEmail: string) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return {
      success: false,
      error: 'Unauthorized: Admin access required to send notifications.'
    };
  }

  // 1. Validación Zod para esta acción específica
  const validation = OrderNotificationSchema.safeParse({ orderId, message, userEmail });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message
    };
  }

  return EmailService.send({
    to: userEmail,
    subject: `Actualización sobre tu pedido #${orderId} - Ddreams 3D`,
    html: `
      <h1>Actualización de Pedido</h1>
      <p>Hola,</p>
      <p>Tenemos noticias sobre tu pedido <strong>#${orderId}</strong>:</p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
        ${message}
      </blockquote>
      <p>Gracias por confiar en nosotros.</p>
      <p>El equipo de Ddreams 3D</p>
    `,
  });
}
