import Link from 'next/link';
import { getSeasonalThemes, isDateInRange } from '@/lib/seasonal-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Power, AlertCircle } from 'lucide-react';

export default async function AdminCampaignsPage() {
  const themes = await getSeasonalThemes();
  const now = new Date();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Campañas</h1>
          <p className="text-muted-foreground">
            Administra y previsualiza las landing pages estacionales.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {themes.map((theme) => {
          const isActiveManual = theme.isActive === true;
          const isActiveDate = theme.dateRanges.some(range => 
            isDateInRange(now, range.start, range.end)
          );
          const isActive = isActiveManual || isActiveDate;

          return (
            <Card key={theme.id} className="overflow-hidden flex flex-col">
              {/* Image Header */}
              <div className="aspect-video w-full relative overflow-hidden bg-muted group">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                    src={theme.landing.heroImage} 
                    alt={theme.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute top-2 right-2 flex gap-2">
                    {isActiveManual && (
                        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 shadow-sm">
                            Manual
                        </Badge>
                    )}
                    <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500 hover:bg-green-600 shadow-sm" : "bg-black/50 backdrop-blur-sm text-white border-none"}>
                        {isActive ? "Activa" : "Inactiva"}
                    </Badge>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium line-clamp-2">{theme.landing.heroTitle}</p>
                 </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start gap-2">
                    <span className="truncate">{theme.name}</span>
                </CardTitle>
                <CardDescription className="font-mono text-xs">/{theme.id}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 text-sm flex-1">
                    <div className="flex items-center text-muted-foreground bg-muted/30 p-2 rounded-md">
                        <Power className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium">Modo: </span>
                        <span className={theme.isActive ? "text-blue-500 font-bold ml-auto" : "text-muted-foreground ml-auto"}>
                            {theme.isActive ? "Forzado Activo" : "Automático"}
                        </span>
                    </div>
                    
                    <div className="bg-muted/30 p-2 rounded-md">
                        <div className="flex items-center text-muted-foreground mb-2">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-medium">Calendario:</span>
                        </div>
                        <div className="space-y-1">
                            {theme.dateRanges.map((range, idx) => (
                                <div key={idx} className="pl-6 text-xs text-muted-foreground flex justify-between">
                                    <span>Inicio: {range.start.day}/{range.start.month}</span>
                                    <span>Fin: {range.end.day}/{range.end.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-2 mt-auto">
                    <Button asChild variant="default" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:to-primary shadow-md hover:shadow-lg transition-all">
                        <Link href={`/campanas/${theme.id}?preview=true`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Landing Page
                        </Link>
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                        * El modo vista previa ignora las fechas
                    </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {/* Info Card */}
        <Card className="border-dashed bg-muted/20 flex flex-col justify-center items-center p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">¿Necesitas más campañas?</h3>
                <p className="text-sm text-muted-foreground">
                    Las campañas se configuran en el archivo de temas estacionales. 
                    Próximamente podrás crearlas desde aquí.
                </p>
            </div>
        </Card>
      </div>
    </div>
  );
}
