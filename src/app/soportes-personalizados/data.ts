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
    title: 'Soportes para Alexa',
    description: 'Personaliza y protege tu asistente de voz con nuestros diseños únicos.',
    items: [
      {
        id: 'alexa-1',
        title: 'Soporte Alexa Echo Dot 4/5 - R2D2',
        description: 'Transforma tu Alexa en el famoso droide de Star Wars.',
        imageUrl: `/${StoragePathBuilder.services('soportes-personalizados')}/alexa-r2d2.jpg`
      },
      {
        id: 'alexa-2',
        title: 'Soporte de Mesa Minimalista',
        description: 'Diseño elegante para cualquier espacio.',
        imageUrl: `/${StoragePathBuilder.services('soportes-personalizados')}/alexa-min.jpg`
      }
    ]
  },
  {
    id: 'nintendo-switch',
    title: 'Soportes para Nintendo Switch',
    description: 'Exhibe y juega con estilo con nuestros diseños temáticos.',
    items: [
      {
        id: 'switch-1',
        title: 'Base Arcade',
        description: 'Estilo retro para tu consola moderna.',
        imageUrl: `/${StoragePathBuilder.services('soportes-personalizados')}/switch-arcade.jpg`
      }
    ]
  },
  {
    id: 'celulares',
    title: 'Soportes para Celulares',
    description: 'Comodidad y diseño para tu smartphone.',
    items: []
  },
  {
    id: 'mandos',
    title: 'Soportes para Mandos',
    description: 'Organiza tus controles de PS5, Xbox y más.',
    items: []
  },
  {
    id: 'otros',
    title: 'Otros Soportes',
    description: 'Soluciones creativas para tus dispositivos.',
    items: []
  }
];
