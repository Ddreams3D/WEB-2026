import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Heart } from 'lucide-react';

export const ProfileFavoritesTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Mock Favorites Items */}
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow group">
          <div className="aspect-square bg-muted relative">
            {/* Placeholder Image */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
              <Package className="h-12 w-12" />
            </div>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-red-500"
            >
              <Heart className="h-4 w-4 fill-current" />
            </Button>
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium truncate">Pieza de Ingeniería {item}</h3>
            <p className="text-sm text-muted-foreground">S/. 45.00</p>
            <Button className="w-full mt-3" size="sm" variant="outline">
              Ver Producto
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
