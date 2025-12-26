/**
 * Configuración centralizada de espaciado para Ddreams 3D
 * Este archivo define todos los espaciados utilizados en el proyecto para mantener consistencia
 */

export const spacing = {
  // Espaciado base para contenedores principales
  container: {
    // Padding horizontal para contenedores
    px: 'px-4 sm:px-6 lg:px-8',
    // Padding vertical para secciones
    py: 'py-8 sm:py-12 lg:py-16',
    pyLarge: 'py-12 sm:py-16 lg:py-20',
    pySmall: 'py-6 sm:py-8 lg:py-12',
    // Max width para contenedores
    maxWidth: 'max-w-7xl mx-auto'
  },
  
  // Espaciado para componentes
  component: {
    // Padding interno de componentes
    padding: {
      small: 'p-3 sm:p-4',
      medium: 'p-4 sm:p-5',
      large: 'p-6 sm:p-8',
      xlarge: 'p-8 sm:p-10'
    },
    
    // Margin entre componentes
    margin: {
      small: 'mb-4 sm:mb-6',
      medium: 'mb-6 sm:mb-8',
      large: 'mb-8 sm:mb-12',
      xlarge: 'mb-12 sm:mb-16'
    },
    
    // Gaps para grids y flex
    gap: {
      small: 'gap-3 sm:gap-4',
      medium: 'gap-4 sm:gap-6',
      large: 'gap-6 sm:gap-8',
      xlarge: 'gap-8 sm:gap-10'
    }
  },
  
  // Espaciado para botones
  button: {
    // Padding interno de botones
    small: 'px-3 py-1.5',
    medium: 'px-4 py-2',
    large: 'px-6 py-3',
    xlarge: 'px-8 py-4',
    
    // Padding responsivo
    responsive: {
      small: 'px-2.5 py-1.5 sm:px-3 sm:py-2',
      medium: 'px-4 py-2.5 sm:px-6 sm:py-3',
      large: 'px-5 py-2.5 sm:px-[22px] sm:py-2.5'
    },
    
    // Espaciado entre botones
    group: 'gap-3 sm:gap-4'
  },
  
  // Espaciado para formularios
  form: {
    // Espaciado entre campos
    fieldGap: 'space-y-4 sm:space-y-6',
    // Padding interno de inputs
    inputPadding: 'px-3 py-2.5 sm:px-4 sm:py-3',
    // Margin para labels
    labelMargin: 'mb-2',
    // Espaciado para grupos de campos
    groupGap: 'space-y-6 sm:space-y-8'
  },
  
  // Espaciado para navegación
  navigation: {
    // Espaciado entre elementos del navbar
    itemGap: 'space-x-1 sm:space-x-2',
    // Padding para elementos de navegación
    itemPadding: 'px-4 py-2',
    // Espaciado para menú móvil
    mobileGap: 'space-y-2 sm:space-y-4',
    mobilePadding: 'px-4 py-3'
  },
  
  // Espaciado para cards y testimonios
  card: {
    // Padding interno
    padding: 'p-4 sm:p-5 lg:p-6',
    paddingLarge: 'p-6 sm:p-8',
    // Espaciado entre elementos internos
    contentGap: 'space-y-3 sm:space-y-4',
    // Margin bottom para elementos
    elementMargin: {
      small: 'mb-2 sm:mb-3',
      medium: 'mb-3 sm:mb-4',
      large: 'mb-4 sm:mb-6'
    }
  },
  
  // Espaciado para grids
  grid: {
    // Gaps para diferentes tipos de grids
    testimonials: 'gap-4 md:gap-5 lg:gap-6',
    projects: 'gap-4 sm:gap-6',
    benefits: 'gap-8',
    stats: 'gap-6 sm:gap-8'
  },
  
  // Espaciado para texto
  text: {
    // Margin bottom para títulos
    headingMargin: {
      small: 'mb-3 sm:mb-4',
      medium: 'mb-4 sm:mb-6',
      large: 'mb-6 sm:mb-8'
    },
    // Margin bottom para párrafos
    paragraphMargin: 'mb-4 sm:mb-6',
    // Espaciado entre líneas de texto
    lineHeight: 'leading-relaxed'
  },
  
  // Espaciado para elementos flotantes
  floating: {
    // Posicionamiento para elementos absolutos
    topRight: 'top-2 sm:top-4 right-2 sm:right-4',
    topLeft: 'top-2 sm:top-4 left-2 sm:left-4',
    bottomRight: 'bottom-4 right-4',
    bottomLeft: 'bottom-4 left-4',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }
} as const;

// Funciones helper para generar clases de espaciado
export const getContainerClasses = () => {
  return `${spacing.container.maxWidth} ${spacing.container.px}`;
};

export const getSectionClasses = (size: 'small' | 'medium' | 'large' = 'medium') => {
  const pyClass = size === 'small' ? spacing.container.pySmall : 
                  size === 'large' ? spacing.container.pyLarge : 
                  spacing.container.py;
  return `${pyClass} ${getContainerClasses()}`;
};

export const getCardClasses = (size: 'small' | 'medium' | 'large' = 'medium') => {
  const padding = size === 'small' ? spacing.component.padding.small :
                  size === 'large' ? spacing.component.padding.large :
                  spacing.component.padding.medium;
  return padding;
};

export const getButtonClasses = (size: 'small' | 'medium' | 'large' = 'medium', responsive: boolean = true) => {
  if (responsive) {
    return spacing.button.responsive[size];
  }
  return spacing.button[size];
};

// Clases de utilidad comunes
export const commonSpacing = {
  // Sección estándar
  section: getSectionClasses(),
  sectionLarge: getSectionClasses('large'),
  sectionSmall: getSectionClasses('small'),
  
  // Container estándar
  container: getContainerClasses(),
  
  // Card estándar
  card: getCardClasses(),
  cardLarge: getCardClasses('large'),
  
  // Botón estándar
  button: getButtonClasses(),
  buttonLarge: getButtonClasses('large'),
  
  // Espaciado común para elementos
  elementGap: spacing.component.gap.medium,
  contentGap: spacing.card.contentGap,
  
  // Margin común
  marginBottom: spacing.component.margin.medium,
  marginBottomLarge: spacing.component.margin.large
};