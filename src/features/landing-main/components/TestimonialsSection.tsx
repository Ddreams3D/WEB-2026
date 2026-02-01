import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">Clientes Felices en Lima</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Card className="bg-background border-none shadow-lg">
             <CardContent className="p-8">
               <div className="flex gap-1 mb-4">
                 {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
               </div>
               <p className="text-muted-foreground mb-6 italic">&quot;Necesitaba un repuesto para mi lavadora que ya no vendían. Me lo diseñaron e imprimieron en 2 días. Quedó perfecto y me ahorré comprar una nueva.&quot;</p>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center font-bold text-white">JP</div>
                 <div>
                   <p className="font-bold text-sm">Juan Pérez</p>
                   <p className="text-xs text-muted-foreground">Miraflores</p>
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card className="bg-background border-none shadow-lg md:-translate-y-4">
             <CardContent className="p-8">
               <div className="flex gap-1 mb-4">
                 {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
               </div>
               <p className="text-muted-foreground mb-6 italic">&quot;Los llaveros personalizados para mi empresa quedaron increíbles. Muy buena definición y el material se siente súper resistente. 100% recomendados.&quot;</p>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center font-bold text-white">MA</div>
                 <div>
                   <p className="font-bold text-sm">María Alejandra</p>
                   <p className="text-xs text-muted-foreground">San Isidro</p>
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card className="bg-background border-none shadow-lg">
             <CardContent className="p-8">
               <div className="flex gap-1 mb-4">
                 {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
               </div>
               <p className="text-muted-foreground mb-6 italic">&quot;Excelente servicio para prototipado de arquitectura. La maqueta salió con un detalle impresionante. Muy profesionales.&quot;</p>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center font-bold text-white">CR</div>
                 <div>
                   <p className="font-bold text-sm">Carlos R.</p>
                   <p className="text-xs text-muted-foreground">La Molina</p>
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </section>
  );
};
