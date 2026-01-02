'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateCatalog() {
  try {
    revalidatePath('/', 'layout'); // Invalidate everything since products/services appear in home, catalog, etc.
    revalidatePath('/catalogo');
    revalidatePath('/servicios');
    console.log('Catalog revalidated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error revalidating catalog:', error);
    return { success: false, error: 'Failed to revalidate' };
  }
}
