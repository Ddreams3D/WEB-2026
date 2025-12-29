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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
