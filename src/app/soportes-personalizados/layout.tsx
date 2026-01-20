import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';
import WhatsAppFloatingButton from '@/shared/components/layout/WhatsAppFloatingButton';

export default function SupportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 antialiased">
      <AnalyticsTracker />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.06),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.12),_transparent_55%)] opacity-80" />

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <footer className="py-8 px-4 border-t border-indigo-500/20 bg-slate-50/90 dark:bg-slate-950/90 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 relative z-10">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Ddreams 3D · Soportes personalizados para setups y dispositivos.</p>
        </div>
      </footer>

      <WhatsAppFloatingButton />
    </div>
  );
}
