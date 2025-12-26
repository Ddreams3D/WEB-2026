/**
 * Utility functions for URL handling to prevent runtime errors with 'new URL()'
 */

/**
 * Retrieves the application base URL safely.
 * Prioritizes NEXT_PUBLIC_APP_URL, falls back to window.location.origin (client) or localhost (server).
 */
export function getAppUrl(): string {
  // 1. Try environment variable
  let url = process.env.NEXT_PUBLIC_APP_URL;

  // 2. Fallback to window.location if on client
  if (!url && typeof window !== 'undefined') {
    url = window.location.origin;
  }

  // 3. Fallback to localhost if still undefined (e.g. server-side without env var)
  if (!url) {
    url = 'http://localhost:3000';
  }

  // Normalize: Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  // Verify it's a valid URL
  try {
    new URL(url);
    return url;
  } catch (e) {
    console.warn(`Invalid URL configuration detected: "${url}". Falling back to http://localhost:3000`);
    return 'http://localhost:3000';
  }
}

/**
 * Safely constructs a URL object, handling undefined/null/invalid inputs.
 */
export function safeUrl(urlStr: string | undefined | null, base?: string): URL {
  try {
    const baseUrl = base || getAppUrl();
    
    if (!urlStr) {
      return new URL(baseUrl);
    }

    // Handle relative URLs
    if (urlStr.startsWith('/')) {
      return new URL(urlStr, baseUrl);
    }

    return new URL(urlStr);
  } catch (error) {
    console.error(`Failed to construct URL from "${urlStr}" with base "${base}". Using fallback.`);
    return new URL('http://localhost:3000');
  }
}
