import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GlossaryItem } from '@/shared/types/glossary';

const COLLECTION = 'settings';
const DOC_ID = 'glossary';

export const GLOSSARY_CATEGORIES: Record<string, string> = {
  core: 'Núcleo del Negocio',
  marketing: 'Marketing & Campañas',
  ecommerce: 'Tienda & Pedidos',
  services: 'Servicios de Impresión',
  admin: 'Panel de Administración',
  tech: 'Tecnología & Datos',
  ui: 'Interfaz de Usuario',
  users: 'Usuarios & Roles'
};

const INITIAL_GLOSSARY: GlossaryItem[] = [
  // --- NÚCLEO (CORE) ---
  {
    id: 'core-landing-main',
    term: 'Landing Principal',
    definition: 'Página de aterrizaje estratégica (ej. "/impresion-3d-arequipa"). NO es la Home. Es una "Landing Satélite" que vive fuera de la Web Principal para maximizar conversión SEO local.',
    category: 'core',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'core-web-main',
    term: 'Web Principal',
    definition: 'La "Nave Madre". Incluye la Home ("/"), el Catálogo, el Admin y el área de clientes. EXCLUYE explícitamente todas las Landings (ya sean de campaña, servicio o la Landing Principal).',
    category: 'core',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'core-home-public',
    term: 'Home (Inicio)',
    definition: 'La ruta raíz pública ("/"). Es la portada de la Web Principal. A diferencia de las Landings, la Home SÍ es parte integral de la plataforma y comparte su navegación y contexto.',
    category: 'core',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'core-admin-dashboard',
    term: 'Admin (Dashboard)',
    definition: 'El panel de control privado ("/admin"). Es el centro de mando del usuario administrador para gestionar productos, pedidos y configuraciones.',
    category: 'admin',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'core-theme',
    term: 'Tema (Theme)',
    definition: 'Conjunto de variables visuales (paleta de colores, tipografías, bordes) que definen la estética global de la web. Puede ser "Estándar" (identidad corporativa permanente) o "Estacional" (temporal, ej. Navidad). Afecta a toda la web excepto a las Landings de Servicio.',
    category: 'core',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'core-campaign',
    term: 'Campaña (Campaign)',
    definition: 'Estrategia de marketing temporal que combina un Tema visual y una Landing Page específica (/campanas/xyz). Su objetivo es promocionar una oferta limitada. Activar una campaña cambia los colores de la Home pero NO su contenido estructural.',
    category: 'core',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'core-automation',
    term: 'Automatización',
    definition: 'Sistema inteligente que activa y desactiva campañas basándose en fechas predefinidas. Garantiza que la web siempre tenga un aspecto relevante sin intervención manual constante. Prioriza la campaña activa sobre la configuración manual.',
    category: 'core',
    lastUpdated: new Date().toISOString()
  },

  {
    id: 'core-context-price',
    term: 'Precio por Contexto (Landing Price)',
    definition: 'Mecanismo que permite a un mismo Producto tener precios diferentes según la Landing Page donde se visualice. Mantiene un inventario unificado pero adapta la oferta al segmento de mercado (ej. Estudiantes vs Profesionales).',
    category: 'core',
    lastUpdated: new Date().toISOString()
  },

  // --- MARKETING ---
  {
    id: 'mkt-landings-specific',
    term: 'Landings (Específicas)',
    definition: 'Páginas satélites diseñadas con un único objetivo de conversión (ej. "/impresion-3d-arequipa"). A diferencia de la Web Principal, aquí se limita la navegación para que el usuario se enfoque solo en esa oferta.',
    category: 'marketing',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'mkt-landing-campaign',
    term: 'Landing de Campaña',
    definition: 'Página de aterrizaje temporal (/campanas/nombre-oferta) diseñada exclusivamente para convertir visitantes en una campaña específica. Aquí es donde residen los textos promocionales, contadores regresivos y ofertas agresivas. Desaparece o se oculta al terminar la campaña.',
    category: 'marketing',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'mkt-seo',
    term: 'SEO (Search Engine Optimization)',
    definition: 'Conjunto de técnicas para mejorar la visibilidad de la web en Google. Incluye meta títulos, descripciones, y estructura de datos. Cada página (Home, Productos, Servicios) tiene su propia configuración SEO independiente.',
    category: 'marketing',
    lastUpdated: new Date().toISOString()
  },

  // --- ECOMMERCE ---
  {
    id: 'ecom-product',
    term: 'Producto',
    definition: 'Artículo físico o digital disponible para compra directa. Tiene precio, stock, imágenes y variantes (colores, tamaños). Se gestiona desde el catálogo y puede ser destacado en la Home.',
    category: 'ecommerce',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'ecom-cart',
    term: 'Carrito de Compras',
    definition: 'Estado temporal donde el usuario acumula productos antes de pagar. Persiste en el navegador (LocalStorage) para que no se pierda al recargar la página. Calcula subtotales y permite aplicar cupones.',
    category: 'ecommerce',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'ecom-checkout',
    term: 'Checkout (Finalizar Compra)',
    definition: 'Proceso final de compra donde se recogen datos de envío, facturación y pago. Es una zona crítica y segura donde se confirma la transacción.',
    category: 'ecommerce',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'ecom-order',
    term: 'Pedido (Order)',
    definition: 'Registro oficial de una compra completada. Contiene la lista de productos, datos del cliente, estado del pago y estado del envío (Pendiente, Procesando, Completado, Cancelado).',
    category: 'ecommerce',
    lastUpdated: new Date().toISOString()
  },

  // --- SERVICIOS ---
  {
    id: 'srv-landing-service',
    term: 'Landing de Servicio (Standalone)',
    definition: 'Página especializada (/servicios/slug) con arquitectura "Standalone". Tiene su propio Layout (sin Navbar/Footer globales) y su propio Renderizador. Permite personalización extrema de diseño (Vibes) sin romper la estética de la web principal.',
    category: 'services',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'srv-quote',
    term: 'Cotización (Quote)',
    definition: 'Solicitud de presupuesto para trabajos a medida que no tienen precio fijo (ej. impresión de un archivo STL propio). Requiere subir archivos y especificar parámetros técnicos.',
    category: 'services',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'srv-vibe-config',
    term: 'Vibe / Atmósfera',
    definition: 'Regla de diseño que permite a una Landing de Servicio sobrescribir variables CSS globales (colores de texto, fondos). Ejemplo: "Modelado Orgánico" usa tonos cálidos (Stone/Terracota) y patrones de ruido, ignorando el tema "Cool Gray" tecnológico por defecto.',
    category: 'services',
    lastUpdated: new Date().toISOString()
  },

  // --- REGLAS DE NEGOCIO & CÓDIGO ---
  {
    id: 'rule-config-precedence',
    term: 'Regla de Precedencia (Code > DB)',
    definition: 'Principio de desarrollo: Para elementos críticos de diseño (Colores, Logos), la configuración definida en el CÓDIGO local (service-landings-data.ts) siempre tiene prioridad sobre la Base de Datos. Esto garantiza que las actualizaciones de diseño se apliquen instantáneamente.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'rule-adaptive-logo',
    term: 'Isotipo Adaptativo',
    definition: 'Versión inteligente del logo "D" que ajusta sus bordes, sombras y espaciado automáticamente según el fondo. Es crítico para mantener la legibilidad de la marca (la "D" blanca) sobre fondos claros o complejos en las Landings de Servicio.',
    category: 'ui',
    lastUpdated: new Date().toISOString()
  },

  // --- ADMIN & ROLES ---
  {
    id: 'admin-master',
    term: 'Master Admin',
    definition: 'El nivel más alto de autoridad. Tiene acceso a TODO: finanzas, eliminación de datos y configuración de IA. Protegido por autenticación de doble factor lógica (requiere login específico).',
    category: 'users',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'admin-editor',
    term: 'Editor de Contenido',
    definition: 'Rol con permisos para modificar textos, imágenes y productos, pero SIN acceso a configuraciones críticas (API Keys, Reglas IA) ni datos financieros sensibles.',
    category: 'users',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'admin-finance-bot-inbox',
    term: 'Inbox de Finanzas (Bot)',
    definition: 'Bandeja de entrada moderada donde llegan movimientos financieros enviados por el bot de Telegram. No es el libro mayor de finanzas: cada item debe ser aprobado manualmente en /admin/finanzas antes de impactar los balances.',
    category: 'admin',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-origin-inbox-id',
    term: 'originInboxId',
    definition: 'Identificador de trazabilidad que enlaza un registro financiero (FinanceRecord) con el mensaje original del bot de Telegram. Permite auditar qué movimiento provino de qué mensaje y evitar duplicados.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },

  // --- TECNOLOGÍA & DATOS ---
  {
    id: 'tech-server-action',
    term: 'Server Action',
    definition: 'Funciones especiales que corren en el servidor pero se llaman desde el cliente. Son el ÚNICO mecanismo autorizado para escribir datos en la base de datos o enviar emails. Garantizan seguridad.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-zod',
    term: 'Zod Schema',
    definition: 'El "Portero" de los datos. Es un molde estricto que valida cualquier información que entra al sistema. Si un dato no encaja en el molde Zod, es rechazado automáticamente antes de llegar a la base de datos.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-context',
    term: 'Context API',
    definition: 'Sistema de "memoria compartida" de React. Permite que datos globales como el Usuario logueado o el Carrito de compras estén accesibles en cualquier botón de la web sin pasarlos manualmente.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-next-image',
    term: 'Next Image',
    definition: 'Componente inteligente que procesa las imágenes automáticamente. Las comprime, les cambia el tamaño según la pantalla del móvil y evita que la web "salte" mientras carga.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-bundle-analyzer',
    term: 'Bundle Analyzer',
    definition: 'Herramienta de auditoría que crea un mapa visual de todo el código de la web. Nos ayuda a detectar librerías pesadas innecesarias para mantener la web rápida.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-critters',
    term: 'Critters',
    definition: 'Algoritmo de optimización que lee tu CSS y "pega" los estilos críticos directamente en el HTML. Hace que la web se vea bien instantáneamente, incluso antes de cargar los archivos de estilo completos.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-playwright',
    term: 'Playwright (E2E)',
    definition: 'Robot de pruebas que simula ser un usuario real. Navega por la web, hace clics y compras de prueba automáticamente para asegurar que nada se haya roto con los cambios recientes.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-sentry',
    term: 'Sentry',
    definition: 'Sistema de vigilancia de errores. Si la web falla en el celular de un cliente, Sentry nos avisa inmediatamente con el detalle del error para arreglarlo antes de recibir quejas.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-json-ld',
    term: 'JSON-LD (Schema)',
    definition: 'Lenguaje oculto para Google. Le dice al buscador explícitamente: "Esto es un Producto", "Este es su Precio", "Esta es la Foto". Mejora la aparición en resultados de búsqueda.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-resend',
    term: 'Resend API',
    definition: 'Motor de envío de correos moderno. Garantiza que las confirmaciones de pedido lleguen a la bandeja de entrada del cliente y no a la carpeta de Spam.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-tailwind',
    term: 'Tailwind CSS',
    definition: 'Tecnología de diseño que usa "clases utilitarias". En lugar de archivos CSS gigantes, usamos pequeñas instrucciones directas en el HTML, haciendo la web más ligera.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tech-firestore',
    term: 'Firestore DB',
    definition: 'Base de datos NoSQL de Google. A diferencia de las tablas antiguas (Excel), guarda datos como "Documentos" flexibles, permitiendo cambios rápidos sin romper la estructura.',
    category: 'tech',
    lastUpdated: new Date().toISOString()
  },

  // --- UI (CONCEPTOS VISUALES) ---
  {
    id: 'ui-sheet',
    term: 'Sheet (Panel Lateral)',
    definition: 'Panel que se desliza desde un borde de la pantalla (usualmente derecha). Se usa para formularios complejos o carritos de compra sin perder el contexto de la página de fondo.',
    category: 'ui',
    lastUpdated: new Date().toISOString()
  }
];

export const GlossaryService = {
  async fetch(): Promise<GlossaryItem[]> {
    if (!db) {
      console.warn('Firestore not available, returning initial glossary');
      return INITIAL_GLOSSARY;
    }
    
    try {
      const ref = doc(db, COLLECTION, DOC_ID);
      const snap = await getDoc(ref);
      
      if (snap.exists() && snap.data().items) {
        // Merge initial items with saved items to ensure new definitions appear
        // This prioritizes saved definitions but adds new terms if they don't exist in DB
        const savedItems = snap.data().items as GlossaryItem[];
        const savedIds = new Set(savedItems.map(i => i.id));
        
        const newItems = INITIAL_GLOSSARY.filter(i => !savedIds.has(i.id));
        
        return [...savedItems, ...newItems];
      }
      
      return INITIAL_GLOSSARY;
    } catch (error) {
      console.error('Error fetching glossary:', error);
      return INITIAL_GLOSSARY;
    }
  },

  async save(items: GlossaryItem[]): Promise<void> {
    if (!db) throw new Error('Firestore not configured');
    
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, { 
      items, 
      updatedAt: new Date().toISOString() 
    });
  }
};
