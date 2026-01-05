'use server'

import { revalidatePath } from 'next/cache';

export async function revalidateSeoPath(path: string) {
  try {
    revalidatePath(path);
    // Also revalidate root if needed, or layout
    // revalidatePath('/', 'layout'); 
    console.log(`[SEO Action] Revalidated path: ${path}`);
  } catch (error) {
    console.error(`[SEO Action] Failed to revalidate path: ${path}`, error);
  }
}
