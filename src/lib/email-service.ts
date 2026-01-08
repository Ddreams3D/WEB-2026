import { resend, EMAIL_FROM } from '@/lib/email';
import { z } from 'zod';

// Re-export types/schemas used elsewhere
export const SendEmailSchema = z.object({
  to: z.union([z.string().email("Email inválido"), z.array(z.string().email("Uno de los emails es inválido"))]),
  subject: z.string().min(1, "El asunto es requerido"),
  html: z.string().min(1, "El contenido HTML es requerido"),
  text: z.string().optional(),
});

export type SendEmailInput = z.infer<typeof SendEmailSchema>;

export const EmailService = {
  async send(input: SendEmailInput) {
    // Validation is assumed to be done by caller or here optionally
    // But since this is a lib function, we can do it again for safety
    const validation = SendEmailSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
    }

    const { to, subject, html, text } = validation.data;

    try {
      const data = await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>?/gm, ''),
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
};
