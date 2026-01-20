'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Star, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ScrollManager } from '@/hooks/useScrollRestoration';
import { Service } from '@/shared/types/domain';
import { ProductImage } from '@/shared/components/ui/DefaultImage';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';

interface ServiceCardProps {
  service: Service;
  className?: string;
  onViewDetails?: (service: Service) => void;
  customAction?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export function ServiceCard({ 
  service, 
  className = '', 
  onViewDetails,
  customAction
}: ServiceCardProps) {
  const pathname = usePathname();

  // Services use 'general-service' logic by default for URL construction in this context
  // or we can use the dedicated service detail page if it exists.
  // We use /services/[slug] for services.
  
  let serviceUrl = `/services/${service.slug || service.id}`;

  // Custom override for "Soportes Personalizados" to point to the new independent landing
  if (service.slug === 'soportes-personalizados-dispositivos') {
    serviceUrl = '/soportes-personalizados';
  }

  const images = service.images || [];
  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  const imagePosition = primaryImage?.imagePosition || 'object-center';

  const imageStyle = React.useMemo(() => ({ 
    objectFit: 'cover' as const, 
    objectPosition: imagePosition.replace('object-', '').replace('[', '').replace(']', '').replace('_', ' ') 
  }), [imagePosition]);

  const renderContent = () => (
    <>
      {/* Service Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ProductImage
          src={primaryImage?.url}
          alt={primaryImage?.alt || `Imagen del servicio ${service.name}`}
          fill
          className={cn(
            "w-full h-full group-hover:scale-105 transition-transform duration-1000 ease-out z-10 relative",
            imagePosition
          )}
          style={imageStyle}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Soft Overlay on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-0 bg-black/10" />
      </div>

      {/* Service Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        <p className="text-xs text-primary font-medium mb-1 uppercase tracking-wide">
          {service.categoryName}
        </p>

        {/* Service Name */}
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1 leading-relaxed">
          {service.shortDescription || service.description}
        </p>

        {/* Rating */}
        {service.rating && (
          <div className="flex items-center justify-between mb-3 mt-auto">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-foreground">
                {service.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* Price / Quote Info */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground whitespace-pre-line">
              {service.customPriceDisplay || (service.price && service.price > 0 ? `Desde S/ ${service.price.toFixed(2)}` : 'Cotización personalizada')}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={cn(
      "group relative border border-border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out overflow-hidden flex flex-col h-full",
      "bg-card text-card-foreground",
      className
    )}>
      {onViewDetails ? (
        <div 
          onClick={() => onViewDetails(service)}
          className="flex-1 flex flex-col relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-t-xl"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onViewDetails(service);
            }
          }}
        >
          {renderContent()}
        </div>
      ) : (
        <Link 
          href={serviceUrl}
          className="flex-1 flex flex-col relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-t-xl"
          onClick={() => {
            // Save scroll position
            if (typeof window !== 'undefined') {
              ScrollManager.save(pathname, window.scrollY);
            }
          }}
        >
          {renderContent()}
        </Link>
      )}

      {/* Buttons */}
      <div className="p-4 pt-0 space-y-2 mt-auto">
        {onViewDetails ? (
          <Button
            onClick={() => onViewDetails(service)}
            variant="outline"
            className="w-full border-border hover:bg-muted"
          >
            Ver detalles
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="w-full border-border hover:bg-muted"
          >
            <Link 
              href={serviceUrl}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  ScrollManager.save(pathname, window.scrollY);
                }
              }}
            >
              Ver detalles
            </Link>
          </Button>
        )}

        
        {customAction && (
          <Button
            asChild
            variant="gradient"
            className="w-full group/btn"
          >
            <Link
              href={customAction.href}
              className="flex items-center justify-center space-x-2"
              onClick={() => {
                trackEvent(AnalyticsEvents.QUOTE_SERVICE_CLICK, {
                  location: AnalyticsLocations.SERVICE_CARD,
                  label: customAction.label,
                  href: customAction.href,
                  serviceId: service.id
                });
              }}
            >
              {customAction.icon}
              <span>{customAction.label}</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

// Skeleton component for loading states
export function ServiceCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-xl shadow-sm border border-border overflow-hidden animate-pulse flex flex-col h-full",
      "bg-card",
      className
    )}>
      {/* Image Skeleton */}
      <div className={cn("aspect-[4/3]", "bg-muted")} />
      
      {/* Content Skeleton */}
      <div className="p-4 flex-1">
        <div className={cn("h-3 rounded mb-2 w-20", "bg-muted")} />
        <div className={cn("h-5 rounded mb-2", "bg-muted")} />
        <div className={cn("h-4 rounded mb-3 w-3/4", "bg-muted")} />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <div className={cn("h-4 w-4 rounded", "bg-muted")} />
            <div className={cn("h-4 rounded w-8", "bg-muted")} />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col space-y-1">
            <div className={cn("h-6 rounded w-24", "bg-muted")} />
          </div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="p-4 pt-0 mt-auto">
        <div className={cn("h-10 rounded-lg w-full", "bg-muted")} />
      </div>
    </div>
  );
}
