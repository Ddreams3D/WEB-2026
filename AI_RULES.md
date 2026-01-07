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

## 🚨 RIESGOS ACTIVOS Y MITIGACIÓN (Live Check)

### A. Riesgo de "Explosión de Factura" (Spam)
- **Estado:** ⚠️ PARCIALMENTE MITIGADO
- **Amenaza:** Ataques de bots a formularios públicos (Firebase Writes).
- **Mitigación Requerida:** Rate Limiting en Server Actions o reCAPTCHA.

### B. Riesgo del "Botón de la Muerte" (Data Loss)
- **Estado:** 🔴 ALTO RIESGO
- **Amenaza:** Borrado accidental de datos críticos (Admin Delete).
- **Mitigación Requerida:** Implementar "Soft Delete" (`deleted: true`) en lugar de destrucción física.

### C. Riesgo de "Silencio Administrativo"
- **Estado:** ⚠️ MEDIO
- **Amenaza:** Fallos en Server Actions (Emails, Pagos) que no se reportan al cliente.
- **Mitigación Requerida:** Logger de servidor (Sentry o colección `system_logs`).

---

*Última actualización: Enero 2026 - Ddreams 3D*
