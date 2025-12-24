// Configuraciones de rendimiento para Next.js

/**
 * Precargar rutas críticas al cargar la aplicación
 */
export const CRITICAL_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/process',
  '/services'
];

/**
 * Configuración de lazy loading para componentes pesados
 */
export const LAZY_LOAD_CONFIG = {
  threshold: 0.1, // Cargar cuando el elemento esté 10% visible
  rootMargin: '50px', // Comenzar a cargar 50px antes
};

/**
 * Configuración de transiciones de página
 */
export const PAGE_TRANSITION_CONFIG = {
  duration: 0.3,
  ease: 'easeInOut',
  staggerDelay: 0.1
};

/**
 * Optimizaciones de imágenes
 */
export const IMAGE_OPTIMIZATION = {
  quality: 85,
  formats: ['image/webp', 'image/avif'],
  sizes: {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1024px) 50vw',
    desktop: '33vw'
  }
};

/**
 * Configuración de cache para recursos estáticos
 */
export const CACHE_CONFIG = {
  images: 'public, max-age=31536000, immutable',
  fonts: 'public, max-age=31536000, immutable',
  css: 'public, max-age=31536000, immutable',
  js: 'public, max-age=31536000, immutable'
};

/**
 * Función para precargar recursos críticos
 */
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Precargar fuentes críticas
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter-var.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    // Precargar CSS crítico
    const cssLink = document.createElement('link');
    cssLink.rel = 'preload';
    cssLink.href = '/styles/critical.css';
    cssLink.as = 'style';
    document.head.appendChild(cssLink);
  }
}

/**
 * Función para optimizar el rendimiento de scroll
 */
export function optimizeScrollPerformance() {
  if (typeof window !== 'undefined') {
    let ticking = false;

    function updateScrollPosition() {
      // Lógica de scroll optimizada
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
  }
}

/**
 * Función para detectar conexión lenta y ajustar comportamiento
 */
interface NetworkInformation {
  effectiveType?: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

export function detectSlowConnection(): boolean {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as NavigatorWithConnection).connection;
    return Boolean(connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'));
  }
  return false;
}

/**
 * Configuración adaptativa basada en la conexión
 */
export function getAdaptiveConfig() {
  const isSlowConnection = detectSlowConnection();
  
  return {
    enableAnimations: !isSlowConnection,
    imageQuality: isSlowConnection ? 60 : 85,
    prefetchOnHover: !isSlowConnection,
    lazyLoadThreshold: isSlowConnection ? 0.3 : 0.1
  };
}