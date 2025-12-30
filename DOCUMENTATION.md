# Documentación Técnica del Proyecto: Ddreams 3D

Este documento sirve como manual oficial de la arquitectura, mantenimiento y funcionamiento de la web de Ddreams 3D.
**Fecha de actualización:** 30/12/2025
**Tecnología:** Next.js 14, TypeScript, Tailwind CSS.

---

## 1. Visión General

### ¿Qué es esta web?
Es una plataforma híbrida que funciona como:
1.  **Catálogo y Portafolio (Público):** Muestra productos, servicios y trabajos realizados optimizados para SEO.
2.  **Sistema de Gestión (Privado):** Permite a los administradores gestionar pedidos, contenido y configuraciones, y a los clientes ver sus compras.

### Problema que resuelve
Centraliza la presencia digital del negocio, eliminando la dependencia de redes sociales para mostrar el catálogo y profesionalizando la toma de pedidos y cotizaciones.

---

## 2. Arquitectura del Sistema

El proyecto sigue una arquitectura modular basada en **Next.js App Router**.

### Organización de Carpetas (`src/app`)

La estructura se divide en dos mundos para separar responsabilidades y seguridad:

*   **`src/app/(public)`**:
    *   Contiene todas las páginas visibles para visitantes (Inicio, Catálogo, Servicios).
    *   **Prioridad:** Velocidad de carga y SEO.
    *   **Renderizado:** Mayormente en Servidor (Server Components).
*   **`src/app/(protected)`**:
    *   Contiene el Admin Dashboard y Perfiles de Usuario.
    *   **Prioridad:** Interactividad y seguridad.
    *   **Renderizado:** Mayormente en Cliente (Client Components) con autenticación requerida.

### Módulos Clave (`src/features` vs `src/shared`)

*   **`src/shared`**: Componentes que se usan en toda la web (Botones, Inputs, Layouts, Header, Footer).
*   **`src/features`**: Código específico de una sección.
    *   *Ejemplo:* `src/features/catalog` contiene la lógica del catálogo que no se usa en el "Contact Us". Esto mantiene el código limpio.

---

## 3. Flujo de Datos y Contenido

La web utiliza una arquitectura **"Static Data First"** para máxima velocidad.

### ¿De dónde salen los productos?
No hay base de datos lenta conectada al catálogo público. Los datos viven en archivos estáticos:
*   📍 **Ubicación:** `src/data/products.data.ts`
*   📍 **Ubicación:** `src/data/services.data.ts`

**Ventaja:** La web carga instantáneamente porque no tiene que "esperar" a un servidor externo para mostrar precios o nombres.

### ¿Cómo se editan los datos?
Para cambiar un precio o descripción:
1.  Abrir `src/data/products.data.ts`.
2.  Buscar el producto por su ID o nombre.
3.  Editar el valor (ej. cambiar `price: 150.00` a `price: 180.00`).
4.  Guardar y desplegar.

### Imágenes
*   **Configuración Central:** `src/config/images.ts` controla las imágenes principales (Heros, Banners).
*   **Optimización:** Todas las imágenes usan `next/image` para convertirse automáticamente a formatos modernos (WebP) y ajustar su tamaño al dispositivo del usuario.

---

## 4. Renderizado y Performance

El sitio utiliza un modelo híbrido inteligente:

1.  **Server Components (Por defecto):**
    *   Casi toda la web pública se genera en el servidor.
    *   **Por qué:** Google puede leer el contenido perfectamente (SEO) y el usuario ve la página rápido aunque tenga internet lento.
2.  **Client Components (`'use client'`):**
    *   Solo se usan donde hay interacción (Botones de compra, Formularios, Galerías dinámicas).
    *   **Por qué:** Reduce la cantidad de JavaScript que el celular del usuario tiene que descargar.

---

## 5. Sistemas Clave

### 📊 Analítica (`src/lib/analytics.ts`)
Sistema centralizado que evita ensuciar el código con scripts de rastreo.
*   **Uso:** `trackEvent(AnalyticsEvents.WHATSAPP_CLICK)`
*   **Qué mide:** Clics en WhatsApp, cambios de ruta, compras y descargas.

### 🔍 SEO (`src/components/seo`)
Implementación profesional de metadatos y Schema.org.
*   **Automático:** Las páginas generan sus propios títulos y descripciones.
*   **Datos Estructurados:** El componente `LocalBusinessJsonLd` le dice a Google explícitamente los horarios, ubicación y tipo de negocio para aparecer mejor en mapas.

### 🛡️ Seguridad
*   **Autenticación:** Gestionada por **Firebase Auth**.
*   **Rutas Protegidas:** Componentes `ProtectedRoute` y `AdminProtection` bloquean el acceso a usuarios no autorizados.
*   **Robots.txt:** Instruye a los buscadores (`src/app/robots.ts`) para que ignoren el área de administración.

---

## 6. Guía de Mantenimiento

### ✅ ZONA VERDE: Seguro de tocar
*   **Contenido:** `src/data/*.ts` (Productos, Servicios, Textos).
*   **Imágenes:** `public/images/` (Subir nuevas fotos aquí).
*   **Configuración:** `src/config/` (Roles, Rutas de imágenes principales).

### ⚠️ ZONA AMARILLA: Tocar con cuidado
*   **Estilos:** `src/globals.css` (Afecta a toda la web).
*   **Componentes UI:** `src/components/ui/` (Si cambias un botón aquí, cambia en TODOS lados).

### ⛔ ZONA ROJA: NO tocar sin conocimientos avanzados
*   **Lógica de Auth:** `src/contexts/AuthContext.tsx` y `src/lib/firebase.ts`.
*   **SEO Core:** `src/app/layout.tsx` y componentes `JsonLd`.
*   **Configuración Next:** `next.config.js`, `tsconfig.json`.

---

## 7. Estado del Proyecto

**Nivel de Solidez: ALTO**
El proyecto está construido sobre bases sólidas, modulares y tipadas (TypeScript).

*   **Escalabilidad:** Puede soportar cientos de productos sin cambios estructurales.
*   **Preparado para el futuro:** La separación de "Datos" y "Vista" facilita migrar a una base de datos real (CMS) en el futuro sin tener que rediseñar la web.

**Recomendación Final:**
Mantener la disciplina de **no mezclar lógica con diseño**. Si se añade una nueva funcionalidad, crear su propia carpeta en `features` en lugar de inflar los archivos existentes.
