import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        'xs': '475px'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Paleta principal con Variables CSS para soportar temas
        primary: {
          DEFAULT: 'rgb(var(--primary-500))',
          50: 'rgb(var(--primary-50))',
          100: 'rgb(var(--primary-100))',
          200: 'rgb(var(--primary-200))',
          300: 'rgb(var(--primary-300))',
          400: 'rgb(var(--primary-400))',
          500: 'rgb(var(--primary-500))',
          600: 'rgb(var(--primary-600))',
          700: 'rgb(var(--primary-700))',
          800: 'rgb(var(--primary-800))',
          900: 'rgb(var(--primary-900))',
          950: 'rgb(var(--primary-950))',
          foreground: 'rgb(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary-500))',
          50: 'rgb(var(--secondary-50))',
          100: 'rgb(var(--secondary-100))',
          200: 'rgb(var(--secondary-200))',
          300: 'rgb(var(--secondary-300))',
          400: 'rgb(var(--secondary-400))',
          500: 'rgb(var(--secondary-500))',
          600: 'rgb(var(--secondary-600))',
          700: 'rgb(var(--secondary-700))',
          800: 'rgb(var(--secondary-800))',
          900: 'rgb(var(--secondary-900))',
          950: 'rgb(var(--secondary-950))',
          foreground: 'rgb(var(--secondary-foreground))',
        },
        // Colores complementarios
        accent: {
          DEFAULT: "hsl(var(--accent))",
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
          950: '#4a044e',
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
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
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
  corePlugins: {
    backdropFilter: true,
  },
};
export default config;
