import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Camera, Calendar, MapPin } from 'lucide-react';
import { UserAvatar } from '@/shared/components/ui/DefaultImage';
import { useProfile } from '../hooks/useProfile';

interface ProfileHeaderProps {
  user: any;
  activeOrders: number;
  completedOrders: number;
  favoritesCount: number;
  showSuccess: (title: string, message: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, 
  activeOrders, 
  completedOrders, 
  favoritesCount,
  showSuccess 
}) => {
  if (!user) return null;

  return (
    <Card className="overflow-hidden border-border/50 shadow-md">
      <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/30 relative">
        {/* Cover background */}
      </div>
      <CardContent className="pt-0 relative">
        <div className="flex justify-center -mt-16 mb-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-lg relative">
              {user.photoURL ? (
                <UserAvatar 
                  src={user.photoURL} 
                  alt={user.name || 'User Profile'} 
                  fill
                  className="object-cover" 
                />
              ) : (
                <User className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => showSuccess('Próximamente', 'La subida de avatar estará disponible pronto.')}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              Usuario
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-border/50 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{activeOrders}</p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </div>
          <div className="text-center border-l border-r border-border/50">
            <p className="text-2xl font-bold text-foreground">{completedOrders}</p>
            <p className="text-xs text-muted-foreground">Completados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{favoritesCount}</p>
            <p className="text-xs text-muted-foreground">Favoritos</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />
            <span>Miembro desde {new Date().getFullYear()}</span>
          </div>
          {user.address && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 opacity-70" />
              <span className="truncate">{user.address}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
