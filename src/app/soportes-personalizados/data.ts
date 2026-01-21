import { StoragePathBuilder } from '@/shared/constants/storage-paths';

export interface SupportCategory {
  id: string;
  title: string;
  description: string;
  items: SupportItem[];
}

export interface SupportItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  slug?: string;
  categorySlug?: string;
}

export interface SupportHero {
  title: string;
  subtitle: string;
  imageUrl: string;
}

export const DEFAULT_HERO: SupportHero = {
  title: 'Soportes personalizados para tus dispositivos',
  subtitle: 'Ordena tu escritorio y tu zona de juego con soportes diseñados específicamente para tus equipos, sin piezas genéricas.',
  imageUrl: `/${StoragePathBuilder.services('soportes-personalizados')}/hero-placeholder.svg`
};

export const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: 'alexa',
    title: 'Soportes decorativos personalizados para Alexa',
    description: 'Personaliza y protege tu asistente de voz con nuestros diseños únicos.',
    items: []
  },
  {
    id: 'nintendo-switch',
    title: 'Soportes decorativos personalizados para Nintendo Switch',
    description: 'Exhibe y juega con estilo con nuestros diseños temáticos.',
    items: []
  },
  {
    id: 'audifonos',
    title: 'Soportes decorativos personalizados para Audífonos',
    description: 'Cuida y exhibe tus auriculares con estilo y personalidad.',
    items: []
  },
  {
    id: 'celulares',
    title: 'Soportes decorativos personalizados para Celulares',
    description: 'Comodidad y diseño para tu smartphone.',
    items: []
  },
  {
    id: 'mandos',
    title: 'Soportes decorativos personalizados para Mandos',
    description: 'Organiza tus controles de PS5, Xbox y más.',
    items: []
  },
  {
    id: 'otros',
    title: 'Otros soportes decorativos personalizados',
    description: 'Soluciones creativas para tus dispositivos.',
    items: []
  }
];
