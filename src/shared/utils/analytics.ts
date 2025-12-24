// Analytics utility for Next.js

class Analytics {
  private static instance: Analytics;
  private initialized: boolean = false;
  private measurementId: string = process.env.NEXT_PUBLIC_GA_TRACKING_ID || '';

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  init() {
    if (this.initialized || !this.measurementId) return;

    // GTM ya está inicializado en el HTML, solo configuramos eventos adicionales
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      this.initialized = true;
    }
  }

  pageView(path: string, title?: string) {
    if (typeof window === 'undefined' || !window.dataLayer) return;
    window.dataLayer.push({
      event: 'page_view',
      page_path: path,
      page_title: title,
      page_location: window.location.href
    });
  }

  // Métricas en tiempo real usando GTM
  trackEvent(category: string, action: string, label?: string, value?: number) {
    if (typeof window === 'undefined' || !window.dataLayer) return;
    window.dataLayer.push({
      event: 'custom_event',
      event_category: category,
      event_action: action,
      event_label: label,
      event_value: value
    });
  }

  // Eventos de redes sociales
  social(platform: string, action: string, target: string) {
    if (typeof window === 'undefined' || !window.dataLayer) return;
    window.dataLayer.push({
      event: 'social_interaction',
      social_network: platform,
      social_action: action,
      social_target: target
    });
  }

  // Eventos de comercio electrónico
  trackEcommerce(action: string, data: Record<string, unknown>) {
    if (typeof window === 'undefined' || !window.dataLayer) return;
    window.dataLayer.push({ ecommerce: null }); // Limpiar objeto ecommerce anterior
    window.dataLayer.push({
      event: `ecommerce_${action}`,
      ecommerce: data
    });
  }

  // Eventos de usuario
  trackUserAction(action: string, data: Record<string, unknown>) {
    if (typeof window === 'undefined' || !window.dataLayer) return;
    window.dataLayer.push({
      event: 'user_action',
      action_type: action,
      ...data
    });
  }
}

export const analytics = Analytics.getInstance();

// Inicializar analytics
if (typeof window !== 'undefined') {
  analytics.init();
}

// Extend Window interface for TypeScript
interface DataLayerEvent {
  event?: string;
  page_title?: string;
  page_location?: string;
  custom_parameter?: string;
  ecommerce?: unknown;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}