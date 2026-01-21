import { sendGAEvent } from '@next/third-parties/google';

/**
 * Analytics System Configuration - Data Quality Layer
 * ------------------------------------------------------------------
 * Centralized tracking logic for Ddreams 3D.
 * Uses Google Analytics 4 (GA4) as the primary backend.
 *
 * Goals:
 * - Measure real business actions (Leads, Quotes, WhatsApp contacts).
 * - Distinguish between B2B (Services) and B2C (Catalog) traffic.
 * - Provide rich context for every event.
 * - ENSURE DATA QUALITY: Type safety, validation, normalization, deduping.
 *
 * --- USAGE GUIDE ---
 *
 * 1. Disparar un evento existente:
 *    import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';
 *
 *    trackEvent(AnalyticsEvents.REQUEST_QUOTE_CLICK, {
 *      location: AnalyticsLocations.NAVBAR,
 *      label: 'Main CTA'
 *    });
 *
 * 2. Agregar un nuevo evento:
 *    - Agrega el nombre del evento en `AnalyticsEvents` (en este archivo).
 *    - Si es un evento de conversión clave, mapealo en `mapToStandardEvents` a un evento estándar de GA4.
 *
 * 3. Segmentación Automática:
 *    - El sistema infiere automáticamente si es B2B o CATALOG basado en la URL.
 *
 * 4. Data Quality (Automatic):
 *    - Strings are trimmed and truncated (100 chars max).
 *    - Null/Undefined/Empty values are removed.
 *    - Duplicate 'view_*' and navigation events within 500ms are ignored.
 *    - Validation of required parameters in DEV.
 * ------------------------------------------------------------------
 */

// --- 1. Constants & Enums (Avoid Hardcoded Strings) ---

export const AnalyticsEvents = {
  // CTAs
  REQUEST_QUOTE_CLICK: 'request_quote_click',
  QUOTE_SERVICE_CLICK: 'quote_service_click',
  VIEW_CATALOG_CLICK: 'view_catalog_click',
  WHATSAPP_CLICK: 'whatsapp_click',

  // Views
  VIEW_HOME: 'view_home',
  VIEW_SERVICE_DETAIL: 'view_service_detail',
  VIEW_PRODUCT_DETAIL: 'view_product_detail',
  VIEW_PROJECT_DETAIL: 'view_project_detail',
  VIEW_SERVICE_LANDING: 'view_service_landing',

  // Forms
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',

  // Social
  SHARE_CLICK: 'share_click',
  FOLLOW_CLICK: 'follow_click',

  // System / Navigation
  ROUTE_CHANGE: 'route_change',
  ERROR: 'error_captured',
  SEARCH: 'search', // Added for completeness
} as const;

export type AnalyticsEventValue = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];

export const AnalyticsCategories = {
  CTA: 'cta',
  NAVIGATION: 'navigation',
  ENGAGEMENT: 'engagement',
  CONVERSION: 'conversion',
  SYSTEM: 'system',
} as const;

export type AnalyticsCategory = typeof AnalyticsCategories[keyof typeof AnalyticsCategories];

export const AnalyticsLocations = {
  NAVBAR: 'navbar',
  HERO: 'hero',
  FOOTER: 'footer',
  SIDEBAR: 'sidebar',
  PRODUCT_CARD: 'product_card',
  SERVICE_CARD: 'service_card',
  PRODUCT_DETAIL: 'product_detail',
  SERVICE_DETAIL: 'service_detail',
  SERVICE_LANDING: 'service_landing',
  SERVICE_FORM: 'service_form',
  PRODUCT_PAGE: 'product_page',
  SERVICE_PAGE: 'service_page',
  CART_DRAWER: 'cart_drawer',
  CART_PAGE: 'cart_page',
  CHECKOUT_PAGE: 'checkout_page',
  FLOATING_BUTTON: 'floating_button',
  CALL_TO_ACTION: 'call_to_action',
  SEARCH_BAR: 'search_bar',
  GENERAL: 'general',
} as const;

export type AnalyticsLocation = typeof AnalyticsLocations[keyof typeof AnalyticsLocations];

export const AnalyticsSegments = {
  B2B: 'b2b',       // Services, Custom Projects
  CATALOG: 'catalog', // Pre-designed products
  CORPORATE: 'corporate', // About, Home, Contact
} as const;

export type AnalyticsSegment = typeof AnalyticsSegments[keyof typeof AnalyticsSegments];

// --- 2. Types ---

export interface AnalyticsContext {
  location?: AnalyticsLocation | string; // Allow string for flexibility but prefer Enum
  section?: string;
  component?: string;
  [key: string]: unknown; // Changed from any to unknown for safety
}

export interface ItemContext {
  id?: string;
  name?: string;
  category?: string;
  price?: number;
  variant?: string;
}

export interface TrackingOptions {
  category?: AnalyticsCategory | string;
  label?: string;
  value?: number;
  segment?: AnalyticsSegment;
  page_type?: 'home' | 'service' | 'catalog' | 'product' | 'cart' | 'checkout' | 'other';
}

// --- 3. Data Quality Configuration & State ---

const CONFIG = {
  MAX_STRING_LENGTH: 100,
  DEDUP_WINDOW_MS: 1000, // Increased to 1s for views to be safer
  IS_DEV: process.env.NODE_ENV === 'development',
  CLEANUP_PROBABILITY: 0.1, // 10% chance to run cleanup on event
};

// Module-level state for deduping
const recentEvents = new Map<string, number>();

// Lazy cleanup function to avoid background timers
const performLazyCleanup = () => {
  const now = Date.now();
  if (recentEvents.size > 50) { // Only cleanup if map gets big
      recentEvents.forEach((timestamp, key) => {
        if (now - timestamp > CONFIG.DEDUP_WINDOW_MS * 2) {
          recentEvents.delete(key);
        }
      });
  }
};

// Human-friendly metadata to make events easier de entender en los informes
const EVENT_METADATA: Partial<Record<AnalyticsEventValue, {
  es_name: string;
  es_description?: string;
  funnel_step?: string;
  group?: string;
}>> = {
  [AnalyticsEvents.VIEW_HOME]: {
    es_name: 'Vista página principal',
    es_description: 'El usuario ve la página principal del sitio',
    group: 'Navegación',
  },
  [AnalyticsEvents.VIEW_SERVICE_LANDING]: {
    es_name: 'Vista landing de servicio',
    es_description: 'El usuario ve una landing específica de un servicio',
    funnel_step: '01_view_landing',
    group: 'Embudo servicios',
  },
  [AnalyticsEvents.VIEW_SERVICE_DETAIL]: {
    es_name: 'Vista detalle de servicio',
    es_description: 'El usuario ve la página de detalle de un servicio',
    funnel_step: '02_view_service_page',
    group: 'Embudo servicios',
  },
  [AnalyticsEvents.FORM_START]: {
    es_name: 'Comienza formulario de servicio',
    es_description: 'El usuario inicia el formulario (primer paso relevante)',
    funnel_step: '03_form_start',
    group: 'Embudo servicios',
  },
  [AnalyticsEvents.FORM_SUBMIT]: {
    es_name: 'Formulario enviado',
    es_description: 'El usuario completa y envía el formulario',
    funnel_step: '04_form_submit',
    group: 'Embudo servicios',
  },
  [AnalyticsEvents.WHATSAPP_CLICK]: {
    es_name: 'Click a WhatsApp',
    es_description: 'El usuario hace click para ir a WhatsApp',
    funnel_step: '05_whatsapp_click',
    group: 'Embudo servicios',
  },
  [AnalyticsEvents.REQUEST_QUOTE_CLICK]: {
    es_name: 'Click solicitar cotización (productos)',
    es_description: 'Solicitud de cotización desde un producto',
    group: 'Leads',
  },
  [AnalyticsEvents.QUOTE_SERVICE_CLICK]: {
    es_name: 'Click solicitar cotización (servicio)',
    es_description: 'Solicitud de cotización desde un servicio',
    group: 'Leads',
  },
  [AnalyticsEvents.VIEW_PRODUCT_DETAIL]: {
    es_name: 'Vista detalle de producto',
    es_description: 'El usuario ve la página de detalle de un producto',
    group: 'Catálogo',
  },
  [AnalyticsEvents.VIEW_CATALOG_CLICK]: {
    es_name: 'Click ver catálogo',
    es_description: 'El usuario navega hacia el catálogo',
    group: 'Navegación',
  },
  [AnalyticsEvents.VIEW_PROJECT_DETAIL]: {
    es_name: 'Vista detalle de proyecto',
    es_description: 'El usuario ve el detalle de un caso de estudio o proyecto',
    group: 'Portafolio',
  },
  [AnalyticsEvents.SHARE_CLICK]: {
    es_name: 'Click compartir',
    es_description: 'El usuario hace click en un botón de compartir',
    group: 'Engagement',
  },
  [AnalyticsEvents.FOLLOW_CLICK]: {
    es_name: 'Click seguir / redes',
    es_description: 'El usuario hace click para seguir en redes sociales',
    group: 'Engagement',
  },
  [AnalyticsEvents.ROUTE_CHANGE]: {
    es_name: 'Cambio de ruta',
    es_description: 'El usuario navega a una nueva ruta dentro del sitio',
    group: 'Sistema',
  },
  [AnalyticsEvents.ERROR]: {
    es_name: 'Error capturado',
    es_description: 'Se capturó un error en la aplicación',
    group: 'Sistema',
  },
  [AnalyticsEvents.SEARCH]: {
    es_name: 'Búsqueda',
    es_description: 'El usuario realiza una búsqueda en el sitio',
    group: 'Búsqueda',
  },
};

const LOCATION_METADATA: Partial<Record<AnalyticsLocation, {
  es_name: string;
  es_description?: string;
}>> = {
  [AnalyticsLocations.NAVBAR]: {
    es_name: 'Barra de navegación',
    es_description: 'Elementos ubicados en la parte superior del sitio',
  },
  [AnalyticsLocations.HERO]: {
    es_name: 'Sección principal (Hero)',
    es_description: 'Primer bloque destacado de una página',
  },
  [AnalyticsLocations.FOOTER]: {
    es_name: 'Pie de página',
    es_description: 'Zona inferior del sitio',
  },
  [AnalyticsLocations.SIDEBAR]: {
    es_name: 'Barra lateral',
    es_description: 'Menús o módulos laterales',
  },
  [AnalyticsLocations.PRODUCT_CARD]: {
    es_name: 'Tarjeta de producto',
    es_description: 'Listado o grilla de productos',
  },
  [AnalyticsLocations.SERVICE_CARD]: {
    es_name: 'Tarjeta de servicio',
    es_description: 'Listado o grilla de servicios',
  },
  [AnalyticsLocations.PRODUCT_DETAIL]: {
    es_name: 'Detalle de producto (módulo)',
    es_description: 'Bloques dentro de la página de producto',
  },
  [AnalyticsLocations.SERVICE_DETAIL]: {
    es_name: 'Detalle de servicio (módulo)',
    es_description: 'Bloques dentro de la página de servicio',
  },
  [AnalyticsLocations.SERVICE_LANDING]: {
    es_name: 'Landing de servicio',
    es_description: 'Página de aterrizaje específica de un servicio',
  },
  [AnalyticsLocations.SERVICE_FORM]: {
    es_name: 'Formulario de servicio',
    es_description: 'Formulario asociado a un servicio (ej. modelado orgánico)',
  },
  [AnalyticsLocations.PRODUCT_PAGE]: {
    es_name: 'Página de producto',
    es_description: 'URL de detalle de producto',
  },
  [AnalyticsLocations.SERVICE_PAGE]: {
    es_name: 'Página de servicio',
    es_description: 'URL de detalle de servicio',
  },
  [AnalyticsLocations.CART_DRAWER]: {
    es_name: 'Carrito lateral',
    es_description: 'Carrito desplegable',
  },
  [AnalyticsLocations.CART_PAGE]: {
    es_name: 'Página de carrito',
    es_description: 'Página completa del carrito',
  },
  [AnalyticsLocations.CHECKOUT_PAGE]: {
    es_name: 'Página de checkout',
    es_description: 'Flujo de pago o confirmación de pedido',
  },
  [AnalyticsLocations.FLOATING_BUTTON]: {
    es_name: 'Botón flotante',
    es_description: 'Botones fijos en pantalla (ej. WhatsApp flotante)',
  },
  [AnalyticsLocations.CALL_TO_ACTION]: {
    es_name: 'Llamado a la acción',
    es_description: 'CTAs destacados dentro de una sección',
  },
  [AnalyticsLocations.SEARCH_BAR]: {
    es_name: 'Barra de búsqueda',
    es_description: 'Buscador principal o interno',
  },
  [AnalyticsLocations.GENERAL]: {
    es_name: 'General',
    es_description: 'Ubicación genérica o no especificada',
  },
};

// Validation Schemas: Critical fields for specific events
const REQUIRED_PARAMS: Partial<Record<AnalyticsEventValue, string[]>> = {
  [AnalyticsEvents.VIEW_PRODUCT_DETAIL]: ['id', 'name'],
  [AnalyticsEvents.VIEW_SERVICE_DETAIL]: ['id', 'name'],
  [AnalyticsEvents.REQUEST_QUOTE_CLICK]: ['location'],
};

// --- 4. Helpers ---

const cleanParam = (value: unknown): unknown => {
  if (value === null || value === undefined) return undefined;
  
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return undefined;
    return trimmed.length > CONFIG.MAX_STRING_LENGTH
      ? trimmed.substring(0, CONFIG.MAX_STRING_LENGTH)
      : trimmed;
  }
  
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  // Flattening: If value is an object (and not an array), stringify it.
  if (typeof value === 'object' && !Array.isArray(value)) {
     if (CONFIG.IS_DEV) {
         console.warn(`[Analytics] ⚠️ Nested objects are not supported in GA4 params. Key with object value will be stringified:`, value);
     }
     return JSON.stringify(value).substring(0, CONFIG.MAX_STRING_LENGTH);
  }

  return value;
};

const normalizeParams = (params: Record<string, unknown>): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  Object.keys(params).forEach((key) => {
    const value = cleanParam(params[key]);
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

const inferSegment = (path: string, pageType?: string): AnalyticsSegment => {
  if (path.includes('/services') || pageType === 'service') return AnalyticsSegments.B2B;
  if (path.includes('/catalogo') || path.includes('/product') || pageType === 'product' || pageType === 'catalog') return AnalyticsSegments.CATALOG;
  return AnalyticsSegments.CORPORATE;
};

const validateEvent = (eventName: string, params: Record<string, unknown>): boolean => {
  const required = REQUIRED_PARAMS[eventName as AnalyticsEventValue];
  if (!required) return true;

  const missing = required.filter(field => params[field] === undefined || params[field] === null || params[field] === '');
  
  if (missing.length > 0) {
    const msg = `[Analytics] ❌ Invalid Event '${eventName}': Missing required params: ${missing.join(', ')}`;
    if (CONFIG.IS_DEV) {
      console.error(msg, params);
      return false;
    } else {
      console.warn(msg);
      params['dq_issue'] = `missing_${missing.join('_')}`;
    }
  }
  return true;
};

const isAnalyticsExcludedForDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('ddreams_exclude_analytics') === 'true';
  } catch {
    return false;
  }
};

export const trackEvent = (
  eventName: AnalyticsEventValue | string,
  params: AnalyticsContext & ItemContext & TrackingOptions = {}
) => {
  try {
    const isClient = typeof window !== 'undefined';
    if (!isClient) return;

    if (isAnalyticsExcludedForDevice()) {
      if (CONFIG.IS_DEV) {
        console.debug(`[Analytics] 🛡️ Event blocked by Admin Exclusion: ${eventName}`);
      }
      return;
    }

    // 1. Context Enrichment
    const currentPath = window.location.pathname;
    const meta = EVENT_METADATA[eventName as AnalyticsEventValue];
    const locationMeta = params.location
      ? LOCATION_METADATA[params.location as AnalyticsLocation]
      : undefined;
    const segment = params.segment || inferSegment(currentPath, params.page_type);

    const rawParams = {
      ...params,
      ...(meta && {
        event_es_name: meta.es_name,
        event_es_description: meta.es_description,
        event_group: meta.group,
        funnel_step: meta.funnel_step,
      }),
      ...(locationMeta && {
        location_es_name: locationMeta.es_name,
        location_es_description: locationMeta.es_description,
      }),
      path: currentPath,
      segment,
      timestamp: new Date().toISOString(),
    };
    
    // 2. Validation
    const isValid = validateEvent(eventName, rawParams);
    if (!isValid && CONFIG.IS_DEV) return;

    // 3. Normalization
    const finalParams = normalizeParams(rawParams);

    // 4. Smart Deduping
    // Only dedupe VIEW events and Route Changes to prevent React StrictMode double-fires
    // Allow clicks (CTA, etc.) to pass through unless they are suspiciously fast duplicates (debouncing could be handled at UI level)
    const shouldDedupe = eventName.toString().startsWith('view_') || eventName === AnalyticsEvents.ROUTE_CHANGE;
    
    if (shouldDedupe) {
        let identityKey = finalParams.id ? `id:${finalParams.id}` : `path:${finalParams.path}`;
        
        // Fix for pagination/filters: include search params in identity for route changes
        if (eventName === AnalyticsEvents.ROUTE_CHANGE && finalParams.search_params) {
             identityKey += `?${finalParams.search_params}`;
        }

        const signature = `${eventName}|${identityKey}`;
        const now = Date.now();
        const lastTime = recentEvents.get(signature);

        if (lastTime && (now - lastTime) < CONFIG.DEDUP_WINDOW_MS) {
            if (CONFIG.IS_DEV) {
               console.debug(`[Analytics] 🚫 Duplicate prevented: ${eventName} (${signature})`);
            }
            return;
        }
        recentEvents.set(signature, now);
        
        // Lazy Cleanup
        if (Math.random() < CONFIG.CLEANUP_PROBABILITY) {
            performLazyCleanup();
        }
    }

    // 5. Dev Logging
    if (CONFIG.IS_DEV) {
      console.groupCollapsed(`📊 [Analytics] ${eventName}`);
      console.log('Params:', finalParams);
      console.log('Segment:', finalParams.segment);
      if (finalParams.dq_issue) console.warn('Data Quality Issue:', finalParams.dq_issue);
      console.groupEnd();
    }

    // 6. Dispatch
    sendGAEvent('event', eventName, finalParams);
    mapToStandardEvents(eventName, finalParams);

  } catch (error) {
    if (CONFIG.IS_DEV) {
      console.error('[Analytics] Critical Error:', error);
    }
  }
};

const mapToStandardEvents = (eventName: string, params: Record<string, unknown>) => {
  try {
    if (isAnalyticsExcludedForDevice()) {
      if (CONFIG.IS_DEV) {
        console.debug(`[Analytics] 🛡️ Standard GA4 mapping blocked by Admin Exclusion: ${eventName}`);
      }
      return;
    }

    if (eventName === AnalyticsEvents.VIEW_PRODUCT_DETAIL || eventName === AnalyticsEvents.VIEW_SERVICE_DETAIL) {
      sendGAEvent('event', 'view_item', {
        currency: 'PEN',
        value: (params.price as number) || 0,
        items: [{
          item_id: params.id,
          item_name: params.name,
          item_category: params.category,
          price: params.price
        }]
      });
    }

    if (eventName === AnalyticsEvents.REQUEST_QUOTE_CLICK || eventName === AnalyticsEvents.QUOTE_SERVICE_CLICK) {
      sendGAEvent('event', 'generate_lead', {
        currency: 'PEN',
        value: 0
      });
    }
  } catch (e) {
    if (CONFIG.IS_DEV) console.error('[Analytics] Mapping Error:', e);
  }
};

/**
 * Specific helper for Page Views
 */
export const trackPageView = (url: string, pageType?: TrackingOptions['page_type']) => {
  trackEvent('page_view', {
    page_path: url,
    page_type: pageType,
  });
};
