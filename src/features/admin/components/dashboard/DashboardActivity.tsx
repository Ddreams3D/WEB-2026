import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, CreditCard } from 'lucide-react';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import type { RecentActivityItem } from '@/features/admin/hooks/useAdminDashboard';

interface DashboardActivityProps {
  recentItems: RecentActivityItem[];
  loading: boolean;
}

// Icon helper
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function DashboardActivity({ recentItems, loading }: DashboardActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'product': return <ShoppingBag className="w-4 h-4" />;
      case 'service': return <Package className="w-4 h-4" />;
      case 'order': return <CreditCard className="w-4 h-4" />;
      default: return <ShoppingBag className="w-4 h-4" />;
    }
  };

  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Actividad Reciente</h2>
          <p className="text-sm text-muted-foreground">Últimos productos agregados</p>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
          <Link href="/admin/productos">Ver todos</Link>
        </Button>
      </div>
      
      <div className="space-y-6">
        {loading ? (
           <div className="space-y-4">
             {[1,2,3].map(i => (
               <div key={i} className="flex gap-4 animate-pulse">
                 <div className="w-10 h-10 bg-muted rounded-lg" />
                 <div className="flex-1 space-y-2">
                   <div className="h-4 w-1/3 bg-muted rounded" />
                   <div className="h-3 w-1/4 bg-muted rounded" />
                 </div>
               </div>
             ))}
           </div>
        ) : recentItems.length > 0 ? (
          recentItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground border border-border group-hover:border-primary/50 group-hover:text-primary transition-colors overflow-hidden relative">
                {item.image ? (
                  <ProductImage src={item.image} alt={item.title} fill className="object-cover" />
                ) : (
                  getIcon(item.type)
                )}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-bold">{item.title}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.subtitle}
                </p>
              </div>
              <div className="text-xs text-emerald-500 pt-1 flex items-center font-medium">
                <CheckCircle className="w-3 h-3 mr-1" />
                {item.time}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
        )}
      </div>
    </div>
  );
}
