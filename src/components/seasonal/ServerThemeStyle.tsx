import React from 'react';
import { resolveActiveTheme } from '@/lib/seasonal-service';
import { hexToHsl, hexToRgb } from '@/lib/utils';

export async function ServerThemeStyle() {
  // 1. Resolve the active theme on the server (based on Date and Configuration)
  // This uses the same logic as the client, but runs before HTML is sent.
  const activeSeasonalConfig = await resolveActiveTheme();
  if (process.env.NODE_ENV === 'development') {
    console.log('[ServerThemeStyle] Resolved Theme:', activeSeasonalConfig.id);
  }

  // 2. Check if we should apply global styles
  const shouldApplyGlobal = activeSeasonalConfig.applyThemeToGlobal !== false;

  // If standard theme or shouldn't apply, we don't need to inject anything
  // (Standard CSS files will take over)
  // UNLESS the standard theme itself has overrides in the DB? 
  // For now, assume Standard CSS file is the baseline.
  if (!shouldApplyGlobal || activeSeasonalConfig.id === 'standard') {
    return null;
  }

  // 3. Generate CSS Variables
  const cssVariables: string[] = [];
  const landing = activeSeasonalConfig.landing;

  // Helper to push variable if value exists
  const pushVar = (name: string, value: string | null) => {
    if (value) cssVariables.push(`${name}: ${value} !important;`);
  };

  // --- Primary Color ---
  if (landing.primaryColor) {
    const rgb = hexToRgb(landing.primaryColor);
    const hsl = hexToHsl(landing.primaryColor);
    
    if (rgb) {
      pushVar('--primary', rgb); // Tailwind often expects HSL or RGB depending on config, checking Controller...
      // Controller says: document.documentElement.style.setProperty('--primary', rgb);
      // Wait, standard.css says --primary is HSL (175 100% 37%).
      // BUT SeasonalThemeController uses `hexToRgb` for `--primary`.
      // Let's stick to what the Controller does to match legacy behavior.
      pushVar('--primary', rgb);
      pushVar('--primary-500', rgb);
      pushVar('--primary-600', rgb);
    }
    if (hsl) {
      pushVar('--ring', hsl);
    }
  }

  // --- Secondary Color ---
  if (landing.secondaryColor) {
    const rgb = hexToRgb(landing.secondaryColor);
    if (rgb) {
      pushVar('--secondary', rgb);
      pushVar('--secondary-500', rgb);
    }
  }

  // --- Background Color ---
  if (landing.backgroundColor) {
    const hsl = hexToHsl(landing.backgroundColor);
    if (hsl) {
      pushVar('--background', hsl);
    }
  }

  // --- Button Style (Radius) ---
  if (landing.buttonStyle) {
    const radius = landing.buttonStyle === 'pill' ? '9999px' 
      : landing.buttonStyle === 'square' ? '0rem' 
      : '0.5rem';
    pushVar('--radius', radius);
  }

  // --- Typography ---
  if (landing.fontFamilyHeading) {
    const font = landing.fontFamilyHeading === 'playfair' ? 'var(--font-playfair), serif' 
      : landing.fontFamilyHeading === 'oswald' ? 'var(--font-oswald), sans-serif'
      : landing.fontFamilyHeading === 'montserrat' ? 'var(--font-montserrat), sans-serif'
      : 'var(--font-inter), sans-serif';
    pushVar('--font-heading', font);
  }

  if (landing.fontFamilyBody) {
    const font = landing.fontFamilyBody === 'roboto' ? 'var(--font-roboto), sans-serif'
      : landing.fontFamilyBody === 'open-sans' ? 'var(--font-open-sans), sans-serif'
      : 'var(--font-inter), sans-serif';
    pushVar('--font-body', font);
  }

  // --- Pattern Overlay ---
  if (landing.patternOverlay && landing.patternOverlay !== 'none') {
     let patternValue = 'none';
     let patternSize = 'auto';

     if (landing.patternOverlay === 'dots') {
        patternValue = 'radial-gradient(currentColor 1px, transparent 1px)';
        patternSize = '20px 20px';
     } else if (landing.patternOverlay === 'grid') {
        patternValue = 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)';
        patternSize = '40px 40px';
     } else if (landing.patternOverlay === 'noise') {
        patternValue = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")';
        patternSize = 'auto';
     }
     
     if (patternValue !== 'none') {
        pushVar('--pattern-style', patternValue);
        pushVar('--pattern-size', patternSize);
     }
  }

  // If no variables to inject, return null
  if (cssVariables.length === 0) {
    return null;
  }

  // 4. Construct the Style Tag
  // We use :root to ensure global scope, and !important if necessary to override standard.css
  // However, inline styles usually win over external files if specificity is equal.
  // :root has (0,1,0). CSS files have (0,1,0) for [data-theme='standard'].
  // If we assume the HTML doesn't have data-theme set yet, :root matches.
  // But standard.css uses `[data-theme='standard']`.
  // To be safe, we can use `html` selector or `:root`.
  
  const cssString = `
    :root {
      ${cssVariables.join('\n      ')}
    }
  `;

  return (
    <style
      id="server-theme-style"
      dangerouslySetInnerHTML={{ __html: cssString }}
    />
  );
}
