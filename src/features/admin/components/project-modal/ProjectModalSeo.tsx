import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StringListEditor } from '../AdminEditors';
import { motion } from 'framer-motion';
import { PortfolioItem } from '@/shared/types/domain';
import { AlertTriangle } from 'lucide-react';

interface ProjectModalSeoProps {
  formData: Partial<PortfolioItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<PortfolioItem>>>;
  slugEditable: boolean;
  setSlugEditable: (editable: boolean) => void;
}

export const ProjectModalSeo: React.FC<ProjectModalSeoProps> = ({
  formData,
  setFormData,
  slugEditable,
  setSlugEditable
}) => {
  return (
    <motion.div key="seo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="rounded-3xl shadow-sm border-0 bg-card">
            <CardHeader>
                <CardTitle>SEO & Metadatos</CardTitle>
                <CardDescription>Optimización para motores de búsqueda y organización</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Slug URL</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={formData.slug || ''}
                            disabled={!slugEditable}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            className="flex-1 p-3 bg-muted rounded-xl border-none disabled:opacity-50 font-mono text-sm"
                        />
                        <Button variant={slugEditable ? "destructive" : "outline"} onClick={() => setSlugEditable(!slugEditable)}>
                            {slugEditable ? 'Bloquear' : 'Editar'}
                        </Button>
                    </div>
                    {slugEditable && (
                        <div className="flex items-start gap-3 p-3 mt-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800/50 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <div className="space-y-1">
                                <p className="font-semibold">¡Atención!</p>
                                <p className="opacity-90 leading-relaxed">
                                    Modificar el slug cambiará la URL permanente del proyecto. Esto romperá los enlaces compartidos anteriormente y afectará el posicionamiento en Google.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Etiquetas (Tags)</label>
                    <StringListEditor 
                        items={formData.tags || []}
                        onChange={(k) => setFormData(prev => ({ ...prev, tags: k }))}
                        placeholder="Ej. impresión 3d, medicina, prototipo"
                    />
                </div>
            </CardContent>
        </Card>
    </motion.div>
  );
};
