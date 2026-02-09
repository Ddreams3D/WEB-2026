---
name: "ddreams-expert"
description: "Experto en Ddreams 3D Web: Next.js 16, React 19, Firebase, Three.js y arquitectura completa. Invocar para cualquier tarea de desarrollo, arquitectura o depuración."
---

# Experto en Ddreams 3D Web

Esta habilidad proporciona conocimiento profundo sobre el ecosistema y arquitectura del proyecto Ddreams 3D Web.

## 🛠 Stack Tecnológico Principal
- **Core**: Next.js 16.1 (App Router, Turbopack), React 19, TypeScript.
- **Backend (Serverless)**: Firebase (Auth, Firestore, Storage, Admin SDK).
- **Estilos & UI**: Tailwind CSS, Framer Motion, Shadcn/Radix Primitives, Lucide Icons, Sonner (Toasts).
- **3D & Gráficos**: `@react-three/fiber`, `@react-three/drei`, `three.js`.
- **IA & Integraciones**: Google Gemini AI (`@google/generative-ai`), Resend (Emails), Telegram Bot API.

## 📂 Arquitectura del Proyecto

### 1. Estructura de Directorios (`src/`)
- **`app/`**: Rutas usando Route Groups.
  - `(public)/`: Vistas públicas (Home, Catálogo, Checkout, Contacto).
  - `(protected)/admin/`: Panel de administración protegido.
  - `api/`: Endpoints Serverless (`telegram/webhook`, `orders/estimate`, `production`).
- **`features/`**: Módulos funcionales autocontenidos.
  - `admin`: Panel de control principal. Contiene sub-módulos complejos:
    - `quoter`: Cotizador manual para admin.
    - `production`: Gestión de colas de impresión y Slicing hooks.
    - `finances`: Gestión de gastos e ingresos (Telegram bot).
  - `catalog`: Lógica de filtrado y visualización de productos 3D.
  - `cart`: Gestión del carrito de compras.
  - `checkout`: Proceso de pago.
- **`services/`**: Lógica de negocio pura (Patrón Singleton/Service).
  - Ej: `product.service.ts`, `order.service.ts`, `whatsapp.service.ts`.
- **`lib/`**: Configuración de infraestructura (`firebase.ts`, `admin-sdk.ts`).

### 2. Patrones Críticos
- **Acceso a Datos**:
  - **Cliente**: Firebase Client SDK + Contextos (`AuthContext`, `CartContext`).
  - **Servidor/API**: `firebase-admin` (Admin SDK). **Obligatorio** en rutas API y Webhooks.
- **Seguridad**:
  - `AdminProtection`: HOC/Componente para rutas privadas (valida `user.id`).
  - `ServerInboxService`: Manejo seguro de datos desde bots (Telegram) sin sesión de usuario.
- **Gestión de Estado**: Hooks personalizados por feature (ej. `useCartManager`, `useAdminProtection`).

### 3. Funcionalidades Clave
- **Bot de Telegram**: Webhook en `/api/telegram/webhook`. Inyecta gastos en `ServerInboxService`.
- **Temas Estacionales**: Sistema de temas (`SeasonalThemeController`) configurable desde Admin.
- **Landing Pages Dinámicas**: Generación de landings por ubicación (Arequipa/Lima) o servicio.
- **Cotizador 3D**: Módulo complejo en `src/features/quoter`.

## ⚠️ Reglas de Oro para Desarrollo
1. **Tipos de Usuario**: La interfaz `User` interna usa `id`, no `uid`.
2. **Variables de Entorno**:
   - `FIREBASE_PRIVATE_KEY` / `FIREBASE_CLIENT_EMAIL`: Solo servidor (Admin SDK).
   - `NEXT_PUBLIC_*`: Solo cliente.
3. **Despliegue**: Netlify (automático al push a `main`). Ejecutar `npm run build` local antes de push.
4. **Componentes 3D**: Usar siempre dentro de `Canvas` de R3F. Cuidar el rendimiento (lazy loading).

## Comandos Útiles
- `npm run dev`: Servidor local (Turbopack).
- `node scripts/diagnose-env.mjs`: Validar variables de entorno.
- `npm run analyze`: Analizar tamaño del bundle.
