"use client"

import React, { useState, useEffect } from 'react';
import { Copy, Check, Brain, FileText, ShieldAlert, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { AIRulesConfig } from '@/shared/types/ai-rules';
import { fetchAIRules, saveAIRules } from '@/services/ai-rules.service';
import { getLocalAIRules } from '../../actions/get-local-ai-rules';
import { SectionGuidelines } from '../SectionGuidelines';
import { AIRulesSyncCard } from '../AIRulesSyncCard';

export function AIRulesManager() {
  const [config, setConfig] = useState<AIRulesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [manualContext, setManualContext] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (config?.generalContext) {
      setManualContext(config.generalContext);
    }
  }, [config]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch config from Firestore (metadata)
      const firestoreData = await fetchAIRules();
      
      // 2. Fetch real content from AI_RULES.md (Source of Truth)
      const localRules = await getLocalAIRules();
      
      if (localRules.success && localRules.data) {
        // Merge: Firestore metadata + Local File Content
        setConfig({
            ...firestoreData,
            generalContext: localRules.data.content
        });
      } else {
        // Fallback if file read fails (should not happen if verifyAdminSession works)
        console.warn("Could not read local AI_RULES.md, using Firestore fallback");
        setConfig(firestoreData);
      }

    } catch (error) {
      console.error(error);
      toast.error('Error al cargar las reglas de IA');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!config?.generalContext) return;
    try {
      await navigator.clipboard.writeText(config.generalContext);
      setCopied(true);
      toast.success('Reglas copiadas al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('No se pudo copiar');
    }
  };

  const handleManualSave = async () => {
    if (!config) return;
    try {
      setSaving(true);
      const updatedConfig = {
        ...config,
        generalContext: manualContext,
        lastUpdated: Date.now()
      };
      await saveAIRules(updatedConfig);
      setConfig(updatedConfig);
      setIsEditing(false);
      toast.success('Reglas actualizadas manualmente');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // Extract history section from context
  const getHistoryContent = () => {
    if (!config?.generalContext) return "No hay historial disponible.";
    const historyMarker = "## 📜 HISTORIAL DE SOLUCIONES Y LECCIONES";
    const parts = config.generalContext.split(historyMarker);
    if (parts.length > 1) {
      return historyMarker + parts[1];
    }
    return "No se encontró la sección de historial en AI_RULES.md";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
        <Brain className="w-12 h-12 text-primary/30" />
        <p className="text-muted-foreground">Cargando constitución...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          <Brain className="w-8 h-8 text-purple-600" />
          Constitución de la IA
        </h2>
        <p className="text-muted-foreground text-lg mt-2">
          El contrato innegociable que define cómo la Inteligencia Artificial debe comportarse, programar y proteger el proyecto.
        </p>
      </div>

      <SectionGuidelines 
        title="¿Cómo usar estas Reglas?"
        description="Estas reglas se inyectan en el contexto global de la IA (Cursor, Trae, etc.) para evitar errores y alucinaciones."
        dos={[
          "Usa el botón 'Copiar Reglas' y pégalas en el chat de tu IA al iniciar una sesión.",
          "Sincroniza siempre después de editar 'AI_RULES.md'.",
          "Revisa los 'Riesgos Activos' periódicamente."
        ]}
        donts={[
          "No edites esto manualmente si no es emergencia (Usa el archivo MD).",
          "No borres los 5 Pilares fundamentales.",
          "No añadas reglas que contradigan el Glosario."
        ]}
      />

      {/* SYNC CARD (PRIMARY ACTION) */}
      <AIRulesSyncCard />

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reglas Activas
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Historial de Cambios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          {/* MAIN CONTENT: READ & COPY */}
          <Card className="border-purple-100 dark:border-purple-900/30 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/30">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <FileText className="w-5 h-5" /> 
                  Reglas Activas (Live Context)
                </CardTitle>
                <CardDescription>
                  Este es el texto exacto que rige la IA ahora mismo.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsEditing(!isEditing)} 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isEditing ? 'Cancelar Edición' : 'Editar Manualmente (Emergencia)'}
                </Button>
                <Button 
                  onClick={handleCopy} 
                  className="bg-purple-600 hover:bg-purple-700 text-white min-w-[140px] shadow-md transition-all hover:scale-105"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Reglas
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {isEditing ? (
                <div className="p-4 bg-background animate-in fade-in">
                  <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Advertencia: La edición manual se sobrescribirá si sincronizas desde AI_RULES.md. Úsalo solo para correcciones rápidas.</span>
                  </div>
                  <Textarea 
                    value={manualContext}
                    onChange={(e) => setManualContext(e.target.value)}
                    className="min-h-[500px] font-mono text-sm leading-relaxed p-6"
                    placeholder="# Escribe las reglas en Markdown..."
                  />
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleManualSave} disabled={saving}>
                      {saving ? 'Guardando...' : 'Guardar Cambios Manuales'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" onClick={handleCopy} className="h-8 w-8 shadow-sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="p-6 min-h-[400px] max-h-[700px] overflow-y-auto bg-slate-50 dark:bg-slate-950 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-300">
                    {config?.generalContext || "No hay reglas definidas. Sincroniza AI_RULES.md para comenzar."}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card className="border-blue-100 dark:border-blue-900/30 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-blue-50/50 dark:bg-blue-900/10">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <History className="w-5 h-5" /> 
                  Historial de Cambios y Lecciones
                </CardTitle>
                <CardDescription>
                  Registro de riesgos mitigados y soluciones implementadas para evitar regresiones.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="p-6 min-h-[400px] max-h-[700px] overflow-y-auto bg-slate-50 dark:bg-slate-950 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-400">
                {getHistoryContent()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
