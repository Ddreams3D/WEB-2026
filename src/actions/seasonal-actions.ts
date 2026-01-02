'use server';

import { getSeasonalThemes, saveSeasonalThemes } from '@/lib/seasonal-service';
import { SeasonalThemeConfig } from '@/shared/types/seasonal';
import { revalidatePath } from 'next/cache';

export async function fetchSeasonalThemesAction() {
  return await getSeasonalThemes();
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
  } catch (error) {
    console.error('Failed to update themes:', error);
    // Return error structure if needed or let it throw
    throw new Error('Error al guardar en Firestore. Verifique su conexión y permisos.');
  }
}
