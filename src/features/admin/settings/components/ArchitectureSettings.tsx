import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, Database, Layout, ShieldCheck, Globe, Layers, Zap, 
  Server, FileImage, Brain, MessageSquare, BookOpen, 
  Code2, Sparkles, BarChart3, Lock, Share2, MousePointer2,
  Rocket, Cloud, Boxes, Palette, Ghost, Scale, Bell, Mail, 
  TriangleAlert, ShieldAlert, FileCode, Activity, Map, Fingerprint,
  Image, Scissors, ScanSearch, ShoppingCart, FileText, Heart,
  Briefcase, FileJson, Play, TestTube, PaintBucket, DatabaseZap,
  Type, Shuffle, Radar, FileWarning, Smartphone, TrendingUp, Calendar, LayoutTemplate, RefreshCw
} from 'lucide-react';
import { SectionGuidelines } from './SectionGuidelines';

export function ArchitectureSettings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
          ADN del Proyecto: Ddreams 3D
        </h2>
        <p className="text-muted-foreground text-lg italic">
          "Entender tu web es el primer paso para dominar tu negocio digital."
        </p>
      </div>

      <SectionGuidelines 
        title="Mapa Maestro del Proyecto"
        description="Esta sección es el plano de ingeniería del software. Su objetivo es que cualquier desarrollador (o IA) entienda cómo funciona el sistema sin leer todo el código."
        dos={[
          "Registra NUEVAS librerías críticas (ej. Stripe, Resend).",
          "Documenta cambios en el flujo de datos (ej. Cliente -> Server Action -> DB).",
          "Actualiza si cambias la estructura de carpetas (src/features).",
          "Menciona patrones globales (ej. 'Usamos Adapter Pattern para...')."
        ]}
        donts={[
          "NO registres cambios visuales menores (colores, márgenes).",
          "NO listes componentes UI individuales (eso va en Vocabulario).",
          "NO expliques lógica de negocio específica de un solo producto.",
          "NO borres riesgos antiguos si aún no están 100% resueltos."
        ]}
      />

      <Tabs defaultValue="frontend" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto p-1 bg-muted/50 rounded-xl mb-8">
          <TabsTrigger value="frontend" className="flex flex-col gap-2 py-4 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
            <Layout className="w-6 h-6 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">La Cara (Frontend)</span>
          </TabsTrigger>
          <TabsTrigger value="backend" className="flex flex-col gap-2 py-4 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
            <Database className="w-6 h-6 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">El Cerebro (Datos)</span>
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex flex-col gap-2 py-4 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
            <Brain className="w-6 h-6 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider">La IA (Reglas)</span>
          </TabsTrigger>
          <TabsTrigger value="guardians" className="flex flex-col gap-2 py-4 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Guardianes</span>
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex flex-col gap-2 py-4 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
            <TriangleAlert className="w-6 h-6 text-red-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Riesgos y Salud</span>
          </TabsTrigger>
          <TabsTrigger value="infra" className="flex flex-col gap-2 py-4 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
            <Cloud className="w-6 h-6 text-slate-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Nube y Más</span>
          </TabsTrigger>
          <TabsTrigger value="invisible" className="flex flex-col gap-2 py-4 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all">
            <Ghost className="w-6 h-6 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Los Invisibles</span>
          </TabsTrigger>
        </TabsList>

        {/* --- FRONTEND: LA CARA --- */}
        <TabsContent value="frontend" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechCard 
              icon={Zap}
              title="Next.js 16 (App Router)"
              description="Es el esqueleto y motor de tu web. Operando en la última versión estable (v16) con React 19. Máximo rendimiento y capacidades de servidor modernas."
              tech="React 19 Engine"
              badge="Bleeding Edge"
              alternatives="Remix, Vite, Astro"
            />
            <TechCard 
              icon={Palette}
              title="Tailwind CSS v3.4"
              description="Es el sastre de tu web. Diseño atómico y utilitario que permite estilos rápidos y consistentes. Optimizado para evitar CSS muerto en producción."
              tech="Styling"
              badge="Diseño"
              alternatives="Bootstrap, Material UI, CSS Puro"
            />
            <TechCard 
              icon={Sparkles}
              title="Framer Motion"
              description="Es el coreógrafo. Se encarga de que los botones brillen, las secciones aparezcan suavemente y la web se sienta 'viva' y moderna."
              tech="Animaciones"
              badge="Experiencia"
              alternatives="GSAP, Anime.js"
            />
            
            <TechCard 
              icon={Type}
              title="Tipografía: Inter & Montserrat"
              description="Combinación de fuentes optimizadas por Google Fonts. 'Inter' para legibilidad en UI y 'Montserrat Alternates' para títulos con personalidad de marca."
              tech="Next.js Fonts"
              badge="Identidad"
            />

            <TechCard 
              icon={Bell}
              title="Sonner (Notificaciones)"
              description="Sistema de avisos elegante y apilable. Informa al usuario sobre el éxito o error de sus acciones sin bloquear su navegación. Reemplaza al 'alert' tradicional."
              tech="UI Feedback"
              badge="UX/UI"
            />

            <TechCard 
              icon={Calendar}
              title="Motor de Festividades"
              description="La web se disfraza sola. En Navidad nieva, en Halloween se oscurece. Un archivo JSON controla las fechas y los estilos automáticos."
              tech="Theme Engine"
              badge="Automático"
            />

            <TechCard 
              icon={LayoutTemplate}
              title="Universal Landing Engine"
              description="Un motor de 'Renderizado Polimórfico'. Convierte datos crudos de Campañas o Servicios en experiencias visuales idénticas. Permite que un solo Editor gobierne todo el sitio."
              tech="Adapter Pattern"
              badge="Core UI"
            />

            <TechCard 
              icon={DatabaseZap}
              title="React Context API"
              description="El sistema nervioso central. Conecta todo sin cables: Auth (Usuario), Cart (Carrito) y Theme (Oscuro/Claro) están disponibles en cualquier parte de la app."
              tech="Global State"
              badge="Gestión de Estado"
            />

            <TechCard 
              icon={Image}
              title="Next Image"
              description="El componente <Image /> optimiza automáticamente cada foto. Evita que la web salte al cargar (Layout Shift) y sirve el tamaño perfecto para cada móvil."
              tech="Image Optimization"
              badge="Performance"
            />
          </div>
          
          <Card className="border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Boxes className="w-5 h-5" /> ¿Cómo se organiza lo que ves?
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><strong>Componentes (UI):</strong> Piezas reutilizables como botones, inputs y tarjetas. Están en <code>/components/ui</code>.</p>
                <p><strong>Features (Funcionalidades):</strong> Secciones grandes como el Catálogo o el Admin. Cada una tiene su propia lógica, estilos y componentes.</p>
              </div>
              <div className="space-y-2">
                <p><strong>Contextos:</strong> Es la 'memoria a corto plazo' del navegador. Guarda si estás logueado o qué tienes en el carrito.</p>
                <p><strong>Hooks:</strong> Pequeños asistentes que manejan acciones repetitivas como 'detectar si el usuario bajó la pantalla'.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- BACKEND: EL CEREBRO --- */}
        <TabsContent value="backend" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechCard 
              icon={Database}
              title="Firebase Firestore"
              description="Tu base de datos NoSQL. No es una tabla rígida, sino una colección de 'Documentos' (como carpetas). Es ultra rápida para leer datos en tiempo real."
              tech="Database"
              badge="Real-time"
              alternatives="Supabase, MongoDB, PostgreSQL"
            />
            <TechCard 
              icon={Lock}
              title="Firebase Auth"
              description="El portero de seguridad. Maneja los correos, contraseñas y logins con Google sin que nosotros tengamos que guardar datos sensibles."
              tech="Seguridad"
              badge="Protección"
              alternatives="Auth0, Clerk, NextAuth"
            />
            <TechCard 
              icon={FileImage}
              title="Firebase Storage"
              description="El almacén de archivos. Aquí guardamos las fotos de tus proyectos 3D y los avatares de los usuarios en alta calidad."
              tech="Storage"
              badge="Archivos"
              alternatives="AWS S3, Cloudinary"
            />
          </div>

          <Card className="border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Code2 className="w-5 h-5" /> ¿Cómo fluye la información?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>Cuando un cliente pide una cotización, ocurre este viaje:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>La web valida que los datos estén completos (usando una librería llamada <strong>Zod</strong>).</li>
                <li>Se envía la orden a <strong>Firestore</strong>.</li>
                <li><strong>Google Analytics</strong> anota que hubo una conversión.</li>
                <li>Tú recibes la notificación en tu panel de administración.</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- INTELLIGENCE: LA IA --- */}
        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TechCard 
              icon={Brain}
              title="Contexto Inyectado"
              description="Tu web no solo usa IA, le 'enseña' a la IA. Le pasamos tus Reglas, Glosario y Vocabulario para que cuando la IA trabaje, hable con la voz de Ddreams 3D."
              tech="IA Context"
              badge="Cerebro"
            />
            
            <TechCard 
              icon={RefreshCw}
              title="Sincronización Híbrida"
              description="Sistema de puente Cliente-Servidor. Permite leer archivos locales (AI_RULES.md) y sincronizarlos con Firestore, manteniendo la 'Fuente de Verdad' siempre actualizada."
              tech="Server Actions"
              badge="Sync"
            />

            <TechCard 
              icon={MessageSquare}
              title="Prompts Estructurados"
              description="Convertimos tus ajustes de configuración en instrucciones técnicas que los modelos de lenguaje (como GPT o Gemini) pueden entender perfectamente."
              tech="Prompt Engineering"
              badge="Lenguaje"
            />

            <TechCard 
              icon={FileCode}
              title="Constitución IA (Types)"
              description="La IA no improvisa. Se rige por 'ai-rules.ts', un contrato estricto de TypeScript que define qué es un 'Término' y qué es una 'Regla'. Código que se explica a sí mismo."
              tech="Type-Safe Rules"
              badge="Estructura"
            />
          </div>
          
          <div className="p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20">
            <h4 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-2">¿Por qué es especial tu sistema de IA?</h4>
            <p className="text-sm leading-relaxed">
              A diferencia de otras webs, tú tienes control total. Si cambias un término en el <strong>Glosario</strong>, 
              automáticamente la IA "aprende" ese nuevo concepto. No necesitas programar, solo escribir en tu panel. 
              Esto hace que tu web sea <strong>evolutiva</strong>.
            </p>
          </div>
        </TabsContent>

        {/* --- GUARDIANS: SEGURIDAD Y CALIDAD (NUEVO) --- */}
        <TabsContent value="guardians" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechCard 
              icon={TestTube}
              title="Playwright (El Inspector)"
              description="Un robot que entra a tu web cada noche, simula ser un cliente, añade cosas al carrito y compra. Si algo falla, te avisa antes que nadie."
              tech="E2E Testing"
              badge="QA Automático"
            />
            
            <TechCard 
              icon={Activity}
              title="Doctor del Sistema"
              description="Un script propio ('system-check') que recorre cada página, busca cada imagen y verifica cada enlace. Es un chequeo médico completo en segundos."
              tech="Health Check"
              badge="Diagnóstico"
            />

             <TechCard 
              icon={ShieldCheck}
              title="Sentry"
              description="Tu sistema de alarmas silencioso. Si la web le falla a un cliente, Sentry graba exactamente qué pasó y nos avisa antes de que te llamen para quejarse."
              tech="Monitoreo"
              badge="Vigilancia"
            />
            <TechCard 
              icon={Globe}
              title="SEO Vivo (Dynamic Metadata)"
              description="No usamos archivos estáticos aburridos. 'robots.ts' y 'sitemap.ts' generan mapas para Google en tiempo real. Si creas un producto hoy, Google lo sabe hoy."
              tech="Next.js Metadata"
              badge="Visibilidad"
            />

            <TechCard 
              icon={ScanSearch}
              title="Pages Manager (SEO GUI)"
              description="Interfaz gráfica que conecta con 'sitemap.ts'. Permite a los humanos editar lo que los robots de Google leen. Títulos, descripciones y OpenGraph en tiempo real."
              tech="Metadata Management"
              badge="SEO Control"
            />

            <TechCard 
              icon={Lock}
              title="Guardaespaldas (Wrappers)"
              description="No usamos Middleware global (que es lento). Usamos 'AdminProtection', un componente que envuelve físicamente las páginas de admin. Si no eres admin, no te deja entrar."
              tech="HOC Pattern"
              badge="Seguridad"
            />

            <TechCard 
              icon={Scale}
              title="Bundle Analyzer (El Auditor)"
              description="Comando 'npm run analyze'. Genera un mapa visual de qué librerías pesan más. Nos ayuda a mantener la web ligera y rápida."
              tech="Webpack Analyzer"
              badge="Optimización"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechCard 
              icon={Shuffle}
              title="Rescate de Tráfico"
              description="Sistema inteligente que atrapa a clientes perdidos. Si entran a enlaces antiguos (/shop, /marketplace), los redirige automáticamente al catálogo nuevo."
              tech="Next.js Redirects"
              badge="Retención"
            />

            <TechCard 
              icon={ShieldCheck}
              title="Lista VIP (Roles)"
              description="Seguridad híbrida: Lista de emergencia saneada (Solo dueños) + Roles en Firestore. 'AdminService' gestiona la verdad absoluta."
              tech="Hybrid Auth (Optimizado)"
              badge="Seguridad"
            />

             {/* EMAIL SYSTEM - PRODUCTION */}
             <Card className="border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Mail className="w-5 h-5 text-emerald-500" />
                  Email System (Resend)
                </CardTitle>
                <CardDescription className="text-emerald-600/80">Comunicaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-bold text-emerald-600">Motor Transaccional.</span> 
                  Conectado a la API de Resend para envíos reales de alta entregabilidad. Gestiona notificaciones de pedidos y actualizaciones de estado.
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">Producción</Badge>
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700">API First</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- RIESGOS Y SALUD --- */}
        <TabsContent value="risks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <ShieldAlert className="w-5 h-5" /> Riesgos Activos y Deuda Técnica
                </CardTitle>
                <CardDescription>
                  Problemas identificados que deben ser mitigados para garantizar la escalabilidad a largo plazo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-background border border-red-200 dark:border-red-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <h4 className="font-semibold text-sm">Explosión de Factura (Spam)</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Ataques de bots a formularios públicos podrían saturar las escrituras de Firebase y generar costos.
                    </p>
                    <Badge variant="outline" className="text-[10px] border-orange-200 bg-orange-50 text-orange-700">Mitigación Parcial</Badge>
                  </div>

                  <div className="p-4 rounded-lg bg-background border border-red-200 dark:border-red-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Ghost className="w-4 h-4 text-red-500" />
                      <h4 className="font-semibold text-sm">Botón de la Muerte</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      El borrado actual es físico (destructivo). Un error admin podría eliminar datos irrecuperables.
                    </p>
                    <Badge variant="outline" className="text-[10px] border-red-200 bg-red-50 text-red-700">Alto Riesgo</Badge>
                  </div>

                  <div className="p-4 rounded-lg bg-background border border-red-200 dark:border-red-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-yellow-500" />
                      <h4 className="font-semibold text-sm">Silencio Administrativo</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Fallos en el servidor (Server Actions) no siempre se reportan al frontend/analytics.
                    </p>
                    <Badge variant="outline" className="text-[10px] border-yellow-200 bg-yellow-50 text-yellow-700">Riesgo Medio</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Scale className="w-5 h-5" /> Los 5 Pilares de Estabilidad (Constitución IA)
                </CardTitle>
                <CardDescription>
                  Reglas innegociables para mantener el proyecto sano.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600">
                      <Layout className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm block">1. Integridad Arquitectónica</span>
                      <span className="text-xs text-muted-foreground">Respeto absoluto al puente Híbrido (Cliente lee, Servidor escribe).</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600">
                      <Palette className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm block">2. Coherencia Visual</span>
                      <span className="text-xs text-muted-foreground">Mandato de reutilización de componentes y vocabulario UI.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600">
                      <BookOpen className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm block">3. Verdad del Negocio</span>
                      <span className="text-xs text-muted-foreground">Supremacía del Glosario. No inventar lógica fuera de las definiciones.</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm block">4. Seguridad y Orden</span>
                      <span className="text-xs text-muted-foreground">Tolerancia cero a errores de tipo (any) y validación estricta (Zod).</span>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-0.5 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm block">5. Escalabilidad (Nuevo)</span>
                      <span className="text-xs text-muted-foreground">Documentación viva y auditoría de deuda técnica constante.</span>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- INFRA: LA NUBE --- */}
        <TabsContent value="infra" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechCard 
              icon={Server}
              title="Netlify (El Aeropuerto)"
              description="Confirmado: Tu web vive en Netlify. Detectamos un archivo 'netlify.toml' que configura reglas de tráfico especiales para que tu web vuele segura."
              tech="Hosting"
              badge="Infraestructura"
              alternatives="Vercel, AWS"
            />
             <TechCard 
              icon={BarChart3}
              title="Google Analytics 4"
              description="Rastreamos clics en WhatsApp, vistas de productos y qué servicios interesan más. Es tu radar para saber qué funciona y qué no."
              tech="Analítica"
              badge="Datos"
              alternatives="Plausible, Hotjar"
            />
            <TechCard 
              icon={TrendingUp}
              title="ERP Financiero Oculto"
              description="Más que una tienda, es un sistema contable. 'src/features/admin/finances' rastrea ingresos, gastos (fijos/variables) y fases de cobro (adelantos vs final)."
              tech="Business Intelligence"
              badge="Gestión"
            />

            <TechCard 
              icon={Globe}
              title="SEO Estructurado (JSON-LD)"
              description="Tu web habla el idioma de Google. 'LocalBusinessJsonLd' inyecta datos ocultos para que aparezcas en mapas y búsquedas locales de Arequipa."
              tech="Schema.org"
              badge="Posicionamiento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Lenguajes</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">JavaScript</Badge>
                <Badge variant="secondary">JSON</Badge>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Herramientas</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Git</Badge>
                <Badge variant="secondary">ESLint</Badge>
                <Badge variant="secondary">Jest</Badge>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Integraciones</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">WhatsApp API</Badge>
                <Badge variant="secondary">Yape/Plin</Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- INVISIBLE: LOS INVISIBLES --- */}
        <TabsContent value="invisible" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ZOD */}
            <TechCard 
              icon={FileJson}
              title="Esquemas de Validación"
              description="Encontramos las leyes escritas en 'src/lib/validators'. Definen estrictamente qué es un carrito válido y cómo debe ser un checkout seguro."
              tech="Zod"
              badge="Integridad"
            />

            <TechCard 
              icon={Code2}
              title="Utilidad CN (Clsx + Tailwind)"
              description="La función más usada del proyecto ('src/lib/utils.ts'). Fusiona clases de Tailwind sin conflictos, permitiendo componentes condicionales limpios."
              tech="Utility Function"
              badge="Core Utils"
            />

            <TechCard 
              icon={BarChart3}
              title="Analytics Engine (Custom)"
              description="Capa intermedia ('src/lib/analytics.ts') que intercepta cada evento. Valida tipos, previene duplicados y normaliza datos antes de enviarlos a Google."
              tech="Facade Pattern"
              badge="Abstracción"
            />

            {/* SERVER ACTIONS */}
            <TechCard 
              icon={Zap}
              title="React Server Actions"
              description="Funciones que se ejecutan exclusivamente en el servidor pero se llaman como funciones normales de JS. Manejan el envío de emails y gestión de datos sin exponer API endpoints públicos."
              tech="Next.js Core"
              badge="Seguridad"
            />

             {/* CVA / CLSX */}
             <TechCard 
              icon={Scissors}
              title="CVA & Clsx (El Sastre)"
              description="Son las herramientas que permiten que tus botones tengan variantes (rojo, azul, grande, pequeño) sin escribir código duplicado. Mantienen el diseño limpio."
              tech="Estilos Dinámicos"
              badge="Diseño UI"
            />

             {/* SHARP */}
             <TechCard 
              icon={Image}
              title="Sharp (El Fotógrafo)"
              description="Toma tus imágenes gigantes y las comprime automáticamente sin perder calidad para que la web vuele. Es invisible pero esencial."
              tech="Optimización"
              badge="Performance"
            />

            {/* SONNER */}
            <TechCard 
              icon={Bell}
              title="Sonner (El Mensajero)"
              description="Es quien te susurra al oído 'Guardado con éxito' o 'Hubo un error'. Es el sistema de notificaciones elegante que no interrumpe tu trabajo."
              tech="Notificaciones UI"
              badge="Feedback"
            />
            
             {/* CRITTERS */}
             <TechCard 
              icon={Activity}
              title="Critters (El Velocista)"
              description="Toma los estilos más importantes y los 'inyecta' directo en el HTML para que la página se vea bien instantáneamente, antes de cargar el resto."
              tech="CSS Inlining"
              badge="Velocidad"
            />

            {/* HERRAMIENTAS DE BOLSILLO */}
            <TechCard 
              icon={FileCode}
              title="Herramientas de Bolsillo"
              description="Pequeños ayudantes invisibles: 'date-fns' (El Relojero) maneja las fechas y 'uuid' (El Notario) crea identificadores únicos para cada pedido."
              tech="Utils"
              badge="Utilidades"
            />

            <TechCard 
              icon={Zap}
              title="El Oráculo de Tiempo"
              description="En 'api/orders/estimate' vive un algoritmo que calcula fechas de entrega. Sabe si es fin de semana, si el pedido es personalizado (+5 días) y cuándo llegará exactamente."
              tech="Business Logic"
              badge="Algoritmo"
            />

            {/* SEASONAL CONTROLLER */}
            <TechCard 
              icon={Sparkles}
              title="Seasonal Controller"
              description="Un cerebro especial conectado a todo el sistema que puede cambiar el tema de toda la web (Navidad, Halloween) automáticamente según la fecha."
              tech="Global Context"
              badge="Ambiente"
            />

            <TechCard 
              icon={Radar}
              title="Analytics Fantasma"
              description="Un componente invisible ('AnalyticsTracker') que viaja contigo. No se ve, pero escucha cada cambio de ruta y avisa a Google sin recargar la página."
              tech="Client Hook"
              badge="Tracking"
            />
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
             <TechCard 
              icon={FileText}
              title="Formateadores Nativos"
              description="No usamos librerías pesadas para todo. 'src/lib/utils.ts' usa la API nativa del navegador (Intl) para formatear fechas y monedas sin bajar nada."
              tech="Vanilla JS"
              badge="Performance"
            />

            <TechCard 
              icon={Code2}
              title="Librería UI (Shadcn Base)"
              description="En 'src/components/ui' hay 30+ componentes base (Botones, Inputs, Dialogs) construidos sobre Radix UI. Son ladrillos accesibles listos para usar."
              tech="Component Library"
              badge="UI Kit"
            />
            
             <TechCard 
              icon={Smartphone}
              title="Pasarela WhatsApp"
              description="No hay Stripe ni Izipay. El checkout es un 'puente' inteligente que formatea el pedido y abre WhatsApp con todo listo para pagar con Yape/Plin. Cero comisiones."
              tech="Deep Linking"
              badge="Sin Costo"
            />
           </div>

          <Card className="border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <Map className="w-5 h-5" /> Configuración Profunda (Next.config.js)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><strong>Seguridad de Navegación:</strong> Hemos configurado cabeceras estrictas (`X-Frame-Options: DENY`) para que nadie pueda incrustar tu web en otro sitio malicioso.</p>
                <p><strong>Caché Inteligente:</strong> Una política agresiva (`no-store`) asegura que tus clientes siempre vean los precios y productos más recientes, sin refrescar.</p>
              </div>
              <div className="space-y-2">
                <p><strong>Redirecciones SEO:</strong> Un sistema complejo redirige automáticamente el tráfico antiguo de `/marketplace` a tu nuevo `/catalogo`, salvando tu posicionamiento en Google.</p>
                <p><strong>Webpack Chunks:</strong> Dividimos el código en pedacitos (`vendors`, `lucide`) para que el navegador solo descargue lo estrictamente necesario.</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* FIRESTORE RULES */}
            <Card className="border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <ShieldCheck className="w-5 h-5" /> Constitución de Seguridad (Rules)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Encontré un sistema de leyes estricto:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li><strong>Anti-Golpe de Estado:</strong> Un usuario puede editar su foto, pero JAMÁS su rol. Nadie puede volverse Admin por su cuenta.</li>
                  <li><strong>Validación de Precios:</strong> El sistema rechaza automáticamente productos con precios negativos o absurdos.</li>
                  <li><strong>Super-Admin:</strong> Hay una "puerta trasera" de seguridad solo para ti y Daniel en caso de emergencia.</li>
                </ul>
              </CardContent>
            </Card>

            {/* MAINTENANCE BOTS */}
            <Card className="border-slate-100 dark:border-slate-900/30 bg-slate-50/30 dark:bg-slate-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-400">
                  <FileCode className="w-5 h-5" /> Robots de Mantenimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Scripts ocultos en la carpeta raíz que trabajan cuando tú duermes:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li><code>migrate-images.mjs</code>: Mueve imágenes masivamente sin romper enlaces.</li>
                  <li><code>diagnose-env.mjs</code>: Un "doctor" que revisa la salud del servidor.</li>
                  <li><code>system-check.mjs</code>: Auditoría automática de integridad.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
            
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <TechCard 
              icon={TestTube}
              title="Taller Secreto (Dev Routes)"
              description="Rutas ocultas que solo funcionan en tu máquina: '/dev/harness' para probar el sistema y '/seed-data' para reiniciar la base de datos."
              tech="Dev Only"
              badge="Herramientas"
            />

            <TechCard 
              icon={FileCode}
              title="Robots de Limpieza (Scripts)"
              description="Comandos de terminal para mantenimiento: 'verify-image-urls' busca enlaces rotos y 'analyze' revisa el peso de la web."
              tech="NPM Scripts"
              badge="Mantenimiento"
            />

            <TechCard 
              icon={PaintBucket}
              title="Sistema de Camuflaje"
              description="Tu web tiene 7 identidades secretas (Halloween, San Valentín, Navidad...) pre-cargadas en 'src/styles/themes'. Cambia de piel automáticamente sin tocar código."
              tech="CSS Modules"
              badge="Temas"
            />

            <TechCard 
              icon={DatabaseZap}
              title="Semilla de Datos (Seeding)"
              description="Una herramienta de desarrollo segura que puede reiniciar la base de datos con un clic. Protegida para no funcionar nunca en producción."
              tech="Dev Tools"
              badge="Utilidad"
            />
          </div>
        </TabsContent>
        
        {/* --- SISTEMA NERVIOSO: CONTEXTS --- */}
        <div className="mt-8">
            <Card className="border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/30 dark:bg-cyan-900/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
                <Activity className="w-5 h-5" /> El Sistema Nervioso (Contextos)
                </CardTitle>
                <CardDescription className="text-cyan-600/80">
                Estos son los "órganos vitales" que mantienen la memoria de la web mientras navegas:
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2"><Fingerprint className="w-4 h-4"/> AuthContext</p>
                <p className="text-muted-foreground text-xs mt-1">Maneja tu identidad: ¿Quién eres? ¿Eres admin?</p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2"><ShoppingCart className="w-4 h-4"/> CartContext</p>
                <p className="text-muted-foreground text-xs mt-1">Tu carrito de compras. Recuerda qué productos elegiste.</p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2"><Map className="w-4 h-4"/> OrderTracking</p>
                <p className="text-muted-foreground text-xs mt-1">El GPS. Sigue el estado de tu pedido en tiempo real.</p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2"><FileText className="w-4 h-4"/> QuoteContext</p>
                <p className="text-muted-foreground text-xs mt-1">El Negociador. Maneja los datos para cotizaciones personalizadas.</p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2"><Heart className="w-4 h-4"/> Favorites</p>
                <p className="text-muted-foreground text-xs mt-1">Tu lista de deseos. Guarda lo que te gusta para después.</p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2"><Bell className="w-4 h-4"/> Notification</p>
                <p className="text-muted-foreground text-xs mt-1">El Mensajero. Te avisa cuando algo importante sucede.</p>
                </div>
            </CardContent>
            </Card>
        </div>

      </Tabs>
    </div>
  );
}

interface TechCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  tech: string;
  badge: string;
  alternatives?: string;
}

function TechCard({ icon: Icon, title, description, tech, badge, alternatives }: TechCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 group border-muted/60">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <Badge variant="outline" className="text-xs font-normal text-muted-foreground bg-muted/30">
            {badge}
          </Badge>
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-xs font-medium text-primary/80 mt-1">
          {tech}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        {alternatives && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold">
              Alternativas no usadas:
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              {alternatives}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

