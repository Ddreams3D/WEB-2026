import { EMAIL_BUSINESS } from '@/shared/constants/contactInfo';

// Normalizamos los correos para evitar problemas de espacios o mayúsculas
export const ADMIN_EMAILS = [
  'dreamings.desings.3d@gmail.com', // Correo con typo (legacy)
  'dreamings.designs.3d@gmail.com', // Correo correcto
  'dreamings.desings.3@gmail.com',  // Correo reportado en screenshot (sin 'd' final)
  'danielanthonychaina@gmail.com',
  EMAIL_BUSINESS
].map(email => email.toLowerCase().trim());

export const isSuperAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  const isMatch = ADMIN_EMAILS.includes(normalizedEmail);
  // Debug para identificar fallos de acceso
  if (!isMatch && (email.includes('dream') || email.includes('admin'))) {
      console.warn(`[isSuperAdmin] Fallo de coincidencia: '${normalizedEmail}' no está en la lista:`, ADMIN_EMAILS);
  }
  return isMatch;
};
