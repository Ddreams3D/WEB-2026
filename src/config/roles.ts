export const ADMIN_EMAILS = [
  'admin@mapasconceptuales.com',
  'administrador@ejemplo.com',
  'admin@test.com',
  'dreamings.desings.3d@gmail.com'
];

export const isSuperAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
