'use server';

import { z } from 'zod';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { ActionResponse } from '@/shared/types/actions';
import { verifyAdminSession } from '@/lib/auth-admin';
import { revalidatePath } from 'next/cache';

// --- Zod Schemas ---

const ServiceLandingItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  image: z.string().optional(),
});

const ServiceLandingSectionSchema = z.object({
  id: z.string(),
  type: z.enum(['hero', 'features', 'gallery', 'cta', 'testimonials', 'faq', 'focus', 'process']),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  items: z.array(ServiceLandingItemSchema).optional(),
});

const ServiceLandingConfigSchema = z.object({
  id: z.string(),
  slug: z.string().min(1, "El slug es requerido").regex(/^[a-z0-9-]+$/, "El slug solo puede contener minúsculas, números y guiones"),
  name: z.string().min(1, "El nombre interno es requerido"),
  isActive: z.boolean(),
  themeMode: z.enum(['light', 'dark', 'system']),
  metaTitle: z.string(),
  metaDescription: z.string(),
  primaryColor: z.string().optional(),
  heroImage: z.string().optional(),
  featuredTag: z.string().optional(),
  sections: z.array(ServiceLandingSectionSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.string().optional(),
});

// --- Actions ---

export async function getServiceLandingsAction(): Promise<ActionResponse<ServiceLandingConfig[]>> {
  try {
    const data = await ServiceLandingsService.getAll();
    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to fetch service landings:', error);
    return { success: false, error: error.message || 'Failed to fetch service landings' };
  }
}

export async function saveServiceLandingAction(landing: ServiceLandingConfig): Promise<ActionResponse<void>> {
  // 0. Verificar Autenticación
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  // 1. Validación Zod
  const validation = ServiceLandingConfigSchema.safeParse(landing);

  if (!validation.success) {
    // Retornamos el primer error encontrado para simplificar
    const errorMsg = validation.error.issues[0].message + (validation.error.issues[0].path.length > 0 ? ` en ${validation.error.issues[0].path.join('.')}` : '');
    return {
      success: false,
      error: errorMsg
    };
  }

  try {
    // Usamos los datos validados
    await ServiceLandingsService.save(validation.data as ServiceLandingConfig);
    revalidatePath('/admin/service-landings');
    revalidatePath(`/servicios/${validation.data.slug}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error('Failed to save service landing:', error);
    return { success: false, error: error.message || 'Failed to save service landing' };
  }
}
