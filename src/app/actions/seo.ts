'use server'

import { revalidatePath } from 'next/cache';
import { ActionResponse } from '@/shared/types/actions';

export async function revalidateSeoPath(path: string): Promise<ActionResponse<void>> {
  try {
    revalidatePath(path);
    // Also revalidate root if needed, or layout
    // revalidatePath('/', 'layout'); 
    console.log(`[SEO Action] Revalidated path: ${path}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error(`[SEO Action] Failed to revalidate path: ${path}`, error);
    return { success: false, error: error.message || 'Failed to revalidate path' };
  }
}
