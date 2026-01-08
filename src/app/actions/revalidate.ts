'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyAdminSession } from '@/lib/auth-admin';

export async function revalidateCatalog() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Invalidate Data Cache tags
    revalidateTag('products', 'default');
    revalidateTag('services', 'default');
    revalidateTag('categories', 'default');
    revalidateTag('projects', 'default');
    
    // Invalidate Pages (ISR)
    revalidatePath('/', 'layout'); // Invalidate everything since products/services appear in home, catalog, etc.
    revalidatePath('/catalogo-impresion-3d');
    revalidatePath('/services');
    
    console.log('Catalog revalidated successfully (Tags + Paths)');
    return { success: true };
  } catch (error) {
    console.error('Error revalidating catalog:', error);
    return { success: false, error: 'Failed to revalidate' };
  }
}
