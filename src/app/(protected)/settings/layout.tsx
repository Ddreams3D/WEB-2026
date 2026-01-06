import Navbar from '@/components/layout/Navbar';
import Footer from '@/shared/components/layout/Footer';
import WhatsAppFloatingButton from '@/shared/components/layout/WhatsAppFloatingButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuración | Ddreams 3D',
  description: 'Gestiona tus preferencias y configuración de cuenta.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col w-full bg-background pb-16 lg:pb-0">
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
