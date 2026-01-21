import { ServiceLandingsService } from '@/services/service-landings.service';
import SupportsAdminClient from './client';

export default async function SupportsAdminPage() {
  // Use getAll() to ensure we find the landing even if direct query fails (index issues)
  const allLandings = await ServiceLandingsService.getAll();
  // Search by ID to be robust against slug changes/mismatches
  const landing = allLandings.find(l => l.id === 'soportes-personalizados-landing');

  return <SupportsAdminClient initialLanding={landing || null} />;
}
