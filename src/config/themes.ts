import { Palette, Gift, Ghost, Heart, ShoppingBag, Flag } from '@/lib/icons';
import { Theme } from '@/contexts/ThemeContext';

export const THEME_CONFIG: Record<Theme, { 
  label: string; 
  description: string;
  icon: any; 
  colorClass: string;
  previewColors: string[];
}> = {
  standard: {
    label: 'Standard',
    description: 'Profesional, tecnológico, confianza. Uso todo el año.',
    icon: Palette,
    colorClass: '',
    previewColors: ['bg-[#00BFB3]', 'bg-[#2B50AA]']
  },
  halloween: {
    label: 'Halloween',
    description: 'Misterio y carácter. Naranja quemado y oscuro.',
    icon: Ghost,
    colorClass: 'text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20',
    previewColors: ['bg-orange-600', 'bg-orange-900']
  },
  promo: {
    label: 'Promo (Black Friday)',
    description: 'Urgencia y conversión. Alto contraste (Negro y Blanco).',
    icon: ShoppingBag,
    colorClass: 'text-neutral-900 hover:text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900',
    previewColors: ['bg-black', 'bg-white']
  },
  'festive-strong': {
    label: 'Festive Strong (Patrio)',
    description: 'Orgullo y firmeza. Bandera del Perú.',
    icon: Flag,
    colorClass: 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20',
    previewColors: ['bg-red-600', 'bg-white', 'bg-red-600']
  },
  'festive-warm': {
    label: 'Festive Warm (Navidad)',
    description: 'Calidez y celebración. Dorado y blanco.',
    icon: Gift,
    colorClass: 'text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20',
    previewColors: ['bg-amber-500', 'bg-white', 'bg-amber-500']
  },
  'festive-soft': {
    label: 'Festive Soft (Madre/Mujer)',
    description: 'Ternura y calma. Rosado bebé y blanco cálido.',
    icon: Heart,
    colorClass: 'text-pink-400 hover:text-pink-500 hover:bg-pink-50 dark:text-pink-300 dark:hover:bg-pink-900/20',
    previewColors: ['bg-pink-300', 'bg-rose-50']
  }
};
