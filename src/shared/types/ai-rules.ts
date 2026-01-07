export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'general' | 'technical' | 'business' | 'ui' | 'marketing';
  lastUpdated: number;
}

export interface AIRulesConfig {
  lastUpdated: number;
  generalContext: string; // Markdown content for global rules/context
  terms: GlossaryTerm[];
}

export const DEFAULT_AI_RULES: AIRulesConfig = {
  lastUpdated: Date.now(),
  generalContext: `# CONSTITUCIÓN DEL PROYECTO (AI RULES)

> **META-INSTRUCCIÓN:** Este documento es la LEY SUPREMA para cualquier Agente de IA (Cursor, Trae, Windsurf, etc.) que modifique este código. Ignorar estas reglas conlleva inestabilidad técnica.

## 🏛️ LOS 5 PILARES DE ESTABILIDAD

### 1. Pilar de Integridad Arquitectónica (La Ley Física)
**Riesgo:** La IA tiende a inventar soluciones "fáciles" que rompen la separación Cliente/Servidor.
**REGLA:** *"Respeto Absoluto al Puente Híbrido"*
- **Lecturas:** SIEMPRE vía Firebase Client SDK (\`useFirestore\`, \`getDoc\`) en componentes \`use client\`.
- **Escrituras:** SIEMPRE vía Server Actions (\`'use server'\`) para lógica de negocio crítica o admin.
- **Prohibido:** Importar \`firebase-admin\` en componentes de cliente o exponer \`process.env\` secretos al navegador.

### 2. Pilar de Coherencia Visual (La Ley del Vocabulario)
**Riesgo:** Fragmentación de UI. La IA crea componentes duplicados (ej. \`NewButton\` vs \`Button\`).
**REGLA:** *"Mandato de Reutilización"*
- **Vocabulario:** Consulta \`src/services/prompt-vocabulary.service.ts\` ANTES de escribir UI.
- **Componentes:** Si existe en \`src/components/ui\`, ÚSALO.
- **Estilos:** Prohibido \`style={{}}\` (inline styles). Usa Tailwind CSS + \`cn()\`.
- **Iconos:** Usa \`lucide-react\` exclusivamente.

### 3. Pilar de Verdad del Negocio (La Ley del Glosario)
**Riesgo:** La IA inventa términos (ej. llama "Cart" al "Trolley") rompiendo la comunicación.
**REGLA:** *"Supremacía del Glosario"*
- **Definiciones:** Si no está en \`src/services/glossary.service.ts\`, NO EXISTE.
- **Nuevos Términos:** Si necesitas un término nuevo, agrégalo al Glosario primero.

### 4. Pilar de Seguridad y Orden (La Ley Marcial)
**Riesgo:** Datos sucios y "any" types corrompen la base de datos.
**REGLA:** *"Tipado Estricto"*
- **Validación:** Todo input de usuario DEBE pasar por Zod schemas (\`src/lib/validators\`).
- **Types:** Prohibido \`any\`. Define interfaces en \`src/shared/types\`.

### 5. Pilar de Escalabilidad y Mantenimiento (La Ley del Futuro)
**Riesgo:** El proyecto funciona hoy, pero es immantenible en 6 meses.
**REGLA:** *"Documentación Viva y Auditoría"*
- **Sincronización:** Si cambias la lógica de una Feature, ACTUALIZA \`ArchitectureSettings.tsx\`. No dejes que la documentación mienta.
- **Complejidad:** Prefiere código aburrido y legible sobre "trucos" inteligentes de una sola línea.
- **Riesgos:** Revisa siempre la sección "Riesgos y Mitigación" en Arquitectura antes de desplegar cambios críticos.

## ⚠️ RIESGOS ACTIVOS (DEUDA TÉCNICA)
1. **Explosión de Factura:** Formularios públicos sin captcha. (Mitigar con Rate Limiting).
2. **Botón de la Muerte:** Borrado físico en BD. (Implementar Soft Delete pronto).
3. **Silencio Administrativo:** Errores de Server Actions no logueados. (Revisar logs de servidor).`,
  terms: [
    {
      id: 'term_seasonal_theme',
      term: 'SeasonalThemeConfig',
      definition: 'Configuración que define la apariencia y comportamiento del sitio durante una temporada específica (ej. Navidad, Halloween). Controla colores, efectos y assets.',
      category: 'technical',
      lastUpdated: Date.now()
    },
    {
      id: 'term_unified_landing',
      term: 'UnifiedLandingData',
      definition: 'Estructura de datos normalizada para las landing pages de servicios. Permite que el editor universal maneje cualquier servicio de forma genérica.',
      category: 'technical',
      lastUpdated: Date.now()
    }
  ]
};
