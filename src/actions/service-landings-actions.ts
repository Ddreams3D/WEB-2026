'use server';

import { ServiceLandingsService } from '@/services/service-landings.service';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { ActionResponse } from '@/shared/types/actions';
import { revalidatePath } from 'next/cache';

export async function getServiceLandingsAction(): Promise<ActionResponse<ServiceLandingConfig[]>> {
  try {
    const data = await ServiceLandingsService.getAll();
    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to fetch service landings:', error);
    return { success: false, error: error.message || 'Failed to fetch service landings' };
  }
}

export async function saveServiceLandingAction(landing: ServiceLandingConfig): Promise<ActionResponse<void>> {
  try {
    await ServiceLandingsService.save(landing);
    revalidatePath('/admin/service-landings');
    revalidatePath(`/servicios/${landing.slug}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error('Failed to save service landing:', error);
    return { success: false, error: error.message || 'Failed to save service landing' };
  }
}
