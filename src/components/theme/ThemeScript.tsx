import React from 'react';
import Script from 'next/script';

export function ThemeScript() {
  return (
    <Script id="theme-analytics-init" strategy="beforeInteractive">
      {`
        (function() {
          try {
            var gaId = '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''}';
            if (gaId && localStorage.getItem('ddreams_exclude_analytics') === 'true') {
              window['ga-disable-' + gaId] = true;
            }
          } catch(e) {}
          try {
            var darkMode = localStorage.getItem('darkMode');
            if (darkMode && JSON.parse(darkMode)) {
              document.documentElement.classList.add('dark');
            }
            
            var theme = localStorage.getItem('theme');
            if (theme) {
              document.documentElement.setAttribute('data-theme', theme);
            }
          } catch (e) {}
        })()
      `}
    </Script>
  );
}
