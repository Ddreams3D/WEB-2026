'use server';

import { revalidatePath } from 'next/cache';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { ActionResponse } from '@/shared/types/actions';
import { saveSeasonalThemes, getSeasonalThemes } from '@/lib/seasonal-service';

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
  try {
    await saveSeasonalThemes(themes);
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
