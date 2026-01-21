# CONSTITUCIÓN DEL PROYECTO (AI RULES)

> **META-INSTRUCCIÓN:** Este documento es la LEY SUPREMA para cualquier Agente de IA (Cursor, Trae, Windsurf, etc.) que modifique este código. Ignorar estas reglas conlleva inestabilidad técnica.

## 🏛️ LOS 5 PILARES DE ESTABILIDAD

### 1. Pilar de Integridad Arquitectónica (La Ley Física)
**Riesgo:** La IA tiende a inventar soluciones "fáciles" que rompen la separación Cliente/Servidor.
**REGLA:** *"Respeto Absoluto al Puente Híbrido"*
- **Lecturas:** SIEMPRE vía Firebase Client SDK (`useFirestore`, `getDoc`) en componentes `use client`.
- **Escrituras:** SIEMPRE vía Server Actions (`'use server'`) para lógica de negocio crítica o admin.
- **Prohibido:** Importar `firebase-admin` en componentes de cliente o exponer `process.env` secretos al navegador.

### 2. Pilar de Coherencia Visual (La Ley del Vocabulario)
**Riesgo:** Fragmentación de UI. La IA crea componentes duplicados (ej. `NewButton` vs `Button`).
**REGLA:** *"Mandato de Reutilización"*
- **Vocabulario:** Consulta `src/services/prompt-vocabulary.service.ts` ANTES de escribir UI.
- **Componentes:** Si existe en `src/components/ui`, ÚSALO.
- **Estilos:** Prohibido `style={{}}` (inline styles). Usa Tailwind CSS + `cn()`.
- **Iconos:** Usa `lucide-react` exclusivamente.

### 3. Pilar de Verdad del Negocio (La Ley del Glosario)
**Riesgo:** Alucinaciones conceptuales (ej. inventar stock en servicios).
**REGLA:** *"Supremacía del Glosario"*
- **Definiciones:** `src/services/glossary.service.ts` es la única verdad.
- **Lógica:** Si el glosario dice que un "Servicio" no tiene stock, el código NO debe gestionar stock para servicios.

### 4. Pilar de Seguridad y Orden (La Ley del Código)
**Riesgo:** Deuda técnica y vulnerabilidades silenciosas.
**REGLA:** *"Tolerancia Cero a Errores"*
- **Tipado:** Prohibido `any`. Todo debe tener interfaz en `src/shared/types`.
- **Validación:** Todo input de usuario (Formularios, URLs) debe pasar por un esquema **Zod**.
- **Limpieza:** Si refactorizas, BORRA el código viejo. No dejes código comentado "por si acaso".

### 5. Pilar de Escalabilidad y Mantenimiento (La Ley del Futuro)
**Riesgo:** El proyecto funciona hoy, pero es immantenible en 6 meses.
**REGLA:** *"Documentación Viva y Auditoría"*
- **Sincronización:** Si cambias la lógica de una Feature, ACTUALIZA `ArchitectureSettings.tsx`. No dejes que la documentación mienta.
- **Triggers (Alarmas):** Si editas `package.json`, `middleware.ts` o creas una carpeta en `src/features`, OBLIGATORIAMENTE revisa si afecta la Arquitectura.
- **Complejidad:** Prefiere código aburrido y legible sobre "trucos" inteligentes de una sola línea.
- **Riesgos:** Revisa siempre la sección "Riesgos y Mitigación" en Arquitectura antes de desplegar cambios críticos.

### 6. Protocolos de Despliegue y Control de Versiones
**Riesgo:** Subidas accidentales o despliegues no autorizados.
**REGLA:** *"Confirmación Explícita"*
- **GitHub:** NUNCA subir cambios al repositorio remoto (push) a menos que el usuario lo solicite explícitamente.
- **Producción:** Los despliegues a producción deben ser consecuencia de una acción consciente, no un efecto secundario automático.

---

### 3. Estructura de Rutas y Route Groups
- **Regla:** Usar Route Groups (paréntesis) para aislar layouts y contextos.
- **Implementación:**
  - `(protected)/admin`: Contiene lógica protegida que requiere sesión.
  - `(dashboard)`: Sub-grupo para el panel principal, aislando el layout de navegación del login.
  - **Beneficio:** Permite tener un `layout.tsx` específico para el dashboard (sidebar, header) que no afecta a la página de Login.

### 4. Seguridad y Autenticación (Híbrida)
- **Cliente (Firebase):** Solo lecturas públicas (Catálogo, Blog).
- **Servidor (Admin):**
  - **Librería:** `jose` para firma y verificación de JWT.
  - **Transporte:** Cookies `HttpOnly` + `Secure`. **PROHIBIDO** usar `localStorage` o cookies accesibles por JS para tokens de admin.
  - **Validación:** Middleware y Server Actions verifican `verifyAdminSession()`.

## 🚨 RIESGOS ACTIVOS (Live Check)

> **Estado del Sistema:** ✅ Estable. Se mitigaron vulnerabilidades de autenticación crítica (Cookie/JWT).
> *Última auditoría: Enero 2026*

## 📜 HISTORIAL DE SOLUCIONES Y LECCIONES (Archivo)

### 7. Multi-Context Pricing (Precios Dinámicos por Landing) [IMPLEMENTADO - Enero 2026]
- **Problema:** Necesidad de vender el mismo producto con precios distintos según la landing (ej. Medicina vs Estudiantes) sin duplicar el producto en base de datos.
- **Solución:**
  - Se extendió el tipo `Product` con `landingPrices: Record<string, number>`.
  - Se modificaron los hooks `useServiceLanding` y `useSeasonalLanding` para detectar el contexto y sobreescribir el precio visualmente en tiempo de ejecución.
  - Se mantiene el principio de "Single Source of Truth" (un solo producto, múltiples vistas).

### 6. Build Crash por Definiciones Duplicadas [MITIGADO - Enero 2026]
- **Problema:** `ArchitectureSettings.tsx` contenía definiciones locales de componentes (`NavTab`, `SectionLabel`) que causaban errores de "duplicate identifier" y bloqueaban el build.
- **Solución:**
  - Se modularizaron los componentes UI a `ArchitectureUI.tsx`.
  - Se eliminó código muerto (`SectionLabel` no usado).
  - Se limpiaron imports no utilizados.

### 5. Vulnerabilidad de Sesión Cliente (Cookie) [MITIGADO - Enero 2026]
- **Problema:** `AuthContext` manipulaba cookies de admin (`ddreams_admin_session`) en el cliente (`document.cookie`), exponiendo la sesión a XSS.
- **Solución:**
  - Se eliminó toda escritura de cookies del lado del cliente.
  - Se implementó `httpOnly` cookies estrictas desde el servidor (`/api/admin/login`).
  - Se añadió firma criptográfica JWT (`jose`) para garantizar integridad.

### 4. Critical: Providers No Cargaban [MITIGADO - Enero 2026]
- **Problema:** La aplicación no cargaba Auth, Cart ni Theme porque faltaba el wrapper `<Providers>` en `layout.tsx`.
- **Solución:** Se envolvió `{children}` con `<Providers>` en el layout raíz.

### 3. API Pública sin Rate Limiting [MITIGADO - Enero 2026]
- **Problema:** El endpoint `api/orders/estimate` era público y vulnerable a abuso (DoS).
- **Solución:** Se implementó `RateLimiter` (Token Bucket) en `src/lib/rate-limit.ts`. Límite: 5 peticiones cada 10s por IP.

### 2. Server Actions No Protegidos [MITIGADO - Enero 2026]
- **Problema:** Las Server Actions (`service-landings`, `seasonal`, `ai-rules`) no verificaban autenticación, permitiendo ejecución arbitraria.
- **Solución:**
  - Se implementó `verifyAdminSession()` en `src/lib/auth-admin.ts` verificando la cookie `ddreams_admin_session`.
  - Se aplicó la verificación al inicio de `saveServiceLandingAction`, `updateSeasonalThemesAction` y `getLocalAIRules`.

### 1. Riesgo "Explosion de Factura" (Spam) [MITIGADO - Enero 2026]
- **Problema:** Ataques de bots a formularios públicos saturaban las escrituras de Firebase.
- **Solución:**
  - Se centralizó la lógica de email en `src/lib/email-service.ts`.
  - Se implementó `auth-admin.ts` para verificar tokens en el servidor.
  - Se protegió la API `notifications` con verificación de administrador.
  - Validación Zod estricta en todos los inputs.

### 2. Riesgo "Botón de la Muerte" (Data Loss) [MITIGADO - Enero 2026]
- **Problema:** Borrado físico inmediato permitía errores catastróficos por parte de admins.
- **Solución:**
  - Implementación de **Soft Delete** (`isDeleted: true`) en `ProjectService`, `UserService` y `OrderService`.
  - Los datos solo se ocultan, requiriendo una acción explícita `permanentDelete` para su eliminación real.

### 3. Riesgo "Silencio Administrativo" [MITIGADO - Enero 2026]
- **Problema:** Fallos en Server Actions (pagos, emails) no se reportaban, dificultando el debug.
- **Solución:**
  - Creación de `src/lib/logger.ts` conectado a Firestore (`system_logs`) y consola de Vercel.
  - Integración en flujos críticos como `submitPaymentProofAction`.

### 4. Riesgo "Puertas Traseras" (Inyección) [MITIGADO - Previo]
- **Problema:** Datos no validados entrando a la BD.
- **Solución:** Validación Zod obligatoria en todos los Server Actions.

### 7. Integración Bot de Finanzas (Inbox Telegram) [NUEVO - Enero 2026]
- **Contexto:** Se conectó un bot de Telegram para registrar movimientos financieros con comandos cortos (`g 50 taxi`, `i 100 adelanto`).
- **Decisión Arquitectónica:** El bot NUNCA escribe directamente en el libro mayor de finanzas. Solo crea elementos `InboxItem` en `finances/bot_inbox.json` (Firebase Storage).
- **Flujo:** Telegram → Webhook protegido (`x-telegram-bot-api-secret-token` + `TELEGRAM_ADMIN_ID`) → `InboxService.appendItem` → Notificación tipo `inbox` → Aprobación manual en `/admin/finanzas` → `FinanceRecord` con `originInboxId`.
- **Mitigación de Riesgo:** Incluso si el bot fuera abusado, los datos quedan en un Inbox moderado. Se requiere aprobación explícita del admin antes de impactar indicadores financieros.

---

*Última actualización: Enero 2026 - Ddreams 3D*
