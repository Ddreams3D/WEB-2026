import { RouteItem } from './types';

export const ACTIVE_REDIRECTS: RouteItem[] = [
  { 
    path: '/catalogo-impresion-3d/general/premio-estilo-oscar-impreso-en-3d-reconocimiento-personalizado', 
    name: 'Legacy: Premio Oscar (General)', 
    type: 'Redirect', 
    category: 'Tienda', 
    status: 'redirect', 
    redirectTarget: '/catalogo-impresion-3d/arte-diseno/premio-oscar-impreso-3d',
    description: 'Redirección corregida: Categoría general -> arte-diseno'
  },
  { 
    path: '/catalogo-impresion-3d/product/premio-estilo-oscar-impreso-en-3d-reconocimiento-personalizado', 
    name: 'Legacy: Premio Oscar (Product)', 
    type: 'Redirect', 
    category: 'Tienda', 
    status: 'redirect', 
    redirectTarget: '/catalogo-impresion-3d/arte-diseno/premio-oscar-impreso-3d',
    description: 'Redirección variante product -> arte-diseno'
  },
  { 
    path: '/marketplace/product/2', 
    name: 'Legacy ID: Copa Pistón', 
    type: 'Redirect', 
    category: 'Tienda', 
    status: 'redirect', 
    redirectTarget: '/catalogo-impresion-3d/arte-diseno/regalo-personalizado-fanaticos-autos-copa-piston' 
  },
  { 
    path: '/marketplace/product/3', 
    name: 'Legacy ID: Copa Pistón Grande', 
    type: 'Redirect', 
    category: 'Tienda', 
    status: 'redirect', 
    redirectTarget: '/catalogo-impresion-3d/arte-diseno/regalo-personalizado-fanaticos-autos-copa-piston-grande' 
  },
  { 
    path: '/marketplace/product/4', 
    name: 'Legacy ID: Cooler V6', 
    type: 'Redirect', 
    category: 'Tienda', 
    status: 'redirect', 
    redirectTarget: '/catalogo-impresion-3d/arte-diseno/cooler-motor-3d-v6' 
  },
  { 
    path: '/marketplace/product/5', 
    name: 'Legacy ID: Cooler V8', 
    type: 'Redirect', 
    category: 'Tienda', 
    status: 'redirect', 
    redirectTarget: '/catalogo-impresion-3d/arte-diseno/cooler-motor-3d-v8' 
  },
  { 
    path: '/marketplace', 
    name: 'Legacy Marketplace', 
    type: 'Redirect', 
    category: 'Tienda', 
    status: 'redirect', 
    redirectTarget: '/catalogo-impresion-3d',
    seo: { robots: 'noindex, follow' }
  },
  { path: '/marketplace/product/:slug', name: 'Legacy Product Slug', type: 'Redirect', category: 'Tienda', status: 'redirect', redirectTarget: '/catalogo-impresion-3d/product/:slug' },
  { path: '/shop', name: 'Legacy Shop', type: 'Redirect', category: 'Tienda', status: 'redirect', redirectTarget: '/catalogo-impresion-3d' },
  { path: '/products', name: 'Legacy Products', type: 'Redirect', category: 'Tienda', status: 'redirect', redirectTarget: '/catalogo-impresion-3d' },
  { path: '/portfolio', name: 'Legacy Portfolio', type: 'Redirect', category: 'General', status: 'redirect', redirectTarget: '/catalogo-impresion-3d' },
  { path: '/casos-estudio/techpro-industries', name: 'Case Study: TechPro', type: 'Redirect', category: 'Servicios', status: 'redirect', redirectTarget: '/servicios/modelado-3d-personalizado' },
  { path: '/casos-estudio/clinica-innovacion', name: 'Case Study: Clinica', type: 'Redirect', category: 'Servicios', status: 'redirect', redirectTarget: '/services', description: 'Recuperación de tráfico a índice' },
  { path: '/casos-estudio/*', name: 'Other Case Studies', type: 'Redirect', category: 'Servicios', status: 'inactive', redirectTarget: '/services', description: 'Desactivado para evitar Soft-404' },
];

export const SITE_ROUTES: RouteItem[] = [
  // Públicas Generales
  { 
    path: '/', 
    name: 'Inicio (Home)', 
    type: 'Static', 
    category: 'General', 
    status: 'active', 
    description: 'Página principal del sitio',
    seo: {
      metaTitle: 'Ddream 3D | Impresión 3D, Diseño y Prototipado en Arequipa',
      metaDescription: 'Transformamos tus ideas en realidad con impresión 3D de alta calidad. Servicios de diseño, modelado y manufactura aditiva en Arequipa, Perú.',
      canonicalUrl: 'https://ddreams3d.com/',
      robots: 'index, follow',
      updatedAt: '2025-01-02'
    }
  },
  { 
    path: '/about', 
    name: 'Nosotros', 
    type: 'Static', 
    category: 'General', 
    status: 'active', 
    description: 'Historia y equipo',
    seo: {
      metaTitle: 'Sobre Nosotros | Ddream 3D - Expertos en Tecnología 3D',
      metaDescription: 'Conoce al equipo detrás de Ddream 3D. Nuestra misión es democratizar el acceso a la manufactura digital con tecnología de punta.',
      canonicalUrl: 'https://ddreams3d.com/about',
      robots: 'index, follow'
    }
  },
  { 
    path: '/contact', 
    name: 'Contacto', 
    type: 'Static', 
    category: 'General', 
    status: 'active', 
    description: 'Formulario de contacto',
    seo: {
      metaTitle: 'Contáctanos | Ddream 3D Arequipa',
      metaDescription: '¿Tienes un proyecto en mente? Escríbenos para cotizaciones de impresión 3D, diseño personalizado o consultoría técnica.',
      canonicalUrl: 'https://ddreams3d.com/contact',
      robots: 'index, follow'
    }
  },
  { 
    path: '/process', 
    name: 'Nuestro Proceso', 
    type: 'Static', 
    category: 'General', 
    status: 'active', 
    description: 'Explicación del flujo de trabajo',
    seo: {
      metaTitle: 'Nuestro Proceso de Trabajo | De la Idea al Objeto 3D',
      metaDescription: 'Descubre cómo trabajamos: Desde el boceto inicial y modelado 3D hasta la impresión final y post-procesado. Calidad garantizada.',
      robots: 'index, follow'
    }
  },
  { 
    path: '/impresion-3d-arequipa', 
    name: 'Landing SEO (Arequipa)', 
    type: 'Static', 
    category: 'General', 
    status: 'active', 
    description: 'Landing optimizada para SEO local',
    seo: {
      metaTitle: 'Servicio de Impresión 3D en Arequipa | Entrega Rápida',
      metaDescription: 'El mejor servicio de impresión 3D en Arequipa. Prototipos, maquetas y piezas finales con materiales de ingeniería.',
      canonicalUrl: 'https://ddreams3d.com/impresion-3d-arequipa',
      robots: 'index, follow'
    }
  },

  // Catálogo y Tienda
  { 
    path: '/catalogo-impresion-3d', 
    name: 'Catálogo Principal', 
    type: 'Static', 
    category: 'Tienda', 
    status: 'active', 
    description: 'Listado de productos',
    seo: {
      metaTitle: 'Tienda de Impresión 3D y Regalos Personalizados | Ddream Store', // Más descriptivo para CTR
      metaDescription: 'Encuentra el regalo perfecto en nuestro catálogo 3D. Figuras, decoración, accesorios y más. Envíos a todo el Perú.',
      canonicalUrl: 'https://ddreams3d.com/catalogo-impresion-3d',
      robots: 'index, follow'
    }
  },
  { 
    path: '/catalogo-impresion-3d/[category]/[slug]', 
    name: 'Detalle de Producto', 
    type: 'Dynamic', 
    category: 'Tienda', 
    status: 'active', 
    description: 'Ficha de producto individual',
    seo: {
      metaTitle: '{Product Name} | Tienda Ddream 3D',
      metaDescription: 'Compra {Product Name} online. Diseño exclusivo impreso en 3D con máxima calidad. Ver precio y detalles aquí.',
      robots: 'index, follow' // Canónicas se deben generar dinámicamente en el componente de página
    }
  },
  { path: '/cart', name: 'Carrito de Compras', type: 'Static', category: 'Tienda', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/checkout', name: 'Finalizar Compra', type: 'Static', category: 'Tienda', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/order-confirmation', name: 'Confirmación de Pedido', type: 'Static', category: 'Tienda', status: 'active', seo: { robots: 'noindex, nofollow' } },

  // Servicios
  { 
    path: '/services', 
    name: 'Índice de Servicios', 
    type: 'Static', 
    category: 'Servicios', 
    status: 'active', 
    description: 'Hub principal de servicios',
    seo: {
      metaTitle: 'Nuestros Servicios | Impresión, Escaneo y Diseño 3D',
      metaDescription: 'Soluciones integrales de manufactura aditiva. Ofrecemos impresión FDM/SLA, escaneo 3D de precisión y modelado CAD.',
      canonicalUrl: 'https://ddreams3d.com/services',
      robots: 'index, follow'
    }
  },
  { path: '/servicios/[slug]', name: 'Landing de Servicio (Nueva)', type: 'Dynamic', category: 'Servicios', status: 'active', description: 'Motor de landings generadas' },
  { path: '/services/[id]', name: 'Detalle Servicio (Legacy)', type: 'Dynamic', category: 'Sistema', status: 'warning', description: 'Ruta antigua, pendiente de migración', seo: { robots: 'noindex, follow' } },

  // Campañas
  { path: '/campanas/[slug]', name: 'Plantilla General Campañas', type: 'Dynamic', category: 'Marketing', status: 'active', description: 'Ruta dinámica para otras campañas' },

  // Legal
  { 
    path: '/privacy', 
    name: 'Política de Privacidad', 
    type: 'Static', 
    category: 'Legal', 
    status: 'active',
    seo: {
      metaTitle: 'Política de Privacidad y Datos | Ddream 3D',
      metaDescription: 'Política de tratamiento de datos personales y privacidad de Ddream 3D. Cumplimiento con normativa de protección de datos.',
      canonicalUrl: 'https://ddreams3d.com/privacy',
      robots: 'noindex, follow'
    }
  },
  { 
    path: '/terms', 
    name: 'Términos y Condiciones', 
    type: 'Static', 
    category: 'Legal', 
    status: 'active', 
    seo: { 
      metaTitle: 'Términos y Condiciones de Servicio | Ddream 3D',
      metaDescription: 'Condiciones de uso, políticas de venta, envíos y garantías de nuestros servicios de impresión 3D.',
      canonicalUrl: 'https://ddreams3d.com/terms',
      robots: 'noindex, follow'
    } 
  },
  { 
    path: '/complaints', 
    name: 'Libro de Reclamaciones', 
    type: 'Static', 
    category: 'Legal', 
    status: 'active', 
    seo: { 
      metaTitle: 'Libro de Reclamaciones Virtual | Ddream 3D',
      metaDescription: 'Canal oficial para presentar reclamos o quejas conforme a la ley peruana.',
      canonicalUrl: 'https://ddreams3d.com/complaints',
      robots: 'noindex, follow' 
    } 
  },

  // Usuario / Autenticación
  { path: '/login', name: 'Iniciar Sesión', type: 'Static', category: 'Usuario', status: 'active', seo: { robots: 'index, follow' } },
  { path: '/logout', name: 'Cerrar Sesión', type: 'Static', category: 'Usuario', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/profile', name: 'Perfil de Usuario', type: 'Protected', category: 'Usuario', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/pedidos', name: 'Mis Pedidos', type: 'Protected', category: 'Usuario', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/pedidos/[id]', name: 'Detalle de Pedido', type: 'Protected', category: 'Usuario', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/settings', name: 'Configuración de Cuenta', type: 'Protected', category: 'Usuario', status: 'active', seo: { robots: 'noindex, nofollow' } },

  // Admin (Sistema)
  { path: '/admin', name: 'Dashboard Admin', type: 'Protected', category: 'Admin', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/admin/productos', name: 'Gestión Productos', type: 'Protected', category: 'Admin', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/admin/servicios', name: 'Gestión Servicios', type: 'Protected', category: 'Admin', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/admin/projects', name: 'Gestión Proyectos', type: 'Protected', category: 'Admin', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/admin/pedidos', name: 'Gestión Pedidos', type: 'Protected', category: 'Admin', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/admin/usuarios', name: 'Gestión Usuarios', type: 'Protected', category: 'Admin', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/admin/contenido', name: 'Gestión Contenido', type: 'Protected', category: 'Admin', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/admin/storage', name: 'Gestión Archivos Cloud', type: 'Protected', category: 'Admin', status: 'active', seo: { robots: 'noindex, nofollow' } },
  { path: '/admin/configuracion', name: 'Configuración Sistema', type: 'Protected', category: 'Admin', status: 'active', seo: { robots: 'noindex, nofollow' } },

  // Desarrollo / Otros
  { path: '/dev/harness', name: 'Test Harness', type: 'Dev', category: 'Sistema', status: 'warning', seo: { robots: 'noindex, nofollow' } },
  { path: '/seed-data', name: 'Seed Database', type: 'Dev', category: 'Sistema', status: 'warning', seo: { robots: 'noindex, nofollow' } },
];
