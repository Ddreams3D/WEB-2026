import { EMAIL_BUSINESS } from '@/shared/constants/contactInfo';

// Normalizamos los correos para evitar problemas de espacios o mayúsculas
export const ADMIN_EMAILS = [
  'dreamings.desings.3d@gmail.com', // Correo con typo (legacy)
  'dreamings.designs.3d@gmail.com', // Correo correcto
  'danielanthonychaina@gmail.com',
  EMAIL_BUSINESS
].map(email => email.toLowerCase().trim());

export const isSuperAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(normalizedEmail);
};
