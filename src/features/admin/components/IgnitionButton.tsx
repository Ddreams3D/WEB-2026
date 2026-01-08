'use client';

import React, { useState } from 'react';
import { Power, Copy, Check, Terminal, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui';

const IGNITION_PROMPT = `# 🚀 INICIALIZACIÓN DE SISTEMA Y CARGA DE CONTEXTO

Estás reactivando la sesión de desarrollo para **Ddreams 3D**. Antes de responder a cualquier solicitud, DEBES ejecutar las siguientes acciones de lectura para alinear tu estado interno con la realidad del proyecto:

> **⚠️ PROHIBICIÓN EXPLÍCITA:**
> Si algún archivo solicitado no existe, no es accesible o su contenido no está claro, **DEBES REPORTARLO INMEDIATAMENTE**.
> **NO ASUMAS CONTENIDO.** Es preferible detener el proceso a trabajar con información imaginaria.

## 1. 📖 LEER LA CONSTITUCIÓN (ADN y Reglas)
> **Acción Obligatoria:** Lee el archivo \`AI_RULES.md\`.
- Este documento es la LEY SUPREMA. Contiene los **5 Pilares de Estabilidad**, los riesgos activos y el historial de soluciones.
- **CRÍTICO:** Ignorar estas reglas (especialmente la separación Cliente/Servidor y validación Zod) corromperá el proyecto.

## 2. 🧠 LEER EL GLOSARIO (La Verdad del Negocio)
> **Acción Obligatoria:** Lee el archivo \`src/services/glossary.service.ts\`.
- Define el "Lenguaje Ubicuo" del negocio.
- **Restricción:** Debes entender la diferencia exacta entre "Web Principal", "Landing Satélite", "Tema" y "Campaña". No inventes términos; usa los definidos aquí.

## 3. 🏗️ LEER EL MAPA VISUAL
> **Acción Obligatoria:** Lee \`src/features/admin/settings/components/ArchitectureSettings.tsx\`.
- Este archivo renderiza la sección "ADN del Proyecto" en el admin y refleja el stack técnico actual y las integraciones activas.

## 4. 🛠️ LEER EL LENGUAJE TÉCNICO
> **Acción Obligatoria:** Escanea \`package.json\` y \`tsconfig.json\`.
- **Stack:** Next.js 16 (App Router), React 19, TypeScript (Estricto), Tailwind CSS, Firebase (Firestore/Auth).
- **Estilo:** Server Actions para mutaciones (escritura), Client Components para interactividad (lectura).

## 5. ⚡ CAPACIDADES ACTIVAS (Environment Check)
> **Acción Obligatoria:** Lee \`.env.example\` (NUNCA leas .env.local).
- Verifica qué servicios externos están habilitados (Resend, Stripe, Firebase, etc.) antes de sugerir código que dependa de ellos.

## 6. 🎨 SISTEMA DE DISEÑO (Visual Language)
> **Acción Obligatoria:** Escanea \`src/components/ui/index.ts\` y \`tailwind.config.ts\`.
- Antes de crear un componente nuevo, verifica si ya existe uno reutilizable en el UI Kit.

---

**🛑 PROTOCOLO DE CONFIRMACIÓN:**
1.  Confirma explícitamente que has leído estos 6 archivos.
2.  Reporta el estado actual de "Riesgos Activos" según \`AI_RULES.md\`.
3.  Confirma que entiendes la regla del "Puente Híbrido" (Cliente lee / Servidor escribe).
4.  Espera instrucciones.`;

const SHUTDOWN_PROMPT = `# 🛑 PROTOCOLO DE CIERRE DE SESIÓN Y ACTUALIZACIÓN DE ADN

La sesión de desarrollo termina. Tu objetivo es dejar el proyecto en estado “verdadero”.
PROHIBIDO inventar: si no tienes evidencia, marca “INCIERTO”.

## 0) Alcance (obligatorio)
Indica qué evidencia tienes para auditar:
- ¿Tuviste acceso a git diff / lista de archivos tocados / consola?
Si NO, pide exactamente una de estas dos cosas:
A) lista de archivos modificados, o
B) output de \`git diff\`.

## 1) 🕵️ AUDITORÍA DE CAMBIOS
Con base en la evidencia:
- ¿Cambió estructura de carpetas?
- ¿Se añadió/quitó librería o script?
- ¿Apareció riesgo/bug crítico nuevo?
- ¿Apareció término nuevo de negocio?

## 2) 🧹 LIMPIEZA DE CÓDIGO
- \`console.log\` / TODO / FIXME: lista archivo + línea aproximada
- imports no usados: lista archivo + import

## 3) 🧪 VERIFICACIÓN DE ESTABILIDAD
- Estado TypeScript: OK / ERROR / INCIERTO
- Warnings relevantes: lista breve (si existen)

## 4) 📝 ACTUALIZACIÓN DE LA VERDAD (ADN)
Si en (1) hubo cambios estructurales o de reglas:
Entrega patches listos para copiar/pegar con este formato:

- Documento:
- Sección destino:
- Texto final:

Documentos:
A) AI_RULES.md (Riesgos activos / historial)
B) ArchitectureSettings.tsx (Mapa visual)
C) glossary.service.ts (Términos nuevos)

Si NO aplica, escribe: “ADN no requiere cambios.”

## 5) 📋 BITÁCORA
- Logros de hoy:
- Pendientes (máx 5):
- Próximo paso recomendado (1):

## ✅ CHECKLIST FINAL
- [ ] Auditoría completa
- [ ] Limpieza reportada
- [ ] Health check reportado
- [ ] ADN actualizado o declarado “no requiere”`;

export function IgnitionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIgnition, setCopiedIgnition] = useState(false);
  const [copiedShutdown, setCopiedShutdown] = useState(false);
  const [activeTab, setActiveTab] = useState("ignition");

  const handleCopy = async (text: string, isIgnition: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isIgnition) {
        setCopiedIgnition(true);
        setTimeout(() => setCopiedIgnition(false), 2000);
      } else {
        setCopiedShutdown(true);
        setTimeout(() => setCopiedShutdown(false), 2000);
      }
      toast.success('Protocolo copiado al portapapeles');
    } catch (err) {
      toast.error('Error al copiar el texto');
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex gap-2 text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40 shadow-sm transition-all"
        >
          <Power className="w-4 h-4" />
          <span className="hidden sm:inline">IA: Inicio / Cierre</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[95vw] sm:w-[500px] md:w-[600px] p-0 overflow-hidden border-primary/20 shadow-2xl !left-1/2 !-translate-x-1/2" align="center" sideOffset={16}>
        
        <Tabs defaultValue="ignition" className="flex flex-col w-full" onValueChange={setActiveTab}>
          {/* Header Compacto */}
          <div className="bg-muted/30 border-b border-border p-0">
            <div className="flex items-center justify-between p-4 px-6">
               <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg shadow-sm transition-colors",
                    activeTab === 'ignition' ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                  )}>
                    {activeTab === 'ignition' ? <Power className="w-5 h-5" /> : <LogOut className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">Centro de Control</h2>
                    <p className="text-xs text-muted-foreground">Sincronización manual del contexto de IA</p>
                  </div>
               </div>
            </div>
            
            <div className="px-6 pb-0">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-10">
                <TabsTrigger value="ignition" className="text-xs data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Inicio de Sesión
                </TabsTrigger>
                <TabsTrigger value="shutdown" className="text-xs data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive data-[state=active]:shadow-sm">
                  Cierre de Sesión
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL: Tarjeta de Acción */}
          <div className="p-6 md:p-8 bg-background flex flex-col items-center justify-center text-center space-y-6">
            
            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-bold">
                {activeTab === 'ignition' ? '🚀 Iniciar Protocolo' : '🛑 Cerrar Protocolo'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'ignition' 
                  ? 'Copia este comando y pégalo en el chat de tu IA para alinearla con el proyecto.' 
                  : 'Genera el reporte de cierre para actualizar la documentación y evitar pérdida de datos.'}
              </p>
            </div>

            {/* BOTÓN GIGANTE DE ACCIÓN */}
            <Button 
              onClick={() => handleCopy(activeTab === 'ignition' ? IGNITION_PROMPT : SHUTDOWN_PROMPT, activeTab === 'ignition')} 
              className={cn(
                "h-16 px-8 text-lg rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 w-full sm:w-auto",
                activeTab === 'ignition' 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25" 
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/25"
              )}
            >
              {((activeTab === 'ignition' && copiedIgnition) || (activeTab === 'shutdown' && copiedShutdown)) 
                ? <><Check className="w-6 h-6 mr-3" /> ¡Copiado!</> 
                : <><Copy className="w-6 h-6 mr-3" /> Copiar al Portapapeles</>
              }
            </Button>

            <div className="text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Listo para pegar en Trae / VS Code
            </div>

          </div>

          {/* PREVISUALIZACIÓN COLAPSIBLE (Acordeón simplificado) */}
          <div className="border-t bg-muted/10">
             <details className="group">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/20 transition-colors">
                   <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground group-hover:text-foreground">
                      <Terminal className="w-4 h-4" />
                      Ver contenido del prompt (Solo lectura)
                   </div>
                   <div className="text-[10px] text-muted-foreground/50 uppercase tracking-widest group-open:hidden">Mostrar</div>
                   <div className="text-[10px] text-muted-foreground/50 uppercase tracking-widest hidden group-open:block">Ocultar</div>
                </summary>
                <div className="px-4 pb-4 h-48 border-t border-border/50">
                  <ScrollArea className="h-full mt-2 rounded-md border bg-zinc-950 p-4">
                    <pre className="text-[10px] leading-relaxed text-zinc-400 whitespace-pre-wrap font-mono">
                      {activeTab === 'ignition' ? IGNITION_PROMPT : SHUTDOWN_PROMPT}
                    </pre>
                  </ScrollArea>
                </div>
             </details>
          </div>

        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
