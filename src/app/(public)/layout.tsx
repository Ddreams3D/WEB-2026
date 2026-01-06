import Navbar from '@/components/layout/Navbar';
import Footer from '@/shared/components/layout/Footer';
import WhatsAppFloatingButton from '@/shared/components/layout/WhatsAppFloatingButton';
import PageTransition from '@/shared/components/ui/PageTransition';
import { fetchLandingMain } from '@/services/landing.service';
import { resolveActiveTheme } from '@/lib/seasonal-service';
import AnnouncementBar from '@/shared/components/layout/AnnouncementBar';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [landingConfig, activeTheme] = await Promise.all([
    fetchLandingMain().catch(() => null),
    resolveActiveTheme().catch(() => null)
  ]);

  return (
    <div className="flex min-h-screen flex-col w-full bg-background pb-16 lg:pb-0">
      <AnnouncementBar config={landingConfig?.announcement} seasonalConfig={activeTheme} />
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
