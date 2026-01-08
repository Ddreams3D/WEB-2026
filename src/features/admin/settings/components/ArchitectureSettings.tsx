import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { 
  Cpu, Database, BrainCircuit, ShieldAlert, Network, History, Ghost
} from 'lucide-react';
import { 
  TabHeader, TechHero, SectionGroup, 
  TechCard, TechFeature, TechPill, HistoryItem, NavTab
} from './architecture/ArchitectureUI';

// --- SUB-COMPONENTS FOR CLEANER CODE ---

import { 
  FRONTEND_DATA, BACKEND_DATA, INTELLIGENCE_DATA, 
  GUARDIANS_DATA, INFRA_DATA, INVISIBLE_DATA, HISTORY_DATA 
} from './architecture/architecture.data';

export function ArchitectureSettings() {
  return (
    <Card className="shadow-lg border-none bg-background/50 backdrop-blur-sm">
      <CardHeader className="border-b bg-muted/20 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              ADN del Proyecto
            </CardTitle>
            <CardDescription className="text-base">
              Mapa vivo de la arquitectura técnica, herramientas y decisiones críticas de Ddreams 3D.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="frontend" className="w-full">
          
          {/* TOP NAVIGATION BAR */}
          <div className="border-b px-6 py-2 bg-muted/5 overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-xl gap-1">
              <NavTab value="frontend" icon={Cpu} label="Frontend" />
              <NavTab value="backend" icon={Database} label="Backend" />
              <div className="w-px h-8 bg-border mx-1 self-center hidden md:block" />
              <NavTab value="intelligence" icon={BrainCircuit} label="Inteligencia" />
              <div className="w-px h-8 bg-border mx-1 self-center hidden md:block" />
              <NavTab value="guardians" icon={ShieldAlert} label="Seguridad" />
              <NavTab value="infra" icon={Network} label="Infra" />
              <div className="w-px h-8 bg-border mx-1 self-center hidden md:block" />
              <NavTab value="invisibles" icon={Ghost} label="Utils" />
              <NavTab value="history" icon={History} label="Bitácora" />
            </TabsList>
          </div>

          {/* CONTENT AREA */}
          <div className="p-6 md:p-8 bg-card/30 min-h-[500px]">
            
            {/* FRONTEND TAB */}
            <TabsContent value="frontend" className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300">
              <TabHeader 
                icon={Cpu} 
                title="Frontend Architecture" 
                desc="La cara visible. Velocidad, estética y experiencia de usuario."
                color="blue"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {FRONTEND_DATA.hero.map((item, i) => (
                  <TechHero key={i} {...item} />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SectionGroup title="Experiencia & Animación">
                  <div className="space-y-3">
                    {FRONTEND_DATA.experience.map((item, i) => (
                      <TechCard key={i} {...item} />
                    ))}
                  </div>
                </SectionGroup>

                <SectionGroup title="Features Arquitectónicas">
                  <div className="space-y-3">
                    {FRONTEND_DATA.features.map((item, i) => (
                      <TechFeature key={i} {...item} />
                    ))}
                  </div>
                </SectionGroup>
              </div>
            </TabsContent>

            {/* BACKEND TAB */}
            <TabsContent value="backend" className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300">
              <TabHeader 
                icon={Database} 
                title="Backend Ecosystem" 
                desc="El motor persistente. Datos, autenticación y lógica de servidor."
                color="amber"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {BACKEND_DATA.hero.map((item, i) => (
                  <TechHero key={i} {...item} />
                ))}
              </div>

              <SectionGroup title="Servicios Conectados">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BACKEND_DATA.ecosystem.map((item, i) => (
                    <TechCard key={i} {...item} />
                  ))}
                </div>
              </SectionGroup>
            </TabsContent>

            {/* INTELLIGENCE TAB */}
            <TabsContent value="intelligence" className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300">
              <TabHeader 
                icon={BrainCircuit} 
                title="Inteligencia Artificial" 
                desc="El cerebro detrás del código. Contexto, reglas y autoconsciencia."
                color="purple"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {INTELLIGENCE_DATA.hero.map((item, i) => (
                  <TechHero key={i} {...item} />
                ))}
              </div>

              <SectionGroup title="Herramientas de Contexto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {INTELLIGENCE_DATA.tools.map((item, i) => (
                    <TechCard key={i} {...item} />
                  ))}
                </div>
              </SectionGroup>
            </TabsContent>

            {/* GUARDIANS TAB */}
            <TabsContent value="guardians" className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300">
              <TabHeader 
                icon={ShieldAlert} 
                title="Guardianes del Código" 
                desc="Sistemas de defensa. Testing, validación y monitoreo de salud."
                color="emerald"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {GUARDIANS_DATA.hero.map((item, i) => (
                  <TechHero key={i} {...item} />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SectionGroup title="Policía de Datos">
                  <div className="space-y-3">
                    {GUARDIANS_DATA.tools.map((item, i) => (
                      <TechCard key={i} {...item} />
                    ))}
                  </div>
                </SectionGroup>

                <SectionGroup title="Salud del Sistema">
                  <div className="grid grid-cols-2 gap-3">
                    {GUARDIANS_DATA.health.map((item, i) => (
                      <TechPill key={i} {...item} />
                    ))}
                  </div>
                </SectionGroup>
              </div>
            </TabsContent>

            {/* INFRA TAB */}
            <TabsContent value="infra" className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300">
              <TabHeader 
                icon={Network} 
                title="Infraestructura Global" 
                desc="Donde vive el código. Hosting, distribución y analítica."
                color="indigo"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {INFRA_DATA.hero.map((item, i) => (
                  <TechHero key={i} {...item} />
                ))}
              </div>

              <SectionGroup title="Herramientas de Operación">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INFRA_DATA.tools.map((item, i) => (
                    <TechCard key={i} {...item} />
                  ))}
                </div>
              </SectionGroup>
            </TabsContent>

            {/* INVISIBLES TAB */}
            <TabsContent value="invisibles" className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300">
              <TabHeader 
                icon={Ghost} 
                title="Tecnología Invisible" 
                desc="Librerías utilitarias que hacen que todo funcione sin ser vistas."
                color="slate"
              />
              <SectionGroup title="Utilidades Core">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {INVISIBLE_DATA.utils.map((item, i) => (
                    <TechPill key={i} {...item} />
                  ))}
                </div>
              </SectionGroup>
            </TabsContent>

            {/* HISTORY TAB */}
            <TabsContent value="history" className="mt-0 animate-in fade-in-50 slide-in-from-left-2 duration-300">
              <TabHeader 
                icon={History} 
                title="Bitácora de Arquitectura" 
                desc="Historial de decisiones técnicas de alto impacto y correcciones."
                color="red"
              />
              <Card className="border-l-4 border-l-red-500 bg-red-50/10">
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {HISTORY_DATA.map((item, i) => (
                      <HistoryItem key={i} {...item} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
