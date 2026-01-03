const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para despliegue en Netlify
  // output: 'export', // Deshabilitado para permitir rutas dinámicas y autenticación
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: false, // Optimización de imágenes habilitada
    dangerouslyAllowSVG: true, // Permitir SVGs
    contentDispositionType: 'attachment', // Seguridad para SVGs
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // CSP para SVGs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    localPatterns: [
      {
        pathname: '/images/**',
        search: '', // Permitir cualquier parámetro de consulta (como ?v=2)
      },
      {
        pathname: '/logo/**',
        search: '', // Permitir cualquier parámetro de consulta
      },
    ],
  },
  experimental: {
    // optimizePackageImports: ['framer-motion'], // Deshabilitado para evitar bucles de compilación con Turbopack
    // optimizeCss: true, // Desactivado temporalmente para estabilidad en dev
    scrollRestoration: true,
  },
  
  // Configuración explícita de Turbopack vacía para silenciar advertencias
  turbopack: {},
  
  // Paquetes externos del servidor
  serverExternalPackages: [],
  // Optimizaciones de rendimiento
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Optimizaciones de navegación
  reactStrictMode: true,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\/]node_modules[\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          lucide: {
            test: /[\/]node_modules[\/]lucide-react[\/]/,
            name: 'lucide-icons',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
  
  // Headers de seguridad y caché
  async redirects() {
    return [
      {
        source: '/marketplace',
        destination: '/catalogo-impresion-3d',
        permanent: true,
      },
      {
        source: '/marketplace/:slug*',
        destination: '/catalogo-impresion-3d/:slug*',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Prevenir caché en rutas de la aplicación para asegurar que los usuarios vean la última versión
      // Esto soluciona el problema de "errores antiguos" al recargar
      {
        source: '/((?!_next|static|favicon.ico|images|logo|api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);