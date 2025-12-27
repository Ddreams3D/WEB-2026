/**
 * @deprecated Este archivo está obsoleto. Por favor usa el componente <Button /> de '@/components/ui/button' 
 * y los tokens de diseño de '@/shared/styles/colors'.
 * 
 * Configuración centralizada de botones para Ddreams 3D
 * Este archivo define todos los estilos de botones utilizados en el proyecto para mantener consistencia
 */

import { colors } from './colors';
import { spacing } from './spacing';

export const buttons = {
  // Estilos base para todos los botones
  base: 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  
  // Variantes de botones
  variants: {
    // Botón primario con gradiente
    primary: `${colors.gradients.primary} ${colors.gradients.primaryHover} text-white transform hover:-translate-y-[1px] ${colors.focus.primary}`,
    
    // Botón secundario transparente
    secondary: 'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-neutral-800 hover:text-white border-2 border-white/30 hover:border-white/50 transform hover:scale-105 hover:shadow-xl',
    
    // Botón outline
    outline: `border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400 transform hover:scale-105 ${colors.focus.primary}`,
    
    // Botón ghost
    ghost: `text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-400 transform hover:scale-105`,
    
    // Botón de peligro
    danger: 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    
    // Botón de éxito
    success: 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    
    // Botón social (para redes sociales)
    social: 'text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2'
  },
  
  // Tamaños de botones
  sizes: {
    xs: `${spacing.button.small} text-xs rounded-md`,
    sm: `${spacing.button.medium} text-sm rounded-md`,
    md: `${spacing.button.responsive.medium} text-base rounded-lg`,
    lg: `${spacing.button.responsive.large} text-sm rounded-lg`,
    xl: 'px-8 py-4 sm:px-10 sm:py-5 text-xl rounded-xl'
  },
  
  // Formas especiales
  shapes: {
    rounded: 'rounded-full',
    square: 'rounded-none',
    pill: 'rounded-full px-6'
  },
  
  // Estados especiales
  states: {
    loading: 'cursor-wait opacity-75',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    active: 'scale-95 shadow-inner'
  },
  
  // Botones específicos para iconos
  icon: {
    small: 'p-1.5 rounded-md',
    medium: 'p-2 rounded-lg',
    large: 'p-3 rounded-lg',
    circle: 'rounded-full'
  },
  
  // Grupos de botones
  group: {
    container: `flex ${spacing.button.group}`,
    containerVertical: 'flex flex-col space-y-2',
    containerResponsive: 'flex flex-col sm:flex-row gap-3 sm:gap-4'
  }
} as const;

// Funciones helper para generar clases de botones
export const getButtonClasses = (
  variant: keyof typeof buttons.variants = 'primary',
  size: keyof typeof buttons.sizes = 'md',
  shape?: keyof typeof buttons.shapes,
  state?: keyof typeof buttons.states
) => {
  let classes = `${buttons.base} ${buttons.variants[variant]} ${buttons.sizes[size]}`;
  
  if (shape) {
    classes += ` ${buttons.shapes[shape]}`;
  }
  
  if (state) {
    classes += ` ${buttons.states[state]}`;
  }
  
  return classes;
};

export const getIconButtonClasses = (
  variant: keyof typeof buttons.variants = 'primary',
  size: keyof typeof buttons.icon = 'medium',
  circle: boolean = false
) => {
  let classes = `${buttons.base} ${buttons.variants[variant]} ${buttons.icon[size]}`;
  
  if (circle) {
    classes += ` ${buttons.icon.circle}`;
  }
  
  return classes;
};

export const getSocialButtonClasses = (platform: 'facebook' | 'instagram' | 'tiktok', size: keyof typeof buttons.icon = 'medium') => {
  const socialColors = colors.social[platform];
  return `${buttons.base} ${buttons.variants.social} ${buttons.icon[size]} ${buttons.icon.circle} bg-gradient-to-r ${socialColors.from} ${socialColors.to} ${socialColors.hover} ${socialColors.shadow}`;
};

// Clases predefinidas comunes
export const commonButtons = {
  // Botón primario estándar
  primary: getButtonClasses('primary', 'md'),
  primaryLarge: getButtonClasses('primary', 'lg'),
  primarySmall: getButtonClasses('primary', 'sm'),
  
  // Botón secundario estándar
  secondary: getButtonClasses('secondary', 'md'),
  secondaryLarge: getButtonClasses('secondary', 'lg'),
  
  // Botón outline estándar
  outline: getButtonClasses('outline', 'md'),
  
  // Botón ghost estándar
  ghost: getButtonClasses('ghost', 'md'),
  
  // Botones de icono
  iconPrimary: getIconButtonClasses('primary', 'medium', true),
  iconSecondary: getIconButtonClasses('ghost', 'medium', true),
  
  // Botones sociales
  facebook: getSocialButtonClasses('facebook'),
  instagram: getSocialButtonClasses('instagram'),
  tiktok: getSocialButtonClasses('tiktok'),
  
  // Botones especiales
  cta: `${getButtonClasses('primary', 'lg')} w-full sm:w-auto sm:min-w-[200px]`,
  submit: getButtonClasses('primary', 'md'),
  cancel: getButtonClasses('ghost', 'md'),
  
  // Grupos de botones
  group: buttons.group.container,
  groupVertical: buttons.group.containerVertical,
  groupResponsive: buttons.group.containerResponsive
};

// Tipos para TypeScript
export type ButtonVariant = keyof typeof buttons.variants;
export type ButtonSize = keyof typeof buttons.sizes;
export type ButtonShape = keyof typeof buttons.shapes;
export type ButtonState = keyof typeof buttons.states;
export type IconButtonSize = keyof typeof buttons.icon;
export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok';