const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
// Force restart
const nextConfig = {
  // Configuración para despliegue en Netlify
  // output: 'export', // Deshabilitado para permitir rutas dinámicas y autenticación
  trailingSlash: false,
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
        hostname: 'ddreams3d.firebasestorage.app',
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
      {
        pathname: '/landings/**',
        search: '', // Permitir imágenes de landings personalizadas
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
      // Redirección de seguridad para admin login (evita 404) - ELIMINADA

      {
        source: '/catalogo-impresion-3d/general/premio-estilo-oscar-impreso-en-3d-reconocimiento-personalizado',
        destination: '/catalogo-impresion-3d/arte-diseno/premio-oscar-impreso-3d',
        permanent: true,
      },
      {
        source: '/catalogo-impresion-3d/general/premio-estilo-oscar-impreso-en-3d-reconocimiento-personalizado/',
        destination: '/catalogo-impresion-3d/arte-diseno/premio-oscar-impreso-3d/',
        permanent: true,
      },
      {
        source: '/catalogo-impresion-3d/product/premio-estilo-oscar-impreso-en-3d-reconocimiento-personalizado',
        destination: '/catalogo-impresion-3d/arte-diseno/premio-oscar-impreso-3d',
        permanent: true,
      },
      {
        source: '/catalogo-impresion-3d/product/premio-estilo-oscar-impreso-en-3d-reconocimiento-personalizado/',
        destination: '/catalogo-impresion-3d/arte-diseno/premio-oscar-impreso-3d/',
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
       {
        source: '/casos-estudio/clinica-innovacion',
        destination: '/services', // Redirigir al índice de servicios para recuperar tráfico
        permanent: true,
      },
      // 7. Favicon legacy path
      {
        source: '/favicon.ico',
        destination: '/logo/isotipo_DD_negro_V2.svg',
        permanent: true,
      },
      // 6. Catch-all para casos de estudio (excepto los explícitamente ignorados o definidos arriba)
      // ELIMINADO: Dejar que de 404 para evitar soft-404 y problemas de UX
      // {
      //   source: '/casos-estudio/:slug((?!clinica-innovacion$).*)', 
      //   destination: '/services',
      //   permanent: true,
      // },
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
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
