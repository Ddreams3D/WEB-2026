import { StoreProduct, Service } from './domain';

export type { StoreProduct, Service };

// Discriminator Union
export type CatalogItem = StoreProduct | Service;

// Helper to check kind
export const isService = (item: CatalogItem): item is Service => item.kind === 'service';
export const isProduct = (item: CatalogItem): item is StoreProduct => item.kind === 'product';

// Normalized Sort Date Helper
export const getCatalogSortDate = (item: CatalogItem): number => {
  return new Date(item.createdAt).getTime();
};
