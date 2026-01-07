export type PromptScope =
  | 'home'
  | 'web-principal'
  | 'landing-principal'
  | 'landing-campana'
  | 'landing-servicio'
  | 'admin'
  | 'ecommerce'
  | 'marketing'
  | 'services'
  | 'architecture'
  | 'catalog'
  | 'shop'
  | 'global'
  | 'ui'
  | 'backend'
  | 'logic'
  | 'types'
  | 'seo'
  | 'web'
  | 'security'
  | 'email'
  | 'layout'
  | 'navigation'
  | 'footer'
  | 'mobile'
  | 'legal';

export type PromptVocabularyCategory =
  | 'global'
  | 'web'
  | 'admin'
  | 'marketing'
  | 'services';

export interface PromptVocabularyItem {
  id: string;
  term: string;
  meaning: string;
  aliases?: string[];
  scope?: PromptScope[];
  category: PromptVocabularyCategory;
  lastUpdated?: string;
}

