import { z } from 'zod';

const cartItemCustomizationSchema = z.object({
  name: z.string(),
  value: z.string(),
  priceModifier: z.number().optional(),
});

// We accept a looser product structure in storage to avoid breaking if Product type evolves slightly,
// but we ensure it has ID and price.
const storedProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  images: z.array(z.any()).optional(),
  kind: z.string().optional(),
}).passthrough(); // Allow other props

const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  product: storedProductSchema,
  quantity: z.number().min(1),
  customizations: z.array(cartItemCustomizationSchema).optional(),
  addedAt: z.union([z.string(), z.date()]), // Can be string in JSON
  notes: z.string().optional(),
});

export const cartSchema = z.object({
  id: z.string(),
  items: z.array(cartItemSchema),
  subtotal: z.number(),
  total: z.number(),
  tax: z.number().optional(),
  shipping: z.number().optional(),
  discount: z.number().optional(),
  currency: z.string().optional(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
}).passthrough();

export type CartStorage = z.infer<typeof cartSchema>;
