'use client';

import React, { useMemo, useState } from 'react';
import { FinanceSettings } from '../../finances/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Zap, Scale, Clock, User, AlertCircle, DollarSign, TrendingUp, Factory, Info, Receipt, Wallet, Calculator, FileText, Send, Save, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuotePreviewModal } from './QuotePreviewModal';
import { toast } from 'sonner';
import { QuotesService } from '../services/quotes.service';

interface QuoterResultsProps {
  data: {
    totalMinutes: number;
    materialWeight: number;
    humanMinutes: number;
    extraCost: number;
    failureRate: number;
    quantity?: number; // Added
    isProductionMode?: boolean; // Added
    machineDetails?: {
      machineId: string;
      machineName: string;
      type: 'fdm' | 'resin';
      duration: number;
      weight: number;
      unitDuration?: number; // Added
      unitWeight?: number; // Added
      hourlyRate?: number;
    }[];
    laborDetails?: {
        generalMinutes: number;
        paintingMinutes: number;
        modelingMinutes: number;
    };
    consumablesCost?: number;
    clientInfo?: {
        name: string;
        phone: string;
        email: string;
    };
    projectName?: string;
  };
  settings: FinanceSettings;
}

export function QuoterResults({ data, settings }: QuoterResultsProps) {
  const [desiredMargin, setDesiredMargin] = useState(40); // 40% default
  const [customPrice, setCustomPrice] = useState<string>('');
  const [includeIgv, setIncludeIgv] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const IGV_RATE = 0.18;
  
  // Auto-apply wholesale margin if applicable
  React.useEffect(() => {
    if (data.isProductionMode && data.quantity && settings.wholesaleThreshold) {
       if (data.quantity >= settings.wholesaleThreshold) {
          setDesiredMargin(settings.wholesaleMargin || 30);
       } else {
          setDesiredMargin(40); // Reset to default if below threshold
       }
    }
  }, [data.quantity, data.isProductionMode, settings.wholesaleThreshold, settings.wholesaleMargin]);

  const costs = useMemo(() => {
    // Factors
    const riskFactor = 1 + ((data.failureRate || 0) / 100);
    const details = data.machineDetails || [];
    
    // 1. Machine Costs
    let totalElectricityCost = 0;
    let totalDepreciationCost = 0;
    let totalMaterialCost = 0;
    let totalRiskAdjustedMachineMinutes = 0;

    if (details.length > 0) {
      details.forEach(m => {
        const riskAdjustedDuration = m.duration * riskFactor;
        const hours = riskAdjustedDuration / 60;
        totalRiskAdjustedMachineMinutes += riskAdjustedDuration;

        const powerKw = m.type === 'resin' ? 0.1 : 0.2;
        totalElectricityCost += (powerKw * settings.electricityPrice) * hours;

        let depreciationRate = m.hourlyRate || 0;
        
        // Fallback if hourlyRate not provided in details (shouldn't happen in new logic but good for safety)
        if (!depreciationRate && settings.machines) {
            const machineDef = settings.machines.find(mach => mach.id === m.machineId);
            if (machineDef) {
                depreciationRate = machineDef.hourlyRate;
            } else {
                // Last resort fallback: average of type
                const typeMachines = settings.machines.filter(mach => mach.type === m.type);
                if (typeMachines.length > 0) {
                    const sum = typeMachines.reduce((acc, curr) => acc + curr.hourlyRate, 0);
                    depreciationRate = sum / typeMachines.length;
                }
            }
        }
        
        totalDepreciationCost += depreciationRate * hours;

        const materialUnitCost = m.type === 'resin' ? settings.resinCostPerKg : settings.filamentCostPerKg;
        const riskAdjustedWeight = m.weight * riskFactor;
        totalMaterialCost += (riskAdjustedWeight / 1000) * materialUnitCost;
      });
    }

    // 2. Labor
    let laborValue = 0;
    if (data.laborDetails) {
        const generalHours = (data.laborDetails.generalMinutes * riskFactor) / 60;
        const paintingHours = (data.laborDetails.paintingMinutes * riskFactor) / 60;
        const modelingHours = (data.laborDetails.modelingMinutes * riskFactor) / 60; // Modeling is Fixed, already handled in form logic, here we just sum cost

        laborValue += generalHours * settings.humanHourlyRate;
        laborValue += paintingHours * (settings.humanHourlyRatePainting || settings.humanHourlyRate * 1.5);
        laborValue += modelingHours * (settings.humanHourlyRateModeling || settings.humanHourlyRate * 2.5);
    } else {
        const riskAdjustedHumanMinutes = data.humanMinutes * riskFactor;
        const humanHours = riskAdjustedHumanMinutes / 60;
        laborValue = humanHours * settings.humanHourlyRate;
    }
    
    const consumables = data.consumablesCost || 0;
    const startupFee = settings.startupFee || 0; // Fixed fee (setup)

    const directCost = totalElectricityCost + totalDepreciationCost + totalMaterialCost + data.extraCost + consumables + startupFee;

    // Unit Cost Calculation (for Production Mode)
    const quantity = data.quantity || 1;
    const unitDirectCost = directCost / quantity;
    const unitLaborValue = laborValue / quantity;
    const unitTotalCost = unitDirectCost + unitLaborValue;

    return {
      electricity: totalElectricityCost,
      depreciation: totalDepreciationCost,
      material: totalMaterialCost,
      extra: data.extraCost,
      consumables,
      startupFee,
      totalDirect: directCost,
      laborValue: laborValue,
      riskFactor,
      totalMachineMinutes: totalRiskAdjustedMachineMinutes,
      unitTotalCost // Exposed for display
    };
  }, [data, settings]);

  // Pricing Calculations
  const totalBaseCost = costs.totalDirect + costs.laborValue;
  const suggestedNetPrice = totalBaseCost / (1 - (desiredMargin / 100));
  
  let netPrice = 0;
  let totalBilled = 0;

  if (customPrice) {
    const val = parseFloat(customPrice) || 0;
    if (includeIgv) {
        totalBilled = val;
        netPrice = val / (1 + IGV_RATE);
    } else {
        netPrice = val;
        totalBilled = val * (1 + IGV_RATE);
    }
  } else {
    // Auto-calc
    if (includeIgv) {
        // Target a round Total
        const rawTotal = suggestedNetPrice * (1 + IGV_RATE);
        totalBilled = Math.ceil(rawTotal);
        netPrice = totalBilled / (1 + IGV_RATE);
    } else {
        // Target a round Net
        netPrice = Math.ceil(suggestedNetPrice);
        totalBilled = netPrice * (1 + IGV_RATE);
    }
  }

  const taxAmount = totalBilled - netPrice;

  // Profit Analysis
  const grossProfit = netPrice - costs.totalDirect;
  const businessProfit = grossProfit - costs.laborValue;
  const finalMargin = netPrice > 0 ? (businessProfit / netPrice) * 100 : 0;

  const minViablePrice = totalBaseCost;
  const recommendedPrice = minViablePrice / 0.70;

  const formatMoney = (val: number) => `S/. ${val.toFixed(2)}`;
  
  const formatDuration = (totalMinutes: number) => {
    const minutesTotal = Math.round(totalMinutes);
    if (minutesTotal <= 0) return '0m';
    const days = Math.floor(minutesTotal / (24 * 60));
    const remainingAfterDays = minutesTotal % (24 * 60);
    const hours = Math.floor(remainingAfterDays / 60);
    const minutes = remainingAfterDays % 60;
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
    return parts.join(' ');
  };

  const machineCount = data.machineDetails?.length || 0;

  const handleSaveQuote = async () => {
    setIsSaving(true);
    try {
        await QuotesService.saveQuote({
            clientName: data.clientInfo?.name || 'Cliente sin nombre',
            clientPhone: data.clientInfo?.phone || '',
            clientEmail: data.clientInfo?.email || '',
            projectName: data.projectName || 'Cotización sin título',
            totalBilled,
            netPrice,
            taxAmount,
            currency: 'PEN',
            status: 'draft',
            data: {
                ...data,
                calculatedCosts: costs
            },
            settingsSnapshot: settings
        });
        toast.success("Cotización guardada exitosamente");
    } catch (error) {
        console.error(error);
        toast.error("Error al guardar cotización");
    } finally {
        setIsSaving(false);
    }
  };

  const handleSendWhatsApp = () => {
    const phone = data.clientInfo?.phone?.replace(/\D/g, '') || '';
    const name = data.clientInfo?.name || 'Cliente';
    const total = formatMoney(totalBilled);
    
    const message = `Hola ${name}! 👋 Te adjunto la cotización detallada para tu proyecto de impresión 3D. El total sería ${total}. Quedo atento a tus dudas.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      
      {/* SECTION 1: TICKET / COST BREAKDOWN */}
      <Card className="bg-white dark:bg-zinc-950 border shadow-sm overflow-hidden relative">
        {/* Ticket Header Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
        
        <CardHeader className="pb-3 bg-muted/30 border-b border-border/50">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest flex justify-between items-center text-muted-foreground">
            <span className="flex items-center gap-2">
                <Receipt className="w-4 h-4" /> Desglose de Costos
            </span>
            {data.failureRate > 0 && (
                <Badge variant="destructive" className="text-[10px] h-5">
                    +{data.failureRate}% Riesgo
                </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
            <ScrollArea className="h-auto max-h-[300px]">
                <div className="p-4 space-y-4 text-sm">
                    {/* Direct Costs Group */}
                    <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                            <Factory className="w-3 h-3" /> COSTOS DE MÁQUINA Y MATERIAL
                        </div>
                        
                        <div className="grid grid-cols-[1fr_auto] gap-2 text-xs">
                            <div className="text-muted-foreground pl-2 border-l-2 border-primary/20">
                                Material ({formatMoney(costs.material)}) + Energía ({formatMoney(costs.electricity)})
                            </div>
                            <div className="font-mono tabular-nums text-right">{formatMoney(costs.material + costs.electricity)}</div>

                            <div className="text-muted-foreground pl-2 border-l-2 border-primary/20">
                                Depreciación de Equipos
                            </div>
                            <div className="font-mono tabular-nums text-right">{formatMoney(costs.depreciation)}</div>

                            {(costs.consumables > 0 || costs.extra > 0) && (
                                <>
                                    <div className="text-muted-foreground pl-2 border-l-2 border-primary/20">
                                        Insumos y Extras
                                    </div>
                                    <div className="font-mono tabular-nums text-right">{formatMoney(costs.consumables + costs.extra)}</div>
                                </>
                            )}

                             {costs.startupFee > 0 && (
                                <>
                                    <div className="text-muted-foreground pl-2 border-l-2 border-primary/20">
                                        Prep. y Control Calidad
                                    </div>
                                    <div className="font-mono tabular-nums text-right">{formatMoney(costs.startupFee)}</div>
                                </>
                            )}
                        </div>
                    </div>

                    <Separator className="border-dashed" />

                    {/* Labor Group */}
                    <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                            <User className="w-3 h-3" /> MANO DE OBRA (TIEMPO)
                        </div>
                        <div className="grid grid-cols-[1fr_auto] gap-2 text-xs">
                             <div className="text-muted-foreground pl-2 border-l-2 border-blue-500/20">
                                Valor del Tiempo Humano
                                {data.laborDetails && (
                                    <span className="block text-[10px] opacity-70">
                                        Gen: {formatDuration(data.laborDetails.generalMinutes)} | 
                                        Pint: {formatDuration(data.laborDetails.paintingMinutes)} | 
                                        Mod: {formatDuration(data.laborDetails.modelingMinutes)}
                                    </span>
                                )}
                             </div>
                             <div className="font-mono tabular-nums text-right">{formatMoney(costs.laborValue)}</div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="bg-muted/50 p-3 border-t border-border/50 flex justify-between items-center">
            <span className="text-xs font-medium uppercase text-muted-foreground">Costo Base Total</span>
            <span className="text-lg font-mono font-bold text-foreground">{formatMoney(totalBaseCost)}</span>
        </CardFooter>
      </Card>

      {/* SECTION 2: PRICING SIMULATOR */}
      <Card className="border-2 border-primary/10 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Calculator className="w-32 h-32" />
        </div>

        <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary" />
                        <span className="text-xl">Precio de Venta</span>
                    </CardTitle>
                </div>
                
                <div className="flex items-center gap-2 bg-background p-1 rounded-full border shadow-sm">
                    <Label htmlFor="igv-mode" className={cn("text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors font-medium", !includeIgv ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
                        Más IGV
                    </Label>
                    <Switch 
                        id="igv-mode" 
                        checked={includeIgv} 
                        onCheckedChange={setIncludeIgv} 
                        className="data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="igv-mode" className={cn("text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors font-medium", includeIgv ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
                        Incluye IGV
                    </Label>
                </div>
            </div>
        </CardHeader>

        <CardContent className="space-y-6">
            {/* Final Price Block */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Precio Final Sugerido</span>
                    {data.isProductionMode && (
                      <Badge variant="outline" className="text-xs bg-background text-primary border-primary/30">
                        {formatMoney(netPrice / (data.quantity || 1))} c/u + IGV
                      </Badge>
                    )}
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-3xl font-bold tracking-tight text-primary">
                            {formatMoney(includeIgv ? totalBilled : netPrice)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {includeIgv ? 'Incluido IGV (18%)' : 'Más IGV (18%)'}
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Margin Slider */}
            <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <Label className="text-sm font-medium text-muted-foreground">Margen de Ganancia Deseado</Label>
                    <div className={cn("text-xl font-bold font-mono", finalMargin < 20 ? "text-destructive" : finalMargin < 35 ? "text-orange-500" : "text-emerald-600")}>
                        {Math.round(finalMargin)}%
                    </div>
                 </div>
                 
                 <input 
                    type="range"
                    min="0"
                    max="80"
                    step="1"
                    value={desiredMargin}
                    onChange={(e) => {
                        setDesiredMargin(Number(e.target.value));
                        setCustomPrice(''); // Reset custom price when slider moves
                    }}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                 />
                 
                 <div className="grid grid-cols-3 gap-2 pt-2">
                    <div 
                        onClick={() => { setDesiredMargin(0); setCustomPrice(''); }}
                        className={cn("text-center p-2 rounded border cursor-pointer hover:bg-muted transition-colors text-xs", desiredMargin === 0 && "bg-muted border-primary/30")}
                    >
                        <div className="font-bold text-muted-foreground">0%</div>
                        <div className="text-[9px] text-muted-foreground/70">Break-even</div>
                    </div>
                    <div 
                        onClick={() => { setDesiredMargin(30); setCustomPrice(''); }}
                        className={cn("text-center p-2 rounded border cursor-pointer hover:bg-muted transition-colors text-xs", desiredMargin === 30 && "bg-muted border-primary/30")}
                    >
                        <div className="font-bold text-emerald-600">30%</div>
                        <div className="text-[9px] text-muted-foreground/70">Recomendado</div>
                    </div>
                    <div 
                        onClick={() => { setDesiredMargin(50); setCustomPrice(''); }}
                        className={cn("text-center p-2 rounded border cursor-pointer hover:bg-muted transition-colors text-xs", desiredMargin === 50 && "bg-muted border-primary/30")}
                    >
                        <div className="font-bold text-primary">50%</div>
                        <div className="text-[9px] text-muted-foreground/70">Alto Valor</div>
                    </div>
                 </div>
            </div>

            {/* Profit Display */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-lg p-4 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold text-emerald-600/70 tracking-wider">Ganancia Neta</span>
                    <span className="text-[10px] text-emerald-600/50">(Libre para la empresa)</span>
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 font-mono">
                    {formatMoney(businessProfit)}
                </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-3 pt-2">
                <Button 
                    variant="outline" 
                    onClick={handleSaveQuote} 
                    disabled={isSaving}
                    className="w-full h-10 border-primary/20 hover:bg-primary/5 text-primary"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Guardando...' : 'Guardar Cotización'}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="w-full h-12">
                        <FileText className="w-4 h-4 mr-2" />
                        Vista Previa PDF
                    </Button>
                    <Button onClick={handleSendWhatsApp} className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white">
                        <Send className="w-4 h-4 mr-2" />
                        WhatsApp
                    </Button>
                </div>
            </div>

        </CardContent>
      </Card>

      <QuotePreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
          data={data}
          settings={settings}
          clientInfo={data.clientInfo || { name: '', phone: '', email: '' }}
          projectName={data.projectName || 'Servicio de Impresión 3D'}
          pricing={{
              subtotal: netPrice,
              igv: taxAmount,
            total: totalBilled,
            includeIgv: includeIgv
        }}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </div>
  );
}
