'use client';

import { useAdminDashboard } from '@/features/admin/hooks/useAdminDashboard';
import { DashboardHeader } from '@/features/admin/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/features/admin/components/dashboard/DashboardStats';
import { DashboardActivity } from '@/features/admin/components/dashboard/DashboardActivity';
import { DashboardSidebar } from '@/features/admin/components/dashboard/DashboardSidebar';
import { FirebaseConnect } from '@/features/admin/components/dashboard/FirebaseConnect';

export default function AdminDashboard() {
  const { stats, recentItems, loading } = useAdminDashboard();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader />
      <FirebaseConnect />
      <DashboardStats stats={stats} loading={loading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DashboardActivity recentItems={recentItems} loading={loading} />
        <DashboardSidebar />
      </div>
    </div>
  );
}
