import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { PromptVocabularyItem } from '@/shared/types/prompt-vocabulary';

const COLLECTION = 'settings';
const DOC_ID = 'prompt-vocabulary';

export const PROMPT_VOCAB_CATEGORIES: Record<string, string> = {
  global: 'Global',
  web: 'Web Pública',
  admin: 'Administración',
  marketing: 'Marketing',
  services: 'Servicios',
};

const INITIAL_VOCAB: PromptVocabularyItem[] = [
  {
    id: 'home',
    term: 'Home',
    meaning: 'Página de inicio (/) de la web principal.',
    aliases: ['inicio', 'home page', 'web principal'],
    scope: ['home', 'web-principal'],
    category: 'web',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'landing-principal',
    term: 'Landing Principal',
    meaning: 'Landing comercial independiente de la Home. No es la Home.',
    aliases: ['landing main', 'landing comercial'],
    scope: ['landing-principal'],
    category: 'web',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'landing-campana',
    term: 'Landing de Campaña',
    meaning: 'Página /campanas/[slug] exclusiva para campañas temporales.',
    aliases: ['landing campaña', 'campaña landing'],
    scope: ['landing-campana', 'marketing'],
    category: 'marketing',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'landing-servicio',
    term: 'Landing de Servicio',
    meaning: 'Página /servicios/[slug] estable e independiente de temas.',
    aliases: ['servicio landing'],
    scope: ['landing-servicio', 'services'],
    category: 'services',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'tema-estandar',
    term: 'Tema Estándar',
    meaning: 'Colores base de la marca, usados si no hay campaña.',
    aliases: ['theme estándar', 'tema base'],
    scope: ['web-principal', 'home'],
    category: 'global',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'tema-estacional',
    term: 'Tema Estacional',
    meaning: 'Colores temporales aplicados por una campaña activa.',
    aliases: ['theme estacional', 'tema campaña'],
    scope: ['web-principal', 'home'],
    category: 'marketing',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'admin',
    term: 'Admin',
    meaning: 'Panel de administración (/admin/*) y rutas protegidas.',
    aliases: ['administración', 'panel'],
    scope: ['admin'],
    category: 'admin',
    lastUpdated: new Date().toISOString(),
  },
  // --- COMPONENTS & TECH (GENERATED) ---
  {
    id: 'comp-tech-card',
    term: 'TechCard',
    meaning: 'Componente UI (<TechCard />) usado en /admin/architecture para mostrar tecnologías con icono, título y badge.',
    aliases: ['tarjeta técnica', 'tech card'],
    scope: ['admin', 'architecture'],
    category: 'admin',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'comp-product-grid',
    term: 'ProductGrid',
    meaning: 'Componente principal del catálogo (<ProductGrid />). Muestra productos y servicios en grilla responsive con soporte para esqueletos de carga.',
    aliases: ['grilla productos', 'catalog grid'],
    scope: ['catalog', 'shop'],
    category: 'web',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'comp-toast',
    term: 'Toast',
    meaning: 'Notificación emergente (Sonner). Se invoca con toast.success() o toast.error() para feedback de usuario.',
    aliases: ['notificación', 'alerta flotante', 'sonner'],
    scope: ['global', 'ui'],
    category: 'global',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'logic-server-action',
    term: 'Server Action',
    meaning: 'Función asíncrona con "use server". Se usa para mutaciones de datos (guardar, actualizar) y operaciones seguras (envío de emails).',
    aliases: ['acción de servidor', 'rpc', 'backend function'],
    scope: ['backend', 'logic'],
    category: 'global',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'logic-zod',
    term: 'Zod Schema',
    meaning: 'Esquema de validación de datos. Define la estructura estricta de objetos (Producto, Perfil, Regla) antes de guardarlos en DB.',
    aliases: ['schema validation', 'validación tipos', 'ley de datos'],
    scope: ['backend', 'types'],
    category: 'global',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'seo-jsonld',
    term: 'LocalBusinessJsonLd',
    meaning: 'Componente invisible que inyecta datos estructurados de Schema.org para Google (SEO Local).',
    aliases: ['json-ld', 'datos estructurados', 'seo local'],
    scope: ['seo', 'web'],
    category: 'web',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'admin-protection',
    term: 'AdminProtection',
    meaning: 'Componente de Alto Orden (HOC) que envuelve páginas administrativas. Verifica rol de admin y redirige si no hay acceso.',
    aliases: ['protección admin', 'guardia de ruta', 'auth guard'],
    scope: ['admin', 'security'],
    category: 'admin',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'tech-resend',
    term: 'Resend',
    meaning: 'Servicio API para envío de emails transaccionales (Confirmación de pedido, Recuperar contraseña).',
    aliases: ['motor de email', 'email service'],
    scope: ['backend', 'email'],
    category: 'global',
    lastUpdated: new Date().toISOString(),
  },
  // --- LAYOUT STRUCTURE (GENERATED) ---
  {
    id: 'layout-navbar',
    term: 'Navbar',
    meaning: 'Barra de navegación principal (<Navbar />). Cambia de transparente a sólida al hacer scroll.',
    aliases: ['menú principal', 'header', 'barra superior'],
    scope: ['layout', 'navigation'],
    category: 'web',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'layout-footer',
    term: 'Footer',
    meaning: 'Pie de página global. Contiene el logo animado, enlaces legales y redes sociales.',
    aliases: ['pie de página', 'futter', 'zona inferior'],
    scope: ['layout', 'footer'],
    category: 'web',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'layout-hero',
    term: 'Hero Section',
    meaning: 'Sección principal de bienvenida en Home y Landings. Usa <HeroSection /> o componentes dedicados en /features.',
    aliases: ['portada', 'banner principal', 'intro'],
    scope: ['layout', 'marketing'],
    category: 'marketing',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'layout-mobile-menu',
    term: 'Mobile Menu',
    meaning: 'Menú desplegable para móviles (<NavbarMobileMenu />). Se activa con el botón hamburguesa.',
    aliases: ['menú móvil', 'drawer menú', 'hamburguesa'],
    scope: ['layout', 'mobile'],
    category: 'web',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'comp-cookie',
    term: 'Cookie Banner',
    meaning: 'Aviso legal flotante (<CookieBanner />) que pide consentimiento al usuario.',
    aliases: ['aviso cookies', 'gdpr banner'],
    scope: ['legal', 'ui'],
    category: 'global',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'comp-service-card',
    term: 'Service Card',
    meaning: 'Tarjeta de presentación de servicios (<ServiceCard />). Variante visual distinta a la de productos.',
    aliases: ['tarjeta servicio', 'service item'],
    scope: ['services', 'ui'],
    category: 'services',
    lastUpdated: new Date().toISOString(),
  }
];

export const PromptVocabularyService = {
  async fetch(): Promise<PromptVocabularyItem[]> {
    if (!db) {
      console.warn('Firestore not available, returning initial prompt vocabulary');
      return INITIAL_VOCAB;
    }
    try {
      const ref = doc(db, COLLECTION, DOC_ID);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().items) {
        const savedItems = snap.data().items as PromptVocabularyItem[];
        const savedIds = new Set(savedItems.map(i => i.id));
        const newItems = INITIAL_VOCAB.filter(i => !savedIds.has(i.id));
        return [...savedItems, ...newItems];
      }
      return INITIAL_VOCAB;
    } catch (error) {
      console.error('Error fetching prompt vocabulary:', error);
      return INITIAL_VOCAB;
    }
  },

  async save(items: PromptVocabularyItem[]): Promise<void> {
    if (!db) throw new Error('Firestore not configured');
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, {
      items,
      updatedAt: new Date().toISOString(),
    });
  },
};

