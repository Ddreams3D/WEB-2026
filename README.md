# Ddreams 3D - Next.js

> **🤖 CONTEXTO PARA IA (IMPORTANTE):**
> Si eres un Agente de IA (Cursor, Trae, Windsurf), tu **PRIMERA ACCIÓN** debe ser leer el archivo:
> 👉 [`AI_RULES.md`](./AI_RULES.md)
> Este archivo contiene la Constitución del Proyecto, los 5 Pilares de Estabilidad y las Reglas de Negocio innegociables.

Un proyecto moderno de mapas conceptuales desarrollado con Next.js 16, utilizando App Router y las mejores prácticas de desarrollo.

## Tecnologías Utilizadas

- **Next.js 16** - Framework de React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **Framer Motion** - Animaciones fluidas
- **Firebase** - Base de datos y autenticación
- **Lucide React** - Iconos modernos

## Instalación y Desarrollo

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter de código
- `npm run test` - Ejecutar pruebas unitarias (Jest)
- `npm run test:e2e` - Ejecutar pruebas End-to-End (Playwright)

## Testing y Calidad

### Pruebas E2E (Playwright)
Ejecuta las pruebas de flujos críticos de usuario (Navegación, Carrito, Contacto):
```bash
npm run test:e2e
```

### System Diagnostic Harness (Interno)
Herramienta visual para diagnóstico rápido, health checks y pruebas de estrés.
- **URL:** [/dev/harness](http://localhost:3000/dev/harness)
- **Uso:** Verificar estado de rutas, simular flujos de carrito y probar lógica de órdenes bajo estrés.
- **⚠️ Nota de Seguridad:** Esta ruta es **exclusiva para desarrollo**. Debe estar protegida o deshabilitada en entornos de producción para evitar exponer herramientas de diagnóstico públicas.

## Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página de inicio
│   └── [rutas]/        # Páginas de la aplicación
├── components/         # Componentes reutilizables
├── shared/            # Estilos y utilidades compartidas
├── hooks/             # Custom hooks
└── utils/             # Funciones utilitarias
```

## Características

- ✅ **App Router** de Next.js 15
- ✅ **TypeScript** con tipado estricto
- ✅ **Tailwind CSS** con configuración personalizada
- ✅ **Framer Motion** para animaciones
- ✅ **Responsive Design** optimizado
- ✅ **SEO optimizado** con metadata
- ✅ **Testing** con Jest y Testing Library
- ✅ **Linting** con ESLint
- ✅ **Optimización** de rendimiento

## Despliegue

El proyecto está configurado para desplegarse en Netlify.

```bash
npm run build
```
