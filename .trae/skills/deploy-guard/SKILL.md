---
name: "deploy-guard"
description: "Verifica la salud del proyecto antes de un despliegue. Invocar cuando el usuario quiera 'subir cambios', 'desplegar', 'verificar código' o antes de un git push."
---

# Guardian de Despliegue (Deploy Guard)

Esta habilidad asegura que el código esté listo para producción ejecutando una batería de verificaciones críticas. Su objetivo es prevenir que errores de compilación o configuración lleguen a la rama `main`.

## 📋 Checklist de Verificación
Esta skill debe ejecutar o sugerir los siguientes pasos en orden:

1.  **Diagnóstico de Entorno**:
    *   Comando: `node scripts/diagnose-env.mjs`
    *   Objetivo: Confirmar que todas las variables `.env` (especialmente Firebase Admin y Telegram) estén presentes.

2.  **Verificación de Tipos y Build**:
    *   Comando: `npm run build`
    *   Objetivo: Detectar errores de TypeScript (como `user.uid` vs `user.id`) y fallos de compilación de Next.js.
    *   *Nota*: Next.js ejecuta el linter automáticamente durante el build, pero si falla muy rápido, ejecutar `npm run lint` por separado puede dar más detalles.

3.  **Estado de Git**:
    *   Comando: `git status`
    *   Objetivo: Asegurar que no haya archivos basura o cambios no stageados accidentales.

## 🚨 Errores Comunes a Vigilar
*   **TypeScript**: Confusión entre interfaces de Cliente (`User` con `id`) y objetos de Firebase (`User` con `uid`).
*   **Server Components**: Importar hooks de cliente (`useRouter`, `useState`) en componentes de servidor sin `'use client'`.
*   **Admin SDK**: Importar `admin-sdk` o `ServerInboxService` en componentes de cliente (causará error de compilación por dependencias de Node.js como `fs` o `net`).

## Cuándo Invocar
*   Antes de cualquier `git push` a `main`.
*   Cuando el usuario diga "listo para subir", "revisa si todo está bien", o "prepara el deploy".
