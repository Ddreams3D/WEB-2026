export type GlossaryCategory = 
  | 'core' 
  | 'marketing' 
  | 'ecommerce' 
  | 'services' 
  | 'admin' 
  | 'tech' 
  | 'ui' 
  | 'users';

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  category: GlossaryCategory;
  lastUpdated?: string;
}
