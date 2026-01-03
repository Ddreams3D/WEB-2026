'use client';

import { useState } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors relative outline-none focus:ring-2 focus:ring-primary/20">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold text-sm">Notificaciones</h4>
          {unreadCount > 0 && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto px-2 text-xs text-primary hover:text-primary/80"
                onClick={() => markAllAsRead()}
            >
                Marcar todas leídas
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No tienes notificaciones
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                    key={notification.id} 
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
                                markAsRead(notification.id);
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
                            deleteNotification(notification.id);
                        }}
                        title="Eliminar"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
