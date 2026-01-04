'use server';

import { revalidatePath } from 'next/cache';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { saveSeasonalThemes, getSeasonalThemes } from '@/lib/seasonal-service';

export async function fetchSeasonalThemesAction() {
  try {
    return await getSeasonalThemes();
  } catch (error) {
    console.error('Failed to fetch themes:', error);
    return [];
  }
}

export async function updateSeasonalThemesAction(themes: SeasonalThemeConfig[]) {
  try {
    await saveSeasonalThemes(themes);
    // Revalidate the home page so the new theme takes effect immediately
    revalidatePath('/');
    revalidatePath('/campanas/[slug]'); // Revalidate dynamic routes
    // Also revalidate the admin page
    revalidatePath('/admin/configuracion');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update themes:', error);
    // Return the actual error message to the client for debugging
    throw new Error(error.message || 'Error desconocido al guardar en Firestore');
  }
}

export async function revalidateSeasonalCacheAction() {
  try {
    revalidatePath('/');
    revalidatePath('/campanas/[slug]');
    revalidatePath('/admin/configuracion');
    return { success: true };
  } catch (error) {
    console.error('Revalidation failed:', error);
    return { success: false };
  }
}
