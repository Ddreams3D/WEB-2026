'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileWarning, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getLocalAIRules } from '../actions/get-local-ai-rules';
import { saveAIRules, fetchAIRules } from '@/services/ai-rules.service';

export function AIRulesSyncCard() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      // 1. Read local file from server
      const result = await getLocalAIRules();
      
      if (!result.success) {
        throw new Error(result.error || 'No se pudo leer el archivo AI_RULES.md');
      }

      if (!result.data?.content) {
        throw new Error('El archivo AI_RULES.md está vacío o no se pudo leer');
      }

      // 2. Fetch current rules to preserve terms
      const currentRules = await fetchAIRules();
      
      // 3. Save to Firestore with updated context
      await saveAIRules({
        ...currentRules,
        lastUpdated: Date.now(),
        generalContext: result.data.content
      });

      toast.success('Reglas sincronizadas correctamente', {
        description: 'El contenido de AI_RULES.md se ha subido a Firestore. Recargando...'
      });

      // Force reload to show new content
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error('Error al sincronizar', {
        description: 'No se pudieron actualizar las reglas. Revisa la consola.'
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                <FileWarning className="w-5 h-5" />
             </div>
             <CardTitle className="text-lg text-orange-700 dark:text-orange-400">
               Fuente de Verdad IA
             </CardTitle>
          </div>
          <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-100/50">
            Crítico
          </Badge>
        </div>
        <CardDescription className="text-orange-600/80 dark:text-orange-400/80 mt-1">
          Firestore Config
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          ¡Ojo! El archivo <strong>'AI_RULES.md'</strong> es solo papel. La IA real lee sus reglas de la base de datos (Firestore). 
          Si editas el archivo de texto, debes sincronizarlo aquí para que la IA se entere.
        </p>
        
        <Button 
          onClick={handleSync} 
          disabled={syncing}
          variant="outline"
          className="w-full border-orange-200 hover:bg-orange-100 hover:text-orange-700 dark:border-orange-800 dark:hover:bg-orange-900/50"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar AI_RULES.md a Firestore
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
