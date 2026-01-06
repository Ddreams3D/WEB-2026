'use server';

import { ServiceLandingsService } from '@/services/service-landings.service';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { revalidatePath } from 'next/cache';

export async function getServiceLandingsAction() {
  return await ServiceLandingsService.getAll();
}

export async function saveServiceLandingAction(landing: ServiceLandingConfig) {
  await ServiceLandingsService.save(landing);
  revalidatePath('/admin/service-landings');
  revalidatePath(`/servicios/${landing.slug}`);
  return { success: true };
}
