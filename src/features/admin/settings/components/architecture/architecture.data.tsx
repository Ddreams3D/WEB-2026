import { 
  Zap, Palette, Sparkles, Bell, Type, LayoutTemplate, Calendar, Satellite, DatabaseZap,
  Database, FileImage, Lock, Code2, Brain, RefreshCw, MessageSquare, FileCode,
  TestTube, ShieldCheck, Activity, Globe, ScanSearch, Scale, Shuffle, Mail,
  Server, BarChart3, TrendingUp, Scissors, Image, Smartphone, Radar, TriangleAlert
} from 'lucide-react';

export const FRONTEND_DATA = {
  hero: [
    {
      icon: Zap,
      title: "Next.js 16 (App Router)",
      desc: "Es el esqueleto y motor de tu web. Operando en la última versión estable (v16) con React 19. Máximo rendimiento y capacidades de servidor modernas.",
      tags: ["React 19 Engine", "Bleeding Edge"],
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: Palette,
      title: "Tailwind CSS v3.4",
      desc: "Es el sastre de tu web. Diseño atómico y utilitario que permite estilos rápidos y consistentes. Optimizado para evitar CSS muerto en producción.",
      tags: ["Styling", "Atomic Design"],
      color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/20"
    }
  ],
  experience: [
    { title: "Framer Motion", desc: "Coreografía y animaciones suaves.", icon: Sparkles },
    { title: "Sonner", desc: "Notificaciones elegantes y no intrusivas.", icon: Bell },
    { title: "Tipografía", desc: "Inter + Montserrat (Google Fonts).", icon: Type }
  ],
  features: [
    { 
      title: "Universal Landing Engine", 
      desc: "Motor de 'Renderizado Polimórfico'. Un solo editor gobierna todas las landings.",
      icon: LayoutTemplate
    },
    { 
      title: "Motor de Festividades", 
      desc: "La web cambia de piel (Navidad, Halloween) automáticamente según la fecha.",
      icon: Calendar
    },
    { 
      title: "Arquitectura Route Groups", 
      desc: "Estrategia `(dashboard)` para aislar el Admin, y Landings en raíz para SEO máximo.",
      icon: Satellite
    },
    { 
      title: "Context API Global", 
      desc: "Sistema nervioso central: Auth, Cart y Theme disponibles en toda la app.",
      icon: DatabaseZap
    }
  ]
};

export const BACKEND_DATA = {
  hero: [
    {
      icon: Database,
      title: "Firebase Firestore",
      desc: "Base de datos NoSQL. Colecciones de documentos ultra rápidas para lectura en tiempo real.",
      tags: ["NoSQL", "Real-time"],
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/20",
      className: "md:col-span-2"
    }
  ],
  ecosystem: [
    { title: "Firebase Storage", desc: "Almacén de imágenes 3D y avatares.", icon: FileImage },
    { title: "Hybrid Auth", desc: "Cliente (Firebase) + Admin (JWT Jose).", icon: Lock }
  ]
};

export const INTELLIGENCE_DATA = {
  hero: [
    {
      icon: Brain,
      title: "Contexto Inyectado",
      desc: "La web enseña a la IA. Reglas, Glosario y Vocabulario definen la personalidad de Ddreams 3D.",
      tags: ["IA Context", "Learning"],
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20"
    }
  ],
  tools: [
    { title: "Sincronización Híbrida", desc: "Puente Cliente-Servidor para AI_RULES.md.", icon: RefreshCw },
    { title: "Prompts Estructurados", desc: "Ingeniería de instrucciones para LLMs.", icon: MessageSquare },
    { title: "Constitución IA (Types)", desc: "Reglas 'Type-Safe' en TypeScript.", icon: FileCode }
  ]
};

export const GUARDIANS_DATA = {
  hero: [
    {
      icon: TestTube,
      title: "Playwright (QA)",
      desc: "Robot nocturno que simula compras reales para detectar fallos.",
      tags: ["E2E Testing"],
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20"
    }
  ],
  tools: [
    { title: "Zod (El Sheriff)", desc: "Aduana estricta de datos en servidor.", icon: ShieldCheck },
    { title: "Sentry", desc: "Sistema de alarmas silencioso de errores.", icon: ShieldCheck }
  ],
  health: [
    { icon: Activity, label: "Doctor del Sistema (Script)" },
    { icon: Globe, label: "SEO Vivo (Dynamic Metadata)" },
    { icon: ScanSearch, label: "Pages Manager UI" },
    { icon: Lock, label: "Admin Protection Wrapper" },
    { icon: Scale, label: "Bundle Analyzer" },
    { icon: Shuffle, label: "Rescate de Tráfico (Redirects)" }
  ]
};

export const INFRA_DATA = {
  hero: [
    {
      icon: Server,
      title: "Netlify Hosting",
      desc: "Configuración 'netlify.toml' optimizada para Next.js.",
      tags: ["Global Edge"],
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20"
    },
    {
      icon: BarChart3,
      title: "Google Analytics 4",
      desc: "Rastreo de eventos de conversión y tráfico.",
      tags: ["Data Driven"],
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20"
    }
  ],
  tools: [
    { title: "ERP Financiero", desc: "Control de ingresos/gastos.", icon: TrendingUp },
    { title: "SEO JSON-LD", desc: "Datos estructurados para Google.", icon: Globe },
    { title: "Firestore Rules", desc: "Constitución de seguridad DB.", icon: ShieldCheck },
    { title: "Mantenimiento", desc: "Scripts automáticos (migrate, diagnose).", icon: FileCode }
  ]
};

export const INVISIBLE_DATA = {
  utils: [
    { icon: Scissors, label: "CVA & Clsx (Estilos)" },
    { icon: Image, label: "Sharp (Imágenes)" },
    { icon: Activity, label: "Critters (CSS Inline)" },
    { icon: Calendar, label: "date-fns (Fechas)" },
    { icon: FileCode, label: "uuid (Identificadores)" },
    { icon: Smartphone, label: "Pasarela WhatsApp" },
    { icon: Radar, label: "Analytics Fantasma" },
    { icon: Zap, label: "Server Actions" }
  ]
};

export const HISTORY_DATA = [
  { title: "Admin Security Hardening", desc: "Migración a Cookies HttpOnly y firma JWT. Eliminada vulnerabilidad XSS en AuthContext.", date: "08 Ene 2026" },
  { title: "Critical: Providers Missing", desc: "Restaurado Providers wrapper en layout.tsx.", date: "08 Ene 2026" },
  { title: "API Rate Limiting", desc: "Token Bucket (5 req/10s) en api/orders/estimate.", date: "08 Ene 2026" },
  { title: "Server Actions Protegidos", desc: "Verificación de ddreams_admin_session en acciones críticas.", date: "08 Ene 2026" },
  { title: "Explosión de Factura (Spam)", desc: "Validación Zod estricta y centralización de email.", date: "07 Ene 2026" },
  { title: "Botón de la Muerte", desc: "Soft Delete implementado.", date: "05 Ene 2026" }
];
