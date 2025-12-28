import { Metadata } from 'next';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import AdminProtection from '@/components/admin/AdminProtection';

export const metadata: Metadata = {
  title: 'Panel de Administración',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtection>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminProtection>
  );
}
