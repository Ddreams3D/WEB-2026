/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px'
      },
      colors: {
        // Paleta principal basada en el botón "Comenzar Proyecto"
        primary: {
          50: '#f0fdfc',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#00BFB3', // Color principal del botón
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e'
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2B50AA', // Color secundario del botón
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        // Colores complementarios
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e'
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        // Grises neutros optimizados para comodidad visual
        neutral: {
          50: '#f8fafc',   // slate-50 - más cálido y suave
          100: '#f1f5f9',  // slate-100 - gradiente sutil
          200: '#e2e8f0',  // slate-200 - bordes suaves
          300: '#cbd5e1',  // slate-300 - elementos deshabilitados
          400: '#94a3b8',  // slate-400 - texto muted
          500: '#64748b',  // slate-500 - texto secundario
          600: '#475569',  // slate-600 - texto normal
          700: '#334155',  // slate-700 - texto principal (más suave que negro)
          800: '#1e293b',  // slate-800 - modo oscuro
          900: '#0f172a',  // slate-900 - modo oscuro profundo
          950: '#020617'   // slate-950 - modo oscuro máximo
        },
        // Colores adicionales para comodidad visual
        soft: {
          white: '#ffffff',
          surface: '#ffffff',
          'surface-secondary': '#f8fafc',
          background: '#f8fafc',
          'background-secondary': '#f1f5f9',
          border: '#e2e8f0',
          text: '#334155',
          'text-secondary': '#64748b',
          'text-muted': '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  corePlugins: {
    backdropFilter: true,
  },
}

