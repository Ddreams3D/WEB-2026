/**
 * Configuración centralizada de animaciones para Ddreams 3D
 * Este archivo define todas las animaciones y transiciones utilizadas en el proyecto para mantener consistencia
 */

export const animations = {
  // Duraciones estándar
  duration: {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
    slower: 'duration-700',
    slowest: 'duration-1000'
  },
  
  // Tipos de easing
  easing: {
    linear: 'ease-linear',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out'
  },
  
  // Transiciones comunes
  transition: {
    // Transición estándar para la mayoría de elementos
    default: 'transition-all duration-300 ease-out',
    fast: 'transition-all duration-150 ease-out',
    slow: 'transition-all duration-500 ease-out',
    
    // Transiciones específicas
    colors: 'transition-colors duration-300',
    transform: 'transition-transform duration-300 ease-out',
    opacity: 'transition-opacity duration-300',
    shadow: 'transition-shadow duration-300',
    
    // Transiciones para hover
    hover: 'transition-all duration-300 ease-out transform hover:scale-105',
    hoverShadow: 'transition-all duration-300 hover:shadow-xl',
    hoverColors: 'transition-colors duration-300'
  },
  
  // Transformaciones comunes
  transform: {
    // Escalas
    scaleHover: 'hover:scale-105',
    scaleActive: 'active:scale-95',
    scaleSmall: 'hover:scale-[1.005]',
    scaleLarge: 'hover:scale-110',
    
    // Traslaciones
    translateUp: 'hover:-translate-y-1',
    translateUpSmall: 'hover:-translate-y-0.5',
    translateDown: 'hover:translate-y-1',
    translateX: 'hover:translate-x-1',
    
    // Rotaciones
    rotate: 'hover:rotate-12',
    rotateSmall: 'hover:rotate-6',
    
    // Combinaciones comunes
    liftAndScale: 'transform hover:scale-105 hover:-translate-y-1',
    scaleAndRotate: 'transform hover:scale-105 hover:rotate-12'
  },
  
  // Animaciones de entrada (fade in)
  fadeIn: {
    // Clases base para animaciones de entrada
    base: 'opacity-0 translate-y-4',
    visible: 'opacity-100 translate-y-0',
    transition: 'transition-all duration-700 ease-out',
    
    // Delays escalonados para múltiples elementos
    delay: {
      0: 'delay-0',
      100: 'delay-100',
      200: 'delay-200',
      300: 'delay-300',
      500: 'delay-500'
    }
  },
  
  // Animaciones específicas para componentes
  component: {
    // Cards
    card: 'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1',
    cardSubtle: 'transition-all duration-200 hover:scale-[1.005] hover:-translate-y-0.5',
    
    // Botones
    button: 'transition-all duration-300 transform hover:scale-105',
    buttonShadow: 'transition-all duration-300 transform hover:scale-105 hover:shadow-xl',
    
    // Links
    link: 'transition-colors duration-300',
    
    // Iconos
    icon: 'transition-all duration-300 group-hover:scale-110',
    iconRotate: 'transition-all duration-300 group-hover:rotate-12',
    
    // Navbar
    navbar: 'transition-all duration-150 ease-out',
    navbarItem: 'transition-all duration-150 ease-out transform hover:scale-105',
    
    // Modales y overlays
    modal: 'transition-opacity duration-300',
    overlay: 'transition-opacity duration-300',
    
    // Formularios
    input: 'transition-all duration-200 focus:scale-[1.02]',
    inputFocus: 'transition-all duration-200'
  },
  
  // Animaciones de loading
  loading: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping',
    
    // Combinaciones para elementos de loading
    spinSlow: 'animate-spin duration-1000',
    pulseSlow: 'animate-pulse duration-2000'
  },
  
  // Animaciones para estados
  state: {
    // Estados de hover
    hover: {
      lift: 'hover:-translate-y-1 hover:shadow-lg',
      scale: 'hover:scale-105',
      glow: 'hover:shadow-xl hover:shadow-primary-500/25',
      rotate: 'hover:rotate-12'
    },
    
    // Estados de focus
    focus: {
      ring: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      scale: 'focus:scale-[1.02]',
      glow: 'focus:shadow-lg focus:shadow-primary-500/25'
    },
    
    // Estados de active
    active: {
      scale: 'active:scale-95',
      shadow: 'active:shadow-inner'
    }
  },
  
  // Animaciones para elementos específicos
  special: {
    // Partículas flotantes
    particle: 'animate-bounce',
    
    // Elementos que aparecen gradualmente
    slideUp: 'animate-slide-up',
    
    // Efectos de brillo
    shimmer: 'animate-shimmer',
    
    // Efectos de ondas
    ripple: 'animate-ripple'
  }
} as const;

// Funciones helper para generar clases de animación
export const getTransitionClasses = (type: keyof typeof animations.transition = 'default') => {
  return animations.transition[type];
};

export const getFadeInClasses = (visible: boolean, delay: keyof typeof animations.fadeIn.delay = 0) => {
  return `${animations.fadeIn.base} ${animations.fadeIn.transition} ${animations.fadeIn.delay[delay]} ${
    visible ? animations.fadeIn.visible : ''
  }`;
};

export const getComponentAnimation = (component: keyof typeof animations.component) => {
  return animations.component[component];
};

export const getHoverAnimation = (type: keyof typeof animations.state.hover = 'scale') => {
  return `${animations.transition.default} ${animations.state.hover[type]}`;
};

// Clases de utilidad comunes
export const commonAnimations = {
  // Transición estándar
  transition: animations.transition.default,
  transitionFast: animations.transition.fast,
  
  // Hover effects comunes
  hoverScale: `${animations.transition.default} ${animations.transform.scaleHover}`,
  hoverLift: `${animations.transition.default} ${animations.transform.translateUp} ${animations.transition.shadow}`,
  hoverScaleAndLift: `${animations.transition.default} ${animations.transform.liftAndScale}`,
  
  // Animaciones de componentes más usadas
  card: animations.component.card,
  button: animations.component.button,
  link: animations.component.link,
  
  // Estados de focus
  focus: animations.state.focus.ring,
  focusScale: `${animations.state.focus.ring} ${animations.state.focus.scale}`,
  
  // Loading states
  loading: animations.loading.pulse,
  spinning: animations.loading.spin,
  
  // Fade in animation
  fadeIn: getFadeInClasses(false),
  fadeInVisible: getFadeInClasses(true)
};

// Función para generar animaciones escalonadas
export const getStaggeredAnimation = () => {
  return `${animations.fadeIn.base} ${animations.fadeIn.transition} ${animations.fadeIn.visible}`;
};

// Tipos para TypeScript
export type TransitionType = keyof typeof animations.transition;
export type ComponentAnimation = keyof typeof animations.component;
export type HoverType = keyof typeof animations.state.hover;
export type FadeInDelay = keyof typeof animations.fadeIn.delay;