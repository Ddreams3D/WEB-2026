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
  PRODUCT_PAGE: 'product_page',
  SERVICE_PAGE: 'service_page',
  CART_DRAWER: 'cart_drawer',
  CART_PAGE: 'cart_page',
  CHECKOUT_PAGE: 'checkout_page',
  FLOATING_BUTTON: 'floating_button',
  CALL_TO_ACTION: 'call_to_action',
  SEARCH_BAR: 'search_bar',
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
      return false; // In DEV, fail hard
    } else {
      console.warn(msg);
      params['dq_issue'] = `missing_${missing.join('_')}`;
    }
  }
  return true;
};

// --- 5. Main Tracking Function ---

export const trackEvent = (
  eventName: AnalyticsEventValue | string,
  params: AnalyticsContext & ItemContext & TrackingOptions = {}
) => {
  try {
    const isClient = typeof window !== 'undefined';
    if (!isClient) return;

    // 1. Context Enrichment
    const currentPath = window.location.pathname;
    const rawParams = {
      ...params,
      path: currentPath,
      segment: params.segment || inferSegment(currentPath, params.page_type),
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
}

/**
 * Specific helper for Page Views
 */
export const trackPageView = (url: string, pageType?: TrackingOptions['page_type']) => {
  trackEvent('page_view', {
    page_path: url,
    page_type: pageType,
  });
};
