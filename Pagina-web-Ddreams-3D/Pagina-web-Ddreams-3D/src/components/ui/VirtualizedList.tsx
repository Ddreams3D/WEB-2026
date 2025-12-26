'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useScrollOptimization } from '@/hooks/usePerformanceOptimization';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll,
  loadingComponent,
  emptyComponent
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isScrolling } = useScrollOptimization();

  // Calcular qué elementos son visibles
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Elementos visibles
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, visibleRange]);

  // Manejar scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);

  // Altura total del contenido
  const totalHeight = items.length * itemHeight;

  // Offset del primer elemento visible
  const offsetY = visibleRange.startIndex * itemHeight;

  if (items.length === 0 && emptyComponent) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ height: containerHeight }}>
        {emptyComponent}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${className} overflow-auto`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Contenedor con altura total para mantener el scrollbar correcto */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Contenedor de elementos visibles */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
        
        {/* Indicador de carga durante scroll rápido */}
        {isScrolling && loadingComponent && (
          <div className="absolute top-2 right-2 z-10">
            {loadingComponent}
          </div>
        )}
      </div>
    </div>
  );
}

// Hook para usar con listas virtualizadas
export function useVirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    scrollTop,
    setScrollTop,
    visibleRange
  };
}

// Componente de lista con carga infinita
interface InfiniteVirtualizedListProps<T> extends Omit<VirtualizedListProps<T>, 'items'> {
  items: T[];
  hasNextPage: boolean;
  isLoading: boolean;
  loadMore: () => void;
  threshold?: number;
}

export function InfiniteVirtualizedList<T>({
  items,
  hasNextPage,
  isLoading,
  loadMore,
  threshold = 5,
  ...listProps
}: InfiniteVirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const loadMoreRef = useRef(loadMore);
  
  // Actualizar ref para evitar stale closures
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  // Detectar cuando necesitamos cargar más elementos
  useEffect(() => {
    if (!hasNextPage || isLoading) return;

    const { itemHeight, containerHeight } = listProps;
    const currentIndex = Math.floor(scrollTop / itemHeight);
    const shouldLoadMore = currentIndex >= items.length - threshold;

    if (shouldLoadMore) {
      loadMoreRef.current();
    }
  }, [scrollTop, items.length, hasNextPage, isLoading, threshold, listProps]);

  const handleScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
    listProps.onScroll?.(newScrollTop);
  }, [listProps]);

  return (
    <VirtualizedList
      {...listProps}
      items={items}
      onScroll={handleScroll}
    />
  );
}

export default VirtualizedList;