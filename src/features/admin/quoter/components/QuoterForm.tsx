'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FinanceSettings } from '../../finances/types';
import { Clock, Scale, User, DollarSign, AlertCircle, Plus, Trash2, Printer, Palette, Box, Wrench, Settings2, Phone, Mail, ChevronDown, ChevronUp, Layers, Package, History } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface QuoterFormProps {
  onCalculate: (data: any) => void;
  settings: FinanceSettings;
  initialData?: any;
  onOpenHistory?: () => void;
}

interface MachineEntry {
  id: string;
  machineId: string;
  days: string;
  hours: string;
  minutes: string;
  weight: string;
}

export function QuoterForm({ onCalculate, settings, initialData }: QuoterFormProps) {
  // Production Mode State
  const [isProductionMode, setIsProductionMode] = useState(false);
  const [quantity, setQuantity] = useState('1');

  // Client Info
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  
  // Project Info
  const [projectName, setProjectName] = useState('');

  // Machine Lines
  const [machines, setMachines] = useState<MachineEntry[]>([
    { id: '1', machineId: 'default', days: '', hours: '', minutes: '', weight: '' }
  ]);

  // Load Initial Data
  useEffect(() => {
    if (initialData) {
      if (initialData.name) setProjectName(initialData.name);
      
      // Configurar máquina principal con los datos recibidos
      // Asumimos que viene grams y time (minutos)
      if (initialData.grams || initialData.time) {
        const timeMinutes = initialData.time || 0;
        const d = Math.floor(timeMinutes / (24 * 60));
        const h = Math.floor((timeMinutes % (24 * 60)) / 60);
        const m = Math.round(timeMinutes % 60);

        // Auto-detect Machine Logic
        let selectedMachineId = 'default';
        if (settings.machines && initialData.printerModel) {
            // 1. Try exact match
            const exact = settings.machines.find(m => 
                m.name.toLowerCase() === initialData.printerModel.toLowerCase()
            );
            if (exact) selectedMachineId = exact.id;
            else {
                // 2. Try partial match
                const partial = settings.machines.find(m => 
                    initialData.printerModel.toLowerCase().includes(m.name.toLowerCase()) ||
                    m.name.toLowerCase().includes(initialData.printerModel.toLowerCase())
                );
                if (partial) selectedMachineId = partial.id;
            }
        }
        
        // Fallback to resin default if type matches and no specific machine found
        if (selectedMachineId === 'default' && initialData.machineType === 'RESIN') {
             selectedMachineId = 'resin-default';
        }

        setMachines([{
            id: '1',
            machineId: selectedMachineId,
            days: d > 0 ? d.toString() : '',
            hours: h > 0 ? h.toString() : '',
            minutes: m > 0 ? m.toString() : '',
            weight: initialData.grams ? initialData.grams.toString() : ''
        }]);
      }
    }
  }, [initialData]);

  // Collapsible states
  const [isClientOpen, setIsClientOpen] = useState(true);


  // Human Time
  const [humanDays, setHumanDays] = useState('');
  const [humanHours, setHumanHours] = useState('');
  const [humanMinutes, setHumanMinutes] = useState('');
  
  // Painting Time
  const [paintHours, setPaintHours] = useState('');
  const [paintMinutes, setPaintMinutes] = useState('');

  // Modeling Time
  const [modelHours, setModelHours] = useState('');
  const [modelMinutes, setModelMinutes] = useState('');

  const [consumablesCost, setConsumablesCost] = useState(''); // Paint, sandpaper, primer
  const [additionalCost, setAdditionalCost] = useState(''); // Extra hardware etc.
  const [failureRate, setFailureRate] = useState('0'); // percentage
  
  // Available machines from settings - Memoize to prevent effect loops
  const availableMachines = useMemo(() => settings.machines || [], [settings.machines]);

  // Ref to track last calculated data string to prevent loops
  const lastCalculatedRef = useRef<string>('');

  const addMachineLine = () => {
    setMachines([
      ...machines,
      { id: Math.random().toString(36).substr(2, 9), machineId: 'default', days: '', hours: '', minutes: '', weight: '' }
    ]);
  };

  const removeMachineLine = (id: string) => {
    if (machines.length > 1) {
      setMachines(machines.filter(m => m.id !== id));
    }
  };

  const updateMachineLine = (id: string, field: keyof MachineEntry, value: string) => {
    setMachines(machines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // Real-time calculation effect
    useEffect(() => {
      const qty = isProductionMode ? (parseInt(quantity) || 1) : 1;

      // Aggregate machine data
      let totalMinutes = 0;
      let totalWeight = 0;
      
      // We need to pass detailed machine usage to results
      const machineDetails = machines.map(m => {
        const days = parseFloat(m.days) || 0;
        const hours = parseFloat(m.hours) || 0;
        const minutes = parseFloat(m.minutes) || 0;
        const weight = parseFloat(m.weight) || 0;
        
        const unitDuration = (days * 24 * 60) + (hours * 60) + minutes;
        const unitWeight = weight;
        
        const duration = unitDuration * qty;
        const totalLineWeight = unitWeight * qty;
        
        totalMinutes += duration;
        totalWeight += totalLineWeight;
  
        // Find selected machine definition
        const machineDef = availableMachines.find(am => am.id === m.machineId);
  
        return {
          machineId: m.machineId,
          machineName: machineDef?.name || 'Máquina Genérica',
          type: machineDef?.type || 'fdm',
          duration, // Total duration
          weight: totalLineWeight, // Total weight
          unitDuration, // Per unit
          unitWeight, // Per unit
          hourlyRate: machineDef?.hourlyRate // If available
        };
      });
  
      const hDays = parseFloat(humanDays) || 0;
      const hHours = parseFloat(humanHours) || 0;
      const hMinutes = parseFloat(humanMinutes) || 0;
      const unitHumanMinutes = (hDays * 24 * 60) + (hHours * 60) + hMinutes;
      const humanTotalMinutes = unitHumanMinutes * qty;
  
      // Painting
      const pHours = parseFloat(paintHours) || 0;
      const pMinutes = parseFloat(paintMinutes) || 0;
      const unitPaintingMinutes = (pHours * 60) + pMinutes;
      const paintingTotalMinutes = unitPaintingMinutes * qty;
  
      // Modeling - FIXED COST (Does not scale with quantity)
      const mHours = parseFloat(modelHours) || 0;
      const mMinutes = parseFloat(modelMinutes) || 0;
      const modelingTotalMinutes = (mHours * 60) + mMinutes;
  
      // Extras - Treat as variable (per unit) in production mode
      const unitExtraCost = (parseFloat(additionalCost) || 0) + (parseFloat(consumablesCost) || 0);
      const extraCost = unitExtraCost * qty;

      const risk = parseFloat(failureRate) || 0;
  
      if (totalMinutes > 0 || totalWeight > 0) {
        const payload = {
          totalMinutes, // Aggregated for quick checks
          materialWeight: totalWeight, // Aggregated
          humanMinutes: humanTotalMinutes, // Total general labor
          extraCost,
          failureRate: risk,
          quantity: qty,
          isProductionMode,
          machineDetails, // Detailed breakdown
          laborDetails: {
              generalMinutes: humanTotalMinutes,
              paintingMinutes: paintingTotalMinutes,
              modelingMinutes: modelingTotalMinutes // This remains fixed
          },
          clientInfo: {
              name: clientName,
              phone: clientPhone,
              email: clientEmail
          },
          projectName: projectName || 'Servicio de Impresión 3D'
        };
  
        const payloadStr = JSON.stringify(payload);
        if (payloadStr !== lastCalculatedRef.current) {
          lastCalculatedRef.current = payloadStr;
          onCalculate(payload);
        }
      }
    }, [machines, humanDays, humanHours, humanMinutes, paintHours, paintMinutes, modelHours, modelMinutes, consumablesCost, additionalCost, failureRate, availableMachines, onCalculate, clientName, clientPhone, clientEmail, projectName, isProductionMode, quantity]);

  return (
    <Card className="h-full border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-4 py-4 sm:px-6 sm:pb-4">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Configurador
                </CardTitle>
                <CardDescription>
                Ingresa los parámetros del proyecto
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 space-y-6">
        
        {/* Production Mode Switch - MOVED TO TOP OF CONTENT */}
         <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-full ${isProductionMode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {isProductionMode ? <Layers className="w-5 h-5" /> : <Package className="w-5 h-5" />}
               </div>
               <div>
                 <Label htmlFor="production-mode" className="font-semibold cursor-pointer">Modo Producción</Label>
                 <p className="text-xs text-muted-foreground">
                   {isProductionMode 
                     ? "Cálculo por lotes (Costos Fijos + Variables x Cantidad)" 
                     : "Cálculo unitario / Prototipado (Costos globales)"}
                 </p>
               </div>
            </div>
            <Switch 
               id="production-mode" 
               checked={isProductionMode}
               onCheckedChange={setIsProductionMode}
            />
         </div>
 
         {isProductionMode && (
           <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
             <Label htmlFor="quantity" className="text-sm font-medium">Cantidad de Unidades</Label>
             <Input 
               id="quantity"
               type="number"
               min="2"
               step="1"
               value={quantity}
               onChange={(e) => setQuantity(e.target.value)}
               className="text-lg font-bold"
             />
           </div>
         )}

        {/* Client Info Section */}
        <Collapsible open={isClientOpen} onOpenChange={setIsClientOpen} className="border rounded-lg bg-muted/20">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2 font-medium">
                    <User className="w-4 h-4 text-primary" />
                    Datos del Cliente
                </div>
                {isClientOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="projectName" className="text-xs font-semibold uppercase text-muted-foreground">Nombre del Proyecto / Servicio</Label>
                    <Input 
                        id="projectName" 
                        placeholder="Ej. Soportes para Alexa (Lote 50)" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)}
                        className="bg-background"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="clientName" className="text-xs font-semibold uppercase text-muted-foreground">Nombre</Label>
                        <Input 
                            id="clientName" 
                            placeholder="Ej. Juan Pérez" 
                            value={clientName} 
                            onChange={(e) => setClientName(e.target.value)}
                            className="bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clientPhone" className="text-xs font-semibold uppercase text-muted-foreground">WhatsApp</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input 
                                id="clientPhone" 
                                placeholder="999 999 999" 
                                value={clientPhone} 
                                onChange={(e) => setClientPhone(e.target.value)}
                                className="pl-9 bg-background"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="clientEmail" className="text-xs font-semibold uppercase text-muted-foreground">Email (Opcional)</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input 
                                id="clientEmail" 
                                type="email"
                                placeholder="cliente@ejemplo.com" 
                                value={clientEmail} 
                                onChange={(e) => setClientEmail(e.target.value)}
                                className="pl-9 bg-background"
                            />
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>

        <Tabs defaultValue="machines" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="machines" className="flex gap-2 text-xs sm:text-sm">
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Impresión</span>
                    <span className="sm:hidden">Imp.</span>
                </TabsTrigger>
                <TabsTrigger value="labor" className="flex gap-2 text-xs sm:text-sm">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Mano de Obra</span>
                    <span className="sm:hidden">M.O.</span>
                </TabsTrigger>
                <TabsTrigger value="extras" className="flex gap-2 text-xs sm:text-sm">
                    <DollarSign className="w-4 h-4" />
                    Extras
                </TabsTrigger>
            </TabsList>

            {/* TAB: MACHINES */}
            <TabsContent value="machines" className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium text-muted-foreground">Líneas de Producción</Label>
                    <Button variant="outline" size="sm" onClick={addMachineLine} className="h-7 text-xs gap-1">
                        <Plus className="w-3 h-3" /> Agregar
                    </Button>
                </div>

                <div className="space-y-3">
                    {machines.map((machine, index) => (
                        <div key={machine.id} className="bg-muted/30 p-3 rounded-lg border border-border/50 space-y-3 relative group hover:border-primary/20 transition-colors">
                            {machines.length > 1 && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive z-10"
                                    onClick={() => removeMachineLine(machine.id)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            )}
                            
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Máquina</Label>
                                <Select 
                                    value={machine.machineId} 
                                    onValueChange={(v) => updateMachineLine(machine.id, 'machineId', v)}
                                >
                                    <SelectTrigger className="h-9 bg-background">
                                        <span className="truncate text-left">
                                            {machine.machineId === 'default' 
                                                ? 'Genérica (Usar config. global)' 
                                                : (() => {
                                                    const m = availableMachines.find(am => am.id === machine.machineId);
                                                    return m ? `${m.name} (${m.type.toUpperCase()})` : 'Selecciona máquina';
                                                })()
                                            }
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Genérica (Usar config. global)</SelectItem>
                                        {availableMachines.map(m => (
                                            <SelectItem key={m.id} value={m.id}>
                                                {m.name} ({m.type.toUpperCase()})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-5 gap-3">
                                {/* Time Inputs - Spans 3 cols */}
                                <div className="col-span-3 space-y-1.5">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Tiempo
                                    </Label>
                                    <div className="flex gap-1">
                                        <div className="relative flex-1">
                                            <Input 
                                                type="number" 
                                                placeholder="0" 
                                                value={machine.days}
                                                onChange={(e) => updateMachineLine(machine.id, 'days', e.target.value)}
                                                min="0"
                                                className="h-9 pr-4 text-xs bg-background text-center"
                                            />
                                            <span className="absolute right-1 top-2.5 text-[9px] text-muted-foreground font-medium pointer-events-none">d</span>
                                        </div>
                                        <div className="relative flex-1">
                                            <Input 
                                                type="number" 
                                                placeholder="0" 
                                                value={machine.hours}
                                                onChange={(e) => updateMachineLine(machine.id, 'hours', e.target.value)}
                                                min="0"
                                                className="h-9 pr-4 text-xs bg-background text-center"
                                            />
                                            <span className="absolute right-1 top-2.5 text-[9px] text-muted-foreground font-medium pointer-events-none">h</span>
                                        </div>
                                        <div className="relative flex-1">
                                            <Input 
                                                type="number" 
                                                placeholder="0" 
                                                value={machine.minutes}
                                                onChange={(e) => updateMachineLine(machine.id, 'minutes', e.target.value)}
                                                min="0"
                                                max="59"
                                                className="h-9 pr-4 text-xs bg-background text-center"
                                            />
                                            <span className="absolute right-1 top-2.5 text-[9px] text-muted-foreground font-medium pointer-events-none">m</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Weight Input - Spans 2 cols */}
                                <div className="col-span-2 space-y-1.5">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Scale className="w-3 h-3" /> Peso
                                    </Label>
                                    <div className="relative">
                                        <Input 
                                            type="number" 
                                            placeholder="0" 
                                            value={machine.weight}
                                            onChange={(e) => updateMachineLine(machine.id, 'weight', e.target.value)}
                                            min="0"
                                            className="h-9 pr-6 text-xs bg-background text-center"
                                        />
                                        <span className="absolute right-2 top-2.5 text-[9px] text-muted-foreground font-medium pointer-events-none">g/ml</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>

            {/* TAB: LABOR */}
            <TabsContent value="labor" className="space-y-6 animate-in fade-in-50 duration-300">
                {/* General Labor */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <Wrench className="w-4 h-4 text-primary" />
                        Post-Procesado General
                    </Label>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                         <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input type="number" placeholder="0" value={humanDays} onChange={(e) => setHumanDays(e.target.value)} min="0" className="h-9 text-center bg-background" />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">días</span>
                            </div>
                            <div className="relative flex-1">
                                <Input type="number" placeholder="0" value={humanHours} onChange={(e) => setHumanHours(e.target.value)} min="0" className="h-9 text-center bg-background" />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">hrs</span>
                            </div>
                            <div className="relative flex-1">
                                <Input type="number" placeholder="0" value={humanMinutes} onChange={(e) => setHumanMinutes(e.target.value)} min="0" max="59" className="h-9 text-center bg-background" />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">min</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">
                           Limpieza de soportes, lijado básico, curado.
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Painting */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <Palette className="w-4 h-4 text-primary" />
                        Pintura y Acabado
                    </Label>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                         <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input type="number" placeholder="0" value={paintHours} onChange={(e) => setPaintHours(e.target.value)} min="0" className="h-9 text-center bg-background" />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">hrs</span>
                            </div>
                            <div className="relative flex-1">
                                <Input type="number" placeholder="0" value={paintMinutes} onChange={(e) => setPaintMinutes(e.target.value)} min="0" max="59" className="h-9 text-center bg-background" />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">min</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                 {/* Modeling */}
                 <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                        <Box className="w-4 h-4 text-primary" />
                        Modelado 3D
                    </Label>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                         <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input type="number" placeholder="0" value={modelHours} onChange={(e) => setModelHours(e.target.value)} min="0" className="h-9 text-center bg-background" />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">hrs</span>
                            </div>
                            <div className="relative flex-1">
                                <Input type="number" placeholder="0" value={modelMinutes} onChange={(e) => setModelMinutes(e.target.value)} min="0" max="59" className="h-9 text-center bg-background" />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            {/* TAB: EXTRAS */}
            <TabsContent value="extras" className="space-y-6 animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Insumos (S/.)</Label>
                        <Input 
                            type="number" 
                            placeholder="0.00" 
                            value={consumablesCost}
                            onChange={(e) => setConsumablesCost(e.target.value)}
                            min="0"
                            step="0.10"
                            className="bg-muted/30"
                        />
                        <p className="text-[10px] text-muted-foreground">Lija, pintura, primer, pegamento, etc.</p>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Hardware / Otros (S/.)</Label>
                        <Input 
                            type="number" 
                            placeholder="0.00" 
                            value={additionalCost}
                            onChange={(e) => setAdditionalCost(e.target.value)}
                            min="0"
                            step="0.10"
                            className="bg-muted/30"
                        />
                         <p className="text-[10px] text-muted-foreground">Tornillos, imanes, electrónica, etc.</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            Factor de Riesgo (%)
                        </Label>
                        <div className="relative">
                            <Input 
                                type="number" 
                                placeholder="0" 
                                value={failureRate}
                                onChange={(e) => setFailureRate(e.target.value)}
                                min="0"
                                max="100"
                                className="bg-destructive/5 border-destructive/20 text-destructive font-medium pr-8"
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-destructive">%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            Aumenta el tiempo y material calculado para cubrir posibles fallos.
                        </p>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
