import Navbar from '@/components/layout/Navbar';
import Footer from '@/shared/components/layout/Footer';
import WhatsAppFloatingButton from '@/shared/components/layout/WhatsAppFloatingButton';
import PageTransition from '@/shared/components/ui/PageTransition';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col w-full bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
