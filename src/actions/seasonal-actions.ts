'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { ActionResponse } from '@/shared/types/actions';
import { saveSeasonalThemes, getSeasonalThemes } from '@/lib/seasonal-service';
import { verifyAdminSession } from '@/lib/auth-admin';

// --- Zod Schemas ---

const AnnouncementBarConfigSchema = z.object({
  enabled: z.boolean(),
  content: z.string(),
  linkUrl: z.string().optional(),
  linkText: z.string().optional(),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  closable: z.boolean(),
});

const DateRangeSchema = z.object({
  start: z.object({ month: z.number().min(1).max(12), day: z.number().min(1).max(31) }),
  end: z.object({ month: z.number().min(1).max(12), day: z.number().min(1).max(31) }),
});

const SeasonalLandingSchema = z.object({
  themeMode: z.enum(['system', 'light', 'dark']).optional(),
  heroTitle: z.string(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string(),
  heroImage: z.string().optional(),
  heroImages: z.array(z.string()).optional(),
  heroVideo: z.string().optional(),
  ctaText: z.string(),
  ctaLink: z.string(),
  featuredTag: z.string(),
  featuredTitle: z.string().optional(),
});

const SeasonalThemeConfigSchema = z.object({
  id: z.string(),
  themeId: z.any(), // Allowing any string for themeId to match Theme type flexibility
  name: z.string(),
  dateRanges: z.array(DateRangeSchema),
  landing: SeasonalLandingSchema,
  announcement: AnnouncementBarConfigSchema.optional(),
  isActive: z.boolean().optional(),
});

const UpdateSeasonalThemesSchema = z.array(SeasonalThemeConfigSchema);

// --- Actions ---

export async function fetchSeasonalThemesAction(): Promise<ActionResponse<SeasonalThemeConfig[]>> {
  try {
    const data = await getSeasonalThemes();
    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to fetch themes:', error);
    return { success: false, error: error.message || 'Failed to fetch themes' };
  }
}

export async function updateSeasonalThemesAction(themes: SeasonalThemeConfig[]): Promise<ActionResponse<void>> {
  // 0. Verificar Autenticación
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  // 1. Validación Zod
  const validation = UpdateSeasonalThemesSchema.safeParse(themes);

  if (!validation.success) {
     const errorMsg = validation.error.issues[0].message + (validation.error.issues[0].path.length > 0 ? ` en ${validation.error.issues[0].path.join('.')}` : '');
     return {
       success: false,
       error: errorMsg
     };
  }

  try {
    await saveSeasonalThemes(validation.data as SeasonalThemeConfig[]);
    // Revalidate the home page so the new theme takes effect immediately
    revalidatePath('/');
    revalidatePath('/campanas/[slug]'); // Revalidate dynamic routes
    // Also revalidate the admin page
    revalidatePath('/admin/configuracion');
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error('Failed to update themes:', error);
    return { success: false, error: error.message || 'Error desconocido al guardar en Firestore' };
  }
}

export async function revalidateSeasonalCacheAction(): Promise<ActionResponse<void>> {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }
  try {
    revalidatePath('/');
    revalidatePath('/campanas/[slug]');
    revalidatePath('/admin/configuracion');
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error('Revalidation failed:', error);
    return { success: false, error: error.message || 'Revalidation failed' };
  }
}
