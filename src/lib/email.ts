import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not defined in environment variables. Email sending will fail.');
}

export const resend = new Resend(RESEND_API_KEY || 're_123456789');

export const EMAIL_FROM = 'Ddreams 3D <notificaciones@ddreams3d.com>'; // Dominio de producción
export const EMAIL_TO_ADMIN = 'dreamings.desings.3d@gmail.com';
