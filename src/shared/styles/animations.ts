export const animations = {
  fadeIn: "animate-in fade-in duration-500",
  slideUp: "animate-in slide-in-from-bottom duration-500",
  slideDown: "animate-in slide-in-from-top duration-500",
  scaleIn: "animate-in zoom-in duration-500",
};

export const getTransitionClasses = (duration = 300) => `transition-all duration-${duration} ease-in-out`;

export const getFadeInClasses = (delay = 0) => {
  return `opacity-0 animate-in fade-in duration-700 fill-mode-forwards delay-${delay}`;
};

export const getComponentAnimation = (type: keyof typeof animations = 'fadeIn') => {
  return animations[type];
};

export const commonAnimations = {
  pageTransition: "animate-in fade-in slide-in-from-bottom-4 duration-500",
  hoverScale: "hover:scale-105 transition-transform duration-200",
  hoverLift: "hover:-translate-y-1 transition-transform duration-200",
};
