import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/shared/components/layout/Footer';
import WhatsAppFloatingButton from '@/shared/components/layout/WhatsAppFloatingButton';

export const metadata: Metadata = {
  title: 'Mi Perfil | Ddreams 3D',
  description: 'Gestiona tu información personal y preferencias.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
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
