'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ActionResponse } from '@/shared/types/actions';

const RevalidatePathSchema = z.string().min(1, "El path es requerido").startsWith("/", "El path debe comenzar con /");

export async function revalidateSeoPath(path: string): Promise<ActionResponse<void>> {
  const validation = RevalidatePathSchema.safeParse(path);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message
    };
  }

  try {
    revalidatePath(validation.data);
    // Also revalidate root if needed, or layout
    // revalidatePath('/', 'layout'); 
    console.log(`[SEO Action] Revalidated path: ${validation.data}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error(`[SEO Action] Failed to revalidate path: ${path}`, error);
    return { success: false, error: error.message || 'Failed to revalidate path' };
  }
}
