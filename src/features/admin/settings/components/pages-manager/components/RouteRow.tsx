import React from 'react';
import Link from 'next/link';
import { Copy, ExternalLink, ArrowRight, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RouteItem } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { StatusBadge } from './StatusBadge';

export function RouteRow({ route, isChild = false, onEdit }: { route: RouteItem, isChild?: boolean, onEdit?: (route: RouteItem) => void }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(route.path);
    toast.success('Ruta copiada al portapapeles');
  };

  return (
    <div className={`group flex items-center justify-between p-3 hover:bg-muted/50 transition-colors border-b last:border-0 ${isChild ? 'pl-10 bg-muted/20' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        {!isChild && (
          <div className={`p-2 rounded-md ${route.type === 'Redirect' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-primary/10 text-primary'}`}>
            <CategoryIcon category={route.category} />
          </div>
        )}
        {isChild && <div className="w-6 h-[1px] bg-border mr-1" />}
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium truncate ${isChild ? 'text-sm' : ''}`}>{route.name}</span>
            <Badge variant="outline" className="text-[10px] h-5 font-normal opacity-60">{route.type}</Badge>
            {route.seo?.robots?.includes('noindex') && (
              <Badge variant="destructive" className="text-[10px] h-5 px-1.5 font-normal">No Index</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
            <span className="truncate max-w-[300px]">{route.path}</span>
            {route.redirectTarget && (
              <>
                <ArrowRight className="w-3 h-3" />
                <span className="text-green-600 truncate max-w-[200px]">{route.redirectTarget}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <StatusBadge status={route.status} />
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           {onEdit && (
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(route)} title="Editar SEO">
               <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
             </Button>
           )}
           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} title="Copiar ruta">
             <Copy className="w-3.5 h-3.5 text-muted-foreground" />
           </Button>
           
           {!route.path.includes('[') && !route.path.includes('*') && route.type !== 'Redirect' && (
             <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="Abrir en nueva pestaña">
               <Link href={route.path} target="_blank">
                 <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
               </Link>
             </Button>
           )}
        </div>
      </div>
    </div>
  );
}
