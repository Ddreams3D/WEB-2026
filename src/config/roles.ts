import { EMAIL_BUSINESS } from '@/shared/constants/contactInfo';

export const ADMIN_EMAILS = [
  'dreamings.desings.3d@gmail.com',
  'danielanthonychaina@gmail.com',
  EMAIL_BUSINESS
];

export const isSuperAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
