import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 to-secondary/90 p-8 shadow-xl">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Panel de Control Ddreams 3D
          </h1>
          <p className="text-primary-foreground/80 max-w-xl">
            Sistema sincronizado en tiempo real.
            <br />
            Gestión centralizada de catálogo, servicios y pedidos.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="glass" className="shrink-0" asChild>
              <Link href="/">Ver Tienda</Link>
           </Button>
        </div>
      </div>
    </div>
  );
}
