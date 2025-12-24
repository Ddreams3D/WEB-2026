/**
 * Configuración centralizada de colores para Ddreams 3D
 * Este archivo define todos los colores utilizados en el proyecto para mantener consistencia
 */

export const colors = {
  // Colores primarios y secundarios
  primary: {
    50: 'primary-50',
    100: 'primary-100',
    200: 'primary-200',
    300: 'primary-300',
    400: 'primary-400',
    500: 'primary-500',
    600: 'primary-600',
    700: 'primary-700',
    800: 'primary-800',
    900: 'primary-900',
    950: 'primary-950',
  },
  secondary: {
    50: 'secondary-50',
    100: 'secondary-100',
    200: 'secondary-200',
    300: 'secondary-300',
    400: 'secondary-400',
    500: 'secondary-500',
    600: 'secondary-600',
    700: 'secondary-700',
    800: 'secondary-800',
    900: 'secondary-900',
    950: 'secondary-950',
  },

  // Gradientes estandarizados
  gradients: {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500',
    primaryHover: 'hover:from-secondary-500 hover:to-primary-500',
    primaryBr: 'bg-gradient-to-br from-primary-500 to-secondary-500',
    primaryBrHover: 'hover:from-secondary-500 hover:to-primary-500',

    // Gradientes de fondo
    backgroundLight:
      'bg-gradient-to-br from-neutral-50 via-white to-neutral-100',
    backgroundDark:
      'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900',

    // Gradientes para texto
    textPrimary:
      'bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent',
    textPrimaryHover:
      'group-hover:from-primary-700 group-hover:to-secondary-700',

    // Gradientes para iconos y elementos decorativos
    iconPrimary:
      'bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500',

    // Gradientes para overlays
    overlayDark: 'bg-gradient-to-t from-black/60 to-transparent',
    overlayLight:
      'bg-gradient-to-r from-transparent via-white/10 to-transparent',
  },

  // Estados de hover estandarizados
  hover: {
    primary: 'hover:text-primary-500',
    primaryDark: 'dark:hover:text-primary-400',
    secondary: 'hover:text-secondary-500',
    secondaryDark: 'dark:hover:text-secondary-400',

    // Backgrounds de hover
    primaryBg: 'hover:bg-primary-50 dark:hover:bg-primary-950',
    secondaryBg: 'hover:bg-secondary-50 dark:hover:bg-secondary-950',
    neutralBg: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
  },

  // Estados de focus estandarizados
  focus: {
    primary: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    primaryDark: 'dark:focus:ring-offset-neutral-900',
    secondary: 'focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
    secondaryDark: 'dark:focus:ring-offset-neutral-800',
  },

  // Colores para redes sociales (estandarizados)
  social: {
    facebook: {
      from: 'from-blue-600',
      to: 'to-blue-700',
      hover: 'hover:from-blue-700 hover:to-blue-800',
      shadow: 'hover:shadow-blue-500/25',
    },
    instagram: {
      from: 'from-pink-600',
      to: 'to-purple-600',
      hover: 'hover:from-pink-700 hover:to-purple-700',
      shadow: 'hover:shadow-pink-500/25',
    },
    tiktok: {
      from: 'from-gray-800',
      to: 'to-gray-900',
      hover: 'hover:from-gray-900 hover:to-black',
      shadow: 'hover:shadow-gray-500/25',
    },
  },

  // Colores de estado
  status: {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-200 dark:border-green-700',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-700',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-200 dark:border-red-700',
    },
    info: {
      bg: 'bg-secondary-50 dark:bg-secondary-900/50',
      text: 'text-secondary-800 dark:text-secondary-300',
      border: 'border-secondary-200 dark:border-secondary-700',
    },
  },
} as const;

// Funciones helper para generar clases de colores
export const getGradientClasses = (type: keyof typeof colors.gradients) => {
  return colors.gradients[type];
};

export const getSocialGradient = (platform: keyof typeof colors.social) => {
  const social = colors.social[platform];
  return `bg-gradient-to-r ${social.from} ${social.to} ${social.hover}`;
};

export const getStatusClasses = (status: keyof typeof colors.status) => {
  const statusColors = colors.status[status];
  return `${statusColors.bg} ${statusColors.text} ${statusColors.border}`;
};

// Clases de utilidad comunes
export const commonClasses = {
  // Botones primarios
  buttonPrimary: `${colors.gradients.primary} ${colors.gradients.primaryHover} text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`,

  // Botones secundarios
  buttonSecondary:
    'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-neutral-800 hover:text-white border-2 border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105',

  // Cards
  card: 'bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',

  // Inputs
  input:
    'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-400 focus:border-primary-500 focus:ring-primary-500',

  // Links
  link: 'text-neutral-400 hover:text-primary-400 transition-colors font-medium',
};
