const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para despliegue en Netlify
  // output: 'export', // Deshabilitado para permitir rutas dinámicas y autenticación // Habilitado para exportación estática
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
  
  // Configuración de ESLint para build
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  
  // Configuraciones adicionales para reducir advertencias
  // modularizeImports deshabilitado para evitar conflictos con alias
  // modularizeImports: {
  //   'lucide-react': {
  //     transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
  //     preventFullImport: true,
  //   },
  // },
  
  // Nota: rewrites() y headers() no funcionan con output: 'export'
  // Estas configuraciones se aplicarán en el servidor de despliegue (Netlify)
  
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
          },
        },
      };
      
      // Optimizaciones adicionales
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    // Alias para optimizar importaciones
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   '@/lib/icons': require('path').resolve(__dirname, 'src/lib/icons.ts'),
    // };
    
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
