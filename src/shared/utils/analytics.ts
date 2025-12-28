// Definición de tipos para GA4
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js', 
      targetId: string, 
      config?: Record<string, any>
    ) => void;
  }
}

export const analytics = {
  // Enviar evento personalizado
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}`, properties);
    }

    // Enviar a GA4 si existe
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
  },

  // Rastrear vista de página (automático en Next.js App Router con GA component, pero útil para casos manuales)
  trackPageView: (url: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Page View: ${url}`);
    }
    
    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
        page_path: url,
      });
    }
  },

  // Identificar usuario (GA4 usa user_id)
  identifyUser: (userId: string, traits?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Identify: ${userId}`, traits);
    }

    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
        user_id: userId,
        user_properties: traits
      });
    }
  },

  // Eventos sociales específicos
  social: (platform: string, action: string, target: string) => {
    analytics.trackEvent('share', {
      method: platform,
      content_type: action,
      item_id: target
    });
  }
};
