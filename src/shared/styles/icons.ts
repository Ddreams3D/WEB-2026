/**
 * Configuración centralizada de iconos para Ddreams 3D
 * Este archivo define todos los tamaños, estilos y configuraciones de iconos para mantener consistencia
 */

export const icons = {
  // Tamaños estándar de iconos
  size: {
    xs: 'w-3 h-3', // 12px
    sm: 'w-4 h-4', // 16px
    md: 'w-5 h-5', // 20px
    lg: 'w-6 h-6', // 24px
    xl: 'w-8 h-8', // 32px
    '2xl': 'w-10 h-10', // 40px
    '3xl': 'w-12 h-12', // 48px
    '4xl': 'w-16 h-16', // 64px
    '5xl': 'w-20 h-20', // 80px
    '6xl': 'w-24 h-24' // 96px
  },
  
  // Tamaños responsivos
  responsive: {
    // Iconos pequeños que crecen en pantallas grandes
    small: 'w-4 h-4 sm:w-5 sm:h-5',
    medium: 'w-5 h-5 sm:w-6 sm:h-6',
    large: 'w-6 h-6 sm:w-8 sm:h-8',
    xlarge: 'w-8 h-8 sm:w-10 sm:h-10',
    
    // Iconos para hero sections
    hero: 'w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20',
    
    // Iconos para cards
    card: 'w-6 h-6 sm:w-8 sm:h-8',
    
    // Iconos para navegación
    nav: 'w-5 h-5 sm:w-6 sm:h-6'
  },
  
  // Colores estándar para iconos
  color: {
    // Colores primarios
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    
    // Colores neutros
    neutral: 'text-neutral-600',
    muted: 'text-neutral-400',
    light: 'text-neutral-300',
    dark: 'text-neutral-800',
    
    // Colores de estado
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    
    // Colores especiales
    white: 'text-white',
    black: 'text-black',
    
    // Colores con hover
    primaryHover: 'text-neutral-600 hover:text-primary-600',
    secondaryHover: 'text-neutral-600 hover:text-secondary-600',
    mutedHover: 'text-neutral-400 hover:text-neutral-600'
  },
  
  // Estilos de contenedor para iconos
  container: {
    // Contenedores circulares
    circle: {
      sm: 'w-8 h-8 rounded-full flex items-center justify-center',
      md: 'w-10 h-10 rounded-full flex items-center justify-center',
      lg: 'w-12 h-12 rounded-full flex items-center justify-center',
      xl: 'w-16 h-16 rounded-full flex items-center justify-center'
    },
    
    // Contenedores cuadrados
    square: {
      sm: 'w-8 h-8 rounded-lg flex items-center justify-center',
      md: 'w-10 h-10 rounded-lg flex items-center justify-center',
      lg: 'w-12 h-12 rounded-lg flex items-center justify-center',
      xl: 'w-16 h-16 rounded-lg flex items-center justify-center'
    },
    
    // Contenedores con background
    background: {
      primary: 'bg-primary-100 text-primary-600',
      secondary: 'bg-secondary-100 text-secondary-600',
      neutral: 'bg-neutral-100 text-neutral-600',
      success: 'bg-green-100 text-green-600',
      warning: 'bg-yellow-100 text-yellow-600',
      error: 'bg-red-100 text-red-600'
    }
  },
  
  // Animaciones específicas para iconos
  animation: {
    // Rotación
    spin: 'animate-spin',
    spinSlow: 'animate-spin duration-1000',
    
    // Hover effects
    hover: 'transition-all duration-300 group-hover:scale-110',
    hoverRotate: 'transition-all duration-300 group-hover:rotate-12',
    hoverBounce: 'transition-all duration-300 group-hover:animate-bounce',
    
    // Pulse effects
    pulse: 'animate-pulse',
    pulseSlow: 'animate-pulse duration-2000',
    
    // Combinaciones comunes
    interactive: 'transition-all duration-300 hover:scale-110 hover:text-primary-600',
    loading: 'animate-spin text-primary-600',
    success: 'animate-pulse text-green-600'
  },
  
  // Configuraciones por contexto de uso
  context: {
    // Iconos en navegación
    navigation: {
      size: 'w-5 h-5',
      color: 'text-neutral-600 hover:text-primary-600',
      animation: 'transition-colors duration-300'
    },
    
    // Iconos en botones
    button: {
      sm: 'w-4 h-4 text-current',
      md: 'w-5 h-5 text-current',
      lg: 'w-6 h-6 text-current'
    },
    
    // Iconos en cards
    card: {
      header: 'w-6 h-6 sm:w-8 sm:h-8 text-primary-600',
      content: 'w-5 h-5 text-neutral-500',
      action: 'w-4 h-4 text-neutral-400 hover:text-neutral-600 transition-colors duration-200'
    },
    
    // Iconos en formularios
    form: {
      input: 'w-5 h-5 text-neutral-500',
      validation: {
        success: 'w-4 h-4 text-green-600',
        error: 'w-4 h-4 text-red-600',
        warning: 'w-4 h-4 text-yellow-600'
      }
    },
    
    // Iconos en hero sections
    hero: {
      main: 'w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-primary-600',
      feature: 'w-6 h-6 sm:w-8 sm:h-8 text-secondary-600',
      benefit: 'w-5 h-5 sm:w-6 sm:h-6 text-primary-600'
    },
    
    // Iconos sociales
    social: {
      size: 'w-6 h-6',
      animation: 'transition-all duration-200 hover:scale-110',
      colors: {
        facebook: 'text-blue-600 hover:text-blue-700',
        twitter: 'text-sky-500 hover:text-sky-600',
        instagram: 'text-pink-600 hover:text-pink-700',
        linkedin: 'text-blue-700 hover:text-blue-800',
        youtube: 'text-red-600 hover:text-red-700',
        whatsapp: 'text-green-600 hover:text-green-700',
        email: 'text-neutral-600 hover:text-primary-600'
      }
    },
    
    // Iconos de estado
    status: {
      loading: 'w-5 h-5 animate-spin',
      success: 'w-5 h-5 text-green-600',
      error: 'w-5 h-5 text-red-600',
      warning: 'w-5 h-5 text-yellow-600',
      info: 'w-5 h-5 text-blue-600'
    },
    
    // Iconos en listas
    list: {
      bullet: 'w-4 h-4 text-primary-600',
      check: 'w-4 h-4 text-green-600',
      arrow: 'w-4 h-4 text-neutral-500'
    }
  }
} as const;

// Funciones helper para generar clases de iconos
export const getIconClasses = (
  size: keyof typeof icons.size = 'md',
  color: keyof typeof icons.color = 'neutral',
  animation?: keyof typeof icons.animation
) => {
  const classes: string[] = [icons.size[size], icons.color[color]];
  if (animation) {
    classes.push(icons.animation[animation]);
  }
  return classes.join(' ');
};

export const getIconContainerClasses = (
  shape: 'circle' | 'square' = 'circle',
  size: 'sm' | 'md' | 'lg' | 'xl' = 'md',
  background?: keyof typeof icons.container.background
) => {
  const baseClasses = icons.container[shape][size];
  const bgClasses = background ? icons.container.background[background] : '';
  return `${baseClasses} ${bgClasses}`.trim();
};

export const getContextualIconClasses = (
  context: keyof typeof icons.context,
  variant?: string
) => {
  const contextConfig = icons.context[context];
  
  if (typeof contextConfig === 'string') {
    return contextConfig;
  }
  
  if (variant && typeof contextConfig === 'object' && variant in contextConfig) {
    return (contextConfig as Record<string, string>)[variant];
  }
  
  // Retornar configuración por defecto si existe
  if (typeof contextConfig === 'object' && 'size' in contextConfig) {
    return Object.values(contextConfig).join(' ');
  }
  
  return '';
};

export const getSocialIconClasses = (platform: keyof typeof icons.context.social.colors) => {
  return `${icons.context.social.size} ${icons.context.social.animation} ${icons.context.social.colors[platform]}`;
};

// Clases de utilidad comunes
export const commonIconClasses = {
  // Tamaños más usados
  small: icons.size.sm,
  medium: icons.size.md,
  large: icons.size.lg,
  
  // Colores más usados
  primary: icons.color.primary,
  secondary: icons.color.secondary,
  muted: icons.color.muted,
  
  // Animaciones más usadas
  interactive: icons.animation.interactive,
  loading: icons.animation.loading,
  hover: icons.animation.hover,
  
  // Contextos más usados
  button: icons.context.button.md,
  nav: getContextualIconClasses('navigation'),
  card: icons.context.card.content,
  
  // Contenedores más usados
  circleContainer: getIconContainerClasses('circle', 'md'),
  squareContainer: getIconContainerClasses('square', 'md'),
  primaryContainer: getIconContainerClasses('circle', 'md', 'primary')
};

// Tipos para TypeScript
export type IconSize = keyof typeof icons.size;
export type IconColor = keyof typeof icons.color;
export type IconAnimation = keyof typeof icons.animation;
export type IconContext = keyof typeof icons.context;
export type SocialPlatform = keyof typeof icons.context.social.colors;