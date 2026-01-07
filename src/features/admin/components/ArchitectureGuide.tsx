import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Database, 
  Layout, 
  ShieldCheck, 
  Globe, 
  Layers, 
  Zap, 
  Server, 
  FileImage,
  Brain,
  MessageSquare,
  BookOpen
} from 'lucide-react';

export function ArchitectureGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Arquitectura del Proyecto">
          <Cpu className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Cpu className="w-8 h-8 text-primary" />
            ADN del Proyecto
          </DialogTitle>
          <DialogDescription className="text-lg">
            Entiende cómo funciona tu web por dentro sin tocar código.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="frontend" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="frontend" className="flex flex-col gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                <Layout className="w-5 h-5" />
                <span className="text-xs font-medium">La Cara (Frontend)</span>
              </TabsTrigger>
              <TabsTrigger value="backend" className="flex flex-col gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                <Database className="w-5 h-5" />
                <span className="text-xs font-medium">El Cerebro (Backend)</span>
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="flex flex-col gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                <Brain className="w-5 h-5" />
                <span className="text-xs font-medium">La Inteligencia (IA)</span>
              </TabsTrigger>
              <TabsTrigger value="style" className="flex flex-col gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                <Layers className="w-5 h-5" />
                <span className="text-xs font-medium">El Estilo (UI/UX)</span>
              </TabsTrigger>
              <TabsTrigger value="infra" className="flex flex-col gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium">Infraestructura</span>
              </TabsTrigger>
            </TabsList>

            {/* FRONTEND TAB */}
            <TabsContent value="frontend" className="mt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Next.js (App Router)
                    </CardTitle>
                    <CardDescription>El motor principal de tu web.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Tu web no es una página "estática" antigua. Usa <strong>Next.js 14</strong>, una tecnología moderna que permite:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li><strong>Velocidad:</strong> Carga solo lo necesario para cada página.</li>
                      <li><strong>SEO:</strong> Google puede leer tu contenido fácilmente.</li>
                      <li><strong>Rutas Inteligentes:</strong> La carpeta <code>src/app</code> define tus URLs automáticamente.</li>
                    </ul>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Tecnología: React Framework</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="w-5 h-5 text-blue-500" />
                      React Components
                    </CardTitle>
                    <CardDescription>Piezas de LEGO digitales.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Tu web está construida con "Componentes". En lugar de escribir todo en un solo archivo gigante, dividimos la web en piezas reutilizables:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Botones</Badge>
                      <Badge variant="secondary">Tarjetas</Badge>
                      <Badge variant="secondary">Formularios</Badge>
                      <Badge variant="secondary">Navegación</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Si cambias un botón en el código, ¡se actualiza en toda la web automáticamente!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* INTELLIGENCE TAB */}
            <TabsContent value="intelligence" className="mt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-500" />
                      Lenguaje del Proyecto
                    </CardTitle>
                    <CardDescription>El diccionario de tu marca.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      No es solo una lista de palabras. Es un <strong>Contexto Inyectado</strong>.
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li><strong>Funcionamiento:</strong> Antes de que la IA escriba nada, el sistema lee tu vocabulario aprobado.</li>
                      <li><strong>Traducción Automática:</strong> Si tú escribes "cliente", pero tu lenguaje dice que debes usar "Aliado", la IA lo corregirá internamente.</li>
                      <li><strong>Ubicación:</strong> Se guarda en Firestore y se carga en milisegundos cada vez que generas un prompt.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-amber-500" />
                      Reglas de IA
                    </CardTitle>
                    <CardDescription>Las leyes de la robótica de tu web.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Son directrices de comportamiento que la IA <strong>no puede ignorar</strong>.
                    </p>
                    <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-2">
                      <p><strong>El Flujo Secreto:</strong></p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Tú pides: "Crea un post sobre zapatos".</li>
                        <li>El sistema busca tus reglas (ej: "Tono formal", "No usar emojis").</li>
                        <li>El sistema combina: Tu pedido + Reglas + Vocabulario.</li>
                        <li>La IA recibe el paquete completo y genera el resultado perfecto.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* BACKEND TAB */}
            <TabsContent value="backend" className="mt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-orange-500" />
                      Firebase Firestore
                    </CardTitle>
                    <CardDescription>Tu base de datos en la nube.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      No usas un servidor tradicional. Usas <strong>Firestore</strong> de Google.
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li><strong>NoSQL:</strong> Los datos se guardan como "Documentos" (parecidos a JSON), no en tablas rígidas de Excel.</li>
                      <li><strong>Tiempo Real:</strong> Si cambias algo en el admin, los usuarios lo ven casi al instante.</li>
                      <li><strong>Escalable:</strong> Crece automáticamente si tienes mil o un millón de usuarios.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                      Autenticación y Seguridad
                    </CardTitle>
                    <CardDescription>¿Quién puede entrar?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      El sistema de login (Google/Email) es gestionado por <strong>Firebase Auth</strong>.
                    </p>
                    <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Tu Rol:</span>
                        <span className="font-bold text-primary">Admin / SuperAdmin</span>
                      </div>
                      <p>
                        El código verifica tu rol antes de dejarte ver este panel. Incluso si alguien adivina la URL, la base de datos rechazará su petición si no tiene permiso.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* STYLE TAB */}
            <TabsContent value="style" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-500" />
                    Tailwind CSS + Shadcn/UI
                  </CardTitle>
                  <CardDescription>El maquillaje y la ropa de tu web.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Tailwind CSS (Utilidades)</h4>
                    <p className="text-sm text-muted-foreground">
                      En lugar de escribir archivos CSS gigantes (`style.css`), usamos clases pequeñas directamente en el HTML.
                      Ejemplo: <code>text-red-500</code> hace el texto rojo. Esto hace que el desarrollo sea rapidísimo.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Shadcn/UI (Componentes Base)</h4>
                    <p className="text-sm text-muted-foreground">
                      Usamos una librería de diseño profesional. Tus botones, diálogos y tarjetas vienen pre-diseñados para ser accesibles (funcionan con teclado y lectores de pantalla) y bonitos por defecto.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* INFRA TAB */}
            <TabsContent value="infra" className="mt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="w-5 h-5 text-indigo-500" />
                      Serverless (Sin Servidor)
                    </CardTitle>
                    <CardDescription>Olvídate de mantener servidores.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Tu web vive en la "nube". No hay una computadora física que tengas que reiniciar.
                      Cuando un usuario entra, la nube "despierta" los recursos necesarios para atenderlo y luego se duerme. Esto ahorra muchísimo dinero y energía.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileImage className="w-5 h-5 text-pink-500" />
                      Storage (Assets)
                    </CardTitle>
                    <CardDescription>Donde viven tus fotos.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Las imágenes de tus productos no están en la base de datos (sería muy lento).
                      Están en <strong>Firebase Storage</strong>, un disco duro gigante en la nube optimizado para entregar imágenes rápido a cualquier parte del mundo.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
