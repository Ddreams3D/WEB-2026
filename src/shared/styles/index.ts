/**
 * Índice centralizado de estilos para Ddreams 3D
 * Este archivo exporta todas las configuraciones de estilos del proyecto
 */

// Exportar configuraciones específicas para evitar conflictos
export { colors, getGradientClasses, getSocialGradient, getStatusClasses } from './colors';
export { spacing, getContainerClasses, getSectionClasses, getCardClasses } from './spacing';
export { buttons, getIconButtonClasses, getSocialButtonClasses } from './buttons';
export { animations, getTransitionClasses, getFadeInClasses, getComponentAnimation } from './animations';
export { icons, getIconClasses, getIconContainerClasses, getContextualIconClasses, getSocialIconClasses } from './icons';
export { forms, getInputClasses, getLabelClasses, getTextareaClasses, getValidationClasses, getFormButtonClasses } from './forms';

// Importar configuraciones para crear un objeto unificado
import { colors, commonClasses as colorUtilities } from './colors';
import { spacing, commonSpacing as spacingUtilities } from './spacing';
import { buttons, commonButtons as buttonUtilities } from './buttons';
import { animations, commonAnimations } from './animations';
import { icons, commonIconClasses } from './icons';
import { forms, commonFormClasses } from './forms';

// Objeto unificado con todas las configuraciones
export const ddreamsStyles = {
  colors,
  spacing,
  buttons,
  animations,
  icons,
  forms
} as const;


// Re-exportar utilidades
export const gradients = colors.gradients;
export { colorUtilities };
export { spacingUtilities };
export { buttonUtilities };

// Utilidades comunes más usadas
export const commonStyles = {
  // Colores
  ...colorUtilities,
  
  // Espaciado
  ...spacingUtilities,
  
  // Botones
  ...buttonUtilities,
  
  // Animaciones
  ...commonAnimations,
  transition: "transition-all duration-300 ease-in-out",
  
  // Iconos
  ...commonIconClasses,
  
  // Formularios
  ...commonFormClasses
} as const;

// Las funciones helper se exportan automáticamente a través de export * from './archivo'

// Todas las funciones se exportan automáticamente con export * from './archivo' al inicio

// Configuraciones predefinidas para componentes comunes
export const componentStyles = {
  // Cards
  card: {
    base: `${commonStyles.card} ${commonStyles.transition}`,
    hover: `${commonStyles.card} ${commonStyles.transition} hover:shadow-lg`,
    interactive: `${commonStyles.card} ${commonStyles.transition} hover:shadow-lg cursor-pointer`
  },
  
  // Navegación
  nav: {
    container: commonStyles.container,
    item: `${commonStyles.link} ${commonStyles.transition}`,
    link: `${commonStyles.link} ${commonStyles.transition} hover:text-primary-600`
  },
  
  // Hero sections
  hero: {
    container: commonStyles.container,
    title: 'text-4xl md:text-6xl font-bold text-white mb-6',
    subtitle: 'text-xl md:text-2xl text-white/90 mb-8',
    button: `${colors.gradients.primary} ${colors.gradients.primaryHover} text-white px-8 py-4 rounded-lg font-semibold`
  },
  
  // Secciones
  section: {
    container: commonStyles.container,
    title: 'text-3xl md:text-4xl font-bold text-center mb-4',
    subtitle: 'text-lg text-neutral-600 text-center mb-12'
  },
  
  // Footer
  footer: {
    container: 'bg-neutral-900 text-white py-12',
    section: 'mb-8',
    link: 'text-neutral-300 hover:text-white transition-colors duration-200'
  },
  
  // Formularios
  form: {
    container: commonFormClasses.formCard,
    input: commonFormClasses.input,
    button: commonFormClasses.submitButton,
    error: commonFormClasses.errorMessage
  },
  
  // Botones comunes
  button: {
    primary: `${colors.gradients.primary} ${colors.gradients.primaryHover} text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105`,
    secondary: 'bg-neutral-200 text-neutral-800 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-300 transition-all duration-300',
    outline: 'border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300',
    ghost: 'text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300'
  }
} as const;

// Configuraciones responsivas predefinidas
export const responsiveStyles = {
  // Contenedores responsivos
  container: {
    sm: 'max-w-sm mx-auto px-4',
    md: 'max-w-md mx-auto px-4',
    lg: 'max-w-lg mx-auto px-4',
    xl: 'max-w-xl mx-auto px-4',
    '2xl': 'max-w-2xl mx-auto px-4',
    '4xl': 'max-w-4xl mx-auto px-4',
    '6xl': 'max-w-6xl mx-auto px-4',
    full: 'max-w-full mx-auto px-4'
  },
  
  // Grids responsivos
  grid: {
    auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    two: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    three: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    four: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
  },
  
  // Texto responsivo
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl lg:text-5xl',
    '4xl': 'text-4xl sm:text-5xl lg:text-6xl'
  },
  
  // Espaciado responsivo
  spacing: {
    xs: 'p-2 sm:p-3',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-12'
  }
} as const;

// Tipos para TypeScript
export type DdreamsStylesConfig = typeof ddreamsStyles;
export type CommonStylesConfig = typeof commonStyles;
export type ComponentStylesConfig = typeof componentStyles;
export type ResponsiveStylesConfig = typeof responsiveStyles;

// Función helper para combinar clases
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Función para generar clases condicionales
export const conditionalClasses = (
  condition: boolean,
  trueClasses: string,
  falseClasses: string = ''
): string => {
  return condition ? trueClasses : falseClasses;
};

// Función para generar clases de estado
export const stateClasses = (
  state: 'default' | 'hover' | 'active' | 'focus' | 'disabled',
  baseClasses: string
): string => {
  const stateMap = {
    default: baseClasses,
    hover: `${baseClasses} hover:opacity-80`,
    active: `${baseClasses} active:scale-95`,
    focus: `${baseClasses} focus:ring-2 focus:ring-primary-500`,
    disabled: `${baseClasses} opacity-50 cursor-not-allowed`
  };
  
  return stateMap[state];
};