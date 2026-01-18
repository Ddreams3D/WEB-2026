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
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
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
  reactStrictMode: false,
  
  // Configuración de redirecciones para SEO (Migración de rutas antiguas)
  async redirects() {
    return [
      {
        source: '/catalogo-impresion-3d/general/premio-estilo-oscar-impreso-en-3d-reconocimiento-personalizado',
        destination: '/catalogo-impresion-3d/general/premio-oscar-impreso-3d',
        permanent: true,
      },
      {
        source: '/catalogo-impresion-3d/general/premio-estilo-oscar-impreso-en-3d-reconocimiento-personalizado/',
        destination: '/catalogo-impresion-3d/general/premio-oscar-impreso-3d/',
        permanent: true,
      },
      // 1. Redirección principal de marketplace a catálogo
      {
        source: '/marketplace',
        destination: '/catalogo-impresion-3d',
        permanent: true, // 301
      },
      // 2. Intentar preservar productos específicos si el slug coincide
      {
        source: '/marketplace/product/:slug',
        destination: '/catalogo-impresion-3d/product/:slug',
        permanent: true,
      },
      // 3. Catch-all para cualquier otra ruta huérfana bajo marketplace
      {
        source: '/marketplace/:path*',
        destination: '/catalogo-impresion-3d',
        permanent: true,
      },
      // 4. Otras rutas comunes legacy
      {
        source: '/shop',
        destination: '/catalogo-impresion-3d',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/catalogo-impresion-3d',
        permanent: true,
      },
      // 5. Redirecciones específicas de casos de estudio
      {
        source: '/portfolio',
        destination: '/catalogo-impresion-3d',
        permanent: true,
      },
      {
         source: '/casos-estudio/techpro-industries',
         destination: '/servicios/modelado-3d-personalizado', // Destino válido en ruta pública /servicios/[slug]
         permanent: true,
       },
      // 6. Catch-all para casos de estudio (excepto los explícitamente ignorados o definidos arriba)
      // Nota: Next.js evalúa en orden. Si '/casos-estudio/clinica-innovacion' no está definida, caería aquí.
      // Pero como queremos que sea 404, NO debemos matchearla aquí.
      // Solución: Usar regex negativo o definir primero la redirección general y excluir la específica es complejo en simple config.
      // Mejor estrategia: Redirigir todo lo que NO sea la excepción.
      // Sin embargo, Next.js redirects no soporta "excepto X" fácilmente sin regex complejos.
      // Estrategia purista: Definir el catch-all pero sabiendo que la excepción del 404 se maneja implícitamente al NO definirla
      // PERO, si ponemos catch-all, se comerá al 404.
      // Solución técnica: No podemos forzar un 404 desde next.config.js redirects (solo redirects/rewrites).
      // Si la URL '/casos-estudio/clinica-innovacion' llega al servidor y no hay página, dará 404 nativo.
      // El problema es que el catch-all de abajo la redirigiría.
      // Truco: Usar 'has' o regex para excluir, o simplemente no usar catch-all ciego si hay excepciones 404.
      // Dado el requisito "Resto -> redirigir", asumimos que la excepción es única.
      {
        source: '/casos-estudio/:slug((?!clinica-innovacion$).*)', // Regex para excluir 'clinica-innovacion'
        destination: '/services',
        permanent: true,
      },
    ];
  },

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
            value: 'SAMEORIGIN',
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
