import { fetchLandingMain, saveLandingMain } from '@/services/landing.service';
import { LandingMainConfig } from '@/shared/types/landing';

export async function getLandingMainConfig(): Promise<LandingMainConfig | null> {
  return await fetchLandingMain();
}

export async function setLandingMainConfig(config: LandingMainConfig): Promise<void> {
  await saveLandingMain(config);
}

