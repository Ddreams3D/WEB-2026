import { z } from 'zod';

const imageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

const specificationSchema = z.object({
  name: z.string().min(1, "El nombre de la especificación es requerido"),
  value: z.string().min(1, "El valor de la especificación es requerido"),
});

export const productSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0, { message: "El precio no puede ser negativo" }),
  categoryId: z.string().min(1, { message: "La categoría es obligatoria" }),
  stock: z.coerce.number().int().min(0, { message: "El stock no puede ser negativo" }),
  images: z.array(imageSchema).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.array(specificationSchema).optional(),
  kind: z.literal('product'),
  materials: z.array(z.string()).optional(),
  slug: z.string().min(1, { message: "El slug es obligatorio" }),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  price: z.coerce.number().min(0, { message: "El precio no puede ser negativo" }),
  categoryId: z.string().min(1, { message: "La categoría es obligatoria" }),
  displayOrder: z.coerce.number().int().optional(),
  images: z.array(imageSchema).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  kind: z.literal('service'),
  slug: z.string().min(1, { message: "El slug es obligatorio" }),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

// Draft Schemas (Solo validan Nombre y Slug)
export const productDraftSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  slug: z.string().min(1, { message: "El slug es obligatorio" }),
  kind: z.literal('product'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export const serviceDraftSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  slug: z.string().min(1, { message: "El slug es obligatorio" }),
  kind: z.literal('service'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
