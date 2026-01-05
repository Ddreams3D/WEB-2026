import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AppNotification } from '@/shared/types/domain';

interface NotificationItemProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  return (
    <div 
        className={cn(
            "p-4 hover:bg-muted/50 transition-colors relative group",
            !notification.read && "bg-muted/20"
        )}
    >
      <div className="flex gap-3">
        <div className={cn(
            "w-2 h-2 mt-2 rounded-full flex-shrink-0",
            !notification.read ? "bg-primary" : "bg-transparent"
        )} />
        <div className="flex-1 space-y-1">
          <p className={cn("text-sm font-medium leading-none", !notification.read && "font-semibold")}>
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {notification.message}
          </p>
          <p className="text-[10px] text-muted-foreground pt-1">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: es })}
          </p>
        </div>
      </div>
      
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 rounded p-1 shadow-sm border">
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
