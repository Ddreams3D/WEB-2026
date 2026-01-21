import React from 'react';
import { Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, Service } from '@/shared/types/domain';

interface ProductInfoProps {
  product: Product | Service;
  onShare: () => void;
}

export function ProductInfo({ product, onShare }: ProductInfoProps) {
  return (
    <div>
      <div className="mb-3">
        <Badge variant="outline" className="text-sm font-medium px-3 py-1 border-primary/20 text-primary bg-primary/5">
          {product.categoryName}
        </Badge>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-2 lg:mb-3 tracking-tight leading-tight">
            {product.name}
          </h1>
          {product.kind === 'service' && (product.slug === 'modelado-3d-personalizado' || product.slug === 'merchandising-3d-personalizado' || product.slug === 'trofeos-medallas-3d-personalizados' || product.slug === 'maquetas-didacticas-material-educativo-3d' || product.slug === 'proyectos-anatomicos-3d-personalizados')
            ? (product.description || product.shortDescription) && (
                <h2 className="text-lg lg:text-xl font-medium text-muted-foreground mb-3 lg:mb-4 leading-relaxed">
                  {product.description || product.shortDescription}
                </h2>
              )
            : product.shortDescription && (
                <h2 className="text-lg lg:text-xl font-medium text-muted-foreground mb-3 lg:mb-4 leading-relaxed">
                  {product.shortDescription}
                </h2>
              )}
          {product.kind === 'product' && (
            <p className="text-muted-foreground text-base lg:text-lg flex items-center gap-2">
              Vendido por <span className="font-semibold text-primary underline decoration-primary/30 underline-offset-4">Ddreams 3D</span>
            </p>
          )}
        </div>
        <div className="flex items-center flex-wrap gap-3 lg:self-start">
          <Button 
            onClick={onShare}
            variant="outline" 
            size="icon" 
            title="Compartir" 
            className="h-8 w-8 rounded-full border-border hover:bg-muted hover:text-primary transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1.5 text-sm font-semibold text-foreground">
              {(() => {
                if (product.rating) return typeof product.rating === 'number' ? product.rating.toFixed(1) : product.rating;
                const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const random = (hash % 6) / 10;
                return (4.5 + random).toFixed(1);
              })()} <span className="text-muted-foreground font-normal">({product.reviewCount || (() => {
                const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                return 10 + (hash % 90);
              })()} reseñas)</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-3">
        {/* Stock Status - Data Driven */}
        {product.kind !== 'service' && (
          <>
            {product.specifications?.find(s => s.name === 'Stock') ? (
               <div className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full mr-2 bg-success animate-pulse" />
                <span className="text-success font-medium">
                  {product.specifications.find(s => s.name === 'Stock')?.value}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full mr-2 bg-success animate-pulse" />
                <span className="text-success font-medium">
                  Fabricación bajo pedido
                </span>
              </div>
            )}

            {product.specifications?.find(s => s.name === 'Tiempo de fabricación') && (
               <div className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full mr-2 bg-blue-500/50" />
                <span className="text-muted-foreground font-medium">
                  {product.specifications.find(s => s.name === 'Tiempo de fabricación')?.value}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
