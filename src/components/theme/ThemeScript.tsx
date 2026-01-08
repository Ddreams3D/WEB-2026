import React from 'react';

export function ThemeScript() {
  return (
    <script
      id="theme-analytics-init"
      dangerouslySetInnerHTML={{
        __html: `
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
      `}}
    />
  );
}
