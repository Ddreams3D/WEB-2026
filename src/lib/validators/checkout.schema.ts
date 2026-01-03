import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  city: z.string().min(2, { message: "La ciudad es obligatoria" }),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
