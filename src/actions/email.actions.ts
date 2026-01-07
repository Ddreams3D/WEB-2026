'use server';

import { resend, EMAIL_FROM } from '@/lib/email';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''), // Simple strip tags for text fallback
    });

    if (data.error) {
      console.error('Error sending email via Resend:', data.error);
      return { success: false, error: data.error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}

export async function sendOrderNotification(orderId: string, message: string, userEmail: string) {
  return sendEmail({
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
