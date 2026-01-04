import { Metadata } from 'next';
import CampaignsManager from '@/features/admin/components/CampaignsManager';

export const metadata: Metadata = {
  title: 'Gestión de Campañas | Admin',
  description: 'Administra las campañas estacionales y landing pages.',
};

export default function AdminCampaignsPage() {
  return (
    <div className="p-6">
      <CampaignsManager />
    </div>
  );
}
