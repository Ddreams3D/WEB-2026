'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_KEY_PREFIX = 'scroll_pos_';
const DEBUG_SCROLL = false;

interface ScrollData {
  y: number;
  timestamp: number;
}

/**
 * Utility to manage scroll position persistence per route
 */
export const ScrollManager = {
  /**
   * Save current scroll position for a specific path
   */
  save: (path: string, y: number) => {
    if (typeof window === 'undefined') return;
    try {
      const data: ScrollData = {
        y,
        timestamp: Date.now()
      };
      const key = `${SCROLL_KEY_PREFIX}${path}`;
      sessionStorage.setItem(key, JSON.stringify(data));
      if (DEBUG_SCROLL) console.log(`[ScrollManager] Saved ${y} for ${path}`);
    } catch (e) {
      console.warn('[ScrollManager] Failed to save scroll:', e);
    }
  },

  /**
   * Get saved scroll position for a specific path
   */
  get: (path: string): number | null => {
    if (typeof window === 'undefined') return null;
    try {
      const key = `${SCROLL_KEY_PREFIX}${path}`;
      const item = sessionStorage.getItem(key);
      if (!item) return null;

      const data: ScrollData = JSON.parse(item);
      // Optional: Expire after X time? For now, keep it simple.
      return data.y;
    } catch (e) {
      return null;
    }
  },

  /**
   * Clear saved scroll position for a specific path
   */
  clear: (path: string) => {
    if (typeof window === 'undefined') return;
    try {
      const key = `${SCROLL_KEY_PREFIX}${path}`;
      sessionStorage.removeItem(key);
      if (DEBUG_SCROLL) console.log(`[ScrollManager] Cleared for ${path}`);
    } catch (e) {
      // ignore
    }
  },

  /**
   * Clear ALL saved scroll positions (useful for full reset)
   */
  clearAll: () => {
    if (typeof window === 'undefined') return;
    try {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(SCROLL_KEY_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      // ignore
    }
  }
};

/**
 * Hook to handle manual scroll restoration
 * @param enabled Whether restoration is enabled
 * @param contentReady Dependency to trigger restoration (e.g. !isLoading && products.length > 0)
 */
export function useScrollRestoration(enabled: boolean, contentReady: boolean) {
  const pathname = usePathname();
  const attemptedRef = useRef(false);

  // 1. Disable browser auto-restoration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    return () => {
      if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // 2. Attempt restoration when content is ready
  useEffect(() => {
    if (!enabled || !contentReady) return;

    // Use a small delay to ensure PageTransition and layout shifts have settled
    const timer = setTimeout(() => {
      if (attemptedRef.current) return;
      
      const savedPos = ScrollManager.get(pathname);
      
      if (savedPos !== null) {
        attemptedRef.current = true;
        const targetPos = savedPos;
        const startTime = Date.now();
        
        if (DEBUG_SCROLL) console.log(`[useScrollRestoration] Attempting restore to ${targetPos} for ${pathname}`);

        const attemptScroll = () => {
          const currentScroll = window.scrollY;

          // Success condition - relaxed tolerance
          if (Math.abs(currentScroll - targetPos) < 50) {
            if (DEBUG_SCROLL) console.log('[useScrollRestoration] Success');
            // Do NOT clear the scroll position automatically. 
            // It should only be cleared on explicit navigation (via Navbar) or new save.
            return;
          }

          // Timeout condition (extended to 5s to account for slow image loading)
          if (Date.now() - startTime > 5000) {
            if (DEBUG_SCROLL) console.log('[useScrollRestoration] Timeout');
            return;
          }

          // Scroll if possible
          const docHeight = document.documentElement.scrollHeight;
          if (docHeight >= targetPos) {
            window.scrollTo({
              top: targetPos,
              behavior: 'instant'
            });
          } else {
             if (DEBUG_SCROLL) console.log(`[useScrollRestoration] Waiting for height: ${docHeight} < ${targetPos}`);
          }

          requestAnimationFrame(attemptScroll);
        };

        requestAnimationFrame(attemptScroll);
      }
    }, 300); // 300ms delay to ensure PageTransition (0.2s) has finished its scrollTo(0,0)

    return () => clearTimeout(timer);
  }, [enabled, contentReady, pathname]);

  // Reset attempted flag when pathname changes
  useEffect(() => {
    attemptedRef.current = false;
  }, [pathname]);

  return {
    saveScroll: () => ScrollManager.save(pathname, window.scrollY),
    clearScroll: () => ScrollManager.clear(pathname)
  };
}
