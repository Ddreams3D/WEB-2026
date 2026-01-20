import { ServiceLandingsService } from '@/services/service-landings.service';
import SupportsAdminClient from './client';

export default async function SupportsAdminPage() {
  // Use getAll() to ensure we find the landing even if direct query fails (index issues)
  const allLandings = await ServiceLandingsService.getAll();
  const landing = allLandings.find(l => l.slug === 'soportes-personalizados-dispositivos');

  return <SupportsAdminClient initialLanding={landing || null} />;
}
