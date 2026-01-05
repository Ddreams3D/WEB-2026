import { 
  Users, 
  ShoppingBag, 
  Package, 
  CreditCard,
  TrendingUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardStats as DashboardStatsType } from '@/features/admin/hooks/useAdminDashboard';

interface DashboardStatsProps {
  stats: DashboardStatsType;
  loading: boolean;
}

const STAT_ICONS = {
  products: ShoppingBag,
  services: Package,
  orders: CreditCard,
  users: Users
};

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const statCards = [
    { 
      title: 'Productos', 
      value: stats.products.toString(), 
      change: 'En Catálogo', 
      trend: 'neutral',
      icon: STAT_ICONS.products,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    { 
      title: 'Servicios', 
      value: stats.services.toString(), 
      change: 'Activos', 
      trend: 'neutral',
      icon: STAT_ICONS.services,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    { 
      title: 'Pedidos', 
      value: stats.orders.toString(), 
      change: 'Totales', 
      trend: 'up',
      icon: STAT_ICONS.orders,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    { 
      title: 'Usuarios', 
      value: stats.users.toString(), 
      change: 'Registrados', 
      trend: 'up',
      icon: STAT_ICONS.users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div 
          key={index} 
          className="group bg-card hover:bg-card/80 border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-xl transition-colors", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div className={cn("flex items-center text-xs font-medium px-2 py-1 rounded-full", 
              stat.trend === 'up' ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground bg-muted"
            )}>
              {stat.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
              {stat.change}
            </div>
          </div>
          <div className="space-y-1">
            {loading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                {stat.value}
              </h3>
            )}
            <p className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
