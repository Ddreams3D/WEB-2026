import React from 'react';
import { Check, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AppNotification } from '@/shared/types/domain';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NotificationItemProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const router = useRouter();

  const handleAction = () => {
    if (notification.type === 'inbox') {
      // Redirect to finances page with inbox modal trigger
      // Using query params to trigger the modal
      router.push('/admin/finanzas?inbox=open');
      onMarkAsRead(notification.id); // Mark as read when clicked
    } else if (notification.link) {
      router.push(notification.link);
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
        className={cn(
            "p-4 hover:bg-muted/50 transition-colors relative group cursor-pointer",
            !notification.read && "bg-muted/20"
        )}
        onClick={handleAction}
    >
      <div className="flex gap-3">
        <div className={cn(
            "w-2 h-2 mt-2 rounded-full flex-shrink-0",
            !notification.read ? "bg-primary" : "bg-transparent",
            notification.type === 'inbox' && "bg-blue-500"
        )} />
        <div className="flex-1 space-y-1">
          <p className={cn("text-sm font-medium leading-none", !notification.read && "font-semibold")}>
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 pt-1">
             <p className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: es })}
             </p>
             {notification.actionRequired && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                    Revisar <ArrowRight className="w-2 h-2" />
                </span>
             )}
          </div>
        </div>
      </div>
      
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 rounded p-1 shadow-sm border z-10">
        {!notification.read && (
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:text-primary"
                onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                }}
                title="Marcar como leída"
            >
                <Check className="h-3 w-3" />
            </Button>
        )}
        <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
            }}
            title="Eliminar"
        >
            <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
