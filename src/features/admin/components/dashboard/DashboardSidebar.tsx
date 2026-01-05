import Link from 'next/link';
import { ShoppingBag, Package, Briefcase, CreditCard, ArrowRight, Activity } from 'lucide-react';

export function DashboardSidebar() {
  const quickAccess = [
    { name: 'Gestionar Catálogo', href: '/admin/productos', icon: ShoppingBag, desc: 'Administrar productos' },
    { name: 'Gestionar Servicios', href: '/admin/servicios', icon: Package, desc: 'Catálogo de servicios' },
    { name: 'Proyectos', href: '/admin/projects', icon: Briefcase, desc: 'Portafolio de trabajos' },
    { name: 'Ver Pedidos', href: '/admin/pedidos', icon: CreditCard, desc: 'Gestionar ventas' },
  ];

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
        <h2 className="text-lg font-bold text-foreground mb-4">Accesos Rápidos</h2>
        <div className="space-y-3 mb-auto">
          {quickAccess.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.desc}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-xl p-4 border border-violet-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-violet-500 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Estado del Sistema</h3>
            </div>
            <div className="flex items-center justify-between text-sm mt-3">
              <span className="text-muted-foreground">Base de Datos</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                En vivo
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Firebase Storage</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Conectado
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Firestore</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Conectado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
