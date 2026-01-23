'use client';

import React, { useMemo, useState } from 'react';
import { FinanceSettings } from '../../finances/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Scale, Clock, User, AlertCircle, DollarSign, TrendingUp, Factory, Info, Palette } from 'lucide-react';

interface QuoterResultsProps {
  data: {
    // Aggregated stats (kept for backward compat / quick views)
    totalMinutes: number;
    materialWeight: number;
    humanMinutes: number;
    extraCost: number;
    failureRate: number;
    
    // New: Detailed Machine Breakdown
    machineDetails?: {
      machineId: string;
      machineName: string;
      type: 'fdm' | 'resin';
      duration: number; // minutes
      weight: number; // g or ml
      hourlyRate?: number;
    }[];

    // New: Labor Breakdown
    laborDetails?: {
        generalMinutes: number;
        paintingMinutes: number;
        modelingMinutes: number;
    };
    consumablesCost?: number; // Lija, pintura, etc.
  };
  settings: FinanceSettings;
}

export function QuoterResults({ data, settings }: QuoterResultsProps) {
  const [desiredMargin, setDesiredMargin] = useState(40); // 40% default
  const [customPrice, setCustomPrice] = useState<string>('');

  const costs = useMemo(() => {
    // Factors
    const riskFactor = 1 + ((data.failureRate || 0) / 100);
    const details = data.machineDetails || [];
    
    // 1. Machine Costs (Calculated per machine line)
    let totalElectricityCost = 0;
    let totalDepreciationCost = 0;
    let totalMaterialCost = 0;
    let totalRiskAdjustedMachineMinutes = 0;

    if (details.length > 0) {
      details.forEach(m => {
        // Apply Risk Factor to this machine's time
        const riskAdjustedDuration = m.duration * riskFactor;
        const hours = riskAdjustedDuration / 60;
        totalRiskAdjustedMachineMinutes += riskAdjustedDuration;

        // Electricity
        const powerKw = m.type === 'resin' ? 0.1 : 0.2; // 100W vs 200W
        totalElectricityCost += (powerKw * settings.electricityPrice) * hours;

        // Depreciation
        let depreciationRate = 0;
        if (m.hourlyRate !== undefined) {
           depreciationRate = m.type === 'resin' 
            ? (settings.machineDepreciationRateResin || settings.machineDepreciationRate)
            : (settings.machineDepreciationRateFdm || settings.machineDepreciationRate);
        } else {
           depreciationRate = m.type === 'resin' 
            ? (settings.machineDepreciationRateResin || settings.machineDepreciationRate)
            : (settings.machineDepreciationRateFdm || settings.machineDepreciationRate);
        }
        totalDepreciationCost += depreciationRate * hours;

        // Material
        const materialUnitCost = m.type === 'resin' ? settings.materialCostResin : settings.materialCostFdm;
        const riskAdjustedWeight = m.weight * riskFactor;
        totalMaterialCost += (riskAdjustedWeight / 1000) * materialUnitCost;
      });
    } else {
       // Fallback for legacy/simple data (should not happen with new form but good for safety)
       // ... existing logic ...
    }

    // 3. Human Labor Calculation
    let laborValue = 0;
    
    if (data.laborDetails) {
        // Use detailed breakdown
        const generalHours = (data.laborDetails.generalMinutes * riskFactor) / 60;
        const paintingHours = (data.laborDetails.paintingMinutes * riskFactor) / 60;
        const modelingHours = (data.laborDetails.modelingMinutes * riskFactor) / 60;

        laborValue += generalHours * settings.humanHourlyRate;
        laborValue += paintingHours * (settings.humanHourlyRatePainting || settings.humanHourlyRate * 1.5); // Fallback if not set
        laborValue += modelingHours * (settings.humanHourlyRateModeling || settings.humanHourlyRate * 2.5); // Fallback if not set
    } else {
        // Fallback to simple calculation
        const riskAdjustedHumanMinutes = data.humanMinutes * riskFactor;
        const humanHours = riskAdjustedHumanMinutes / 60;
        laborValue = humanHours * settings.humanHourlyRate;
    }
    
    // Consumables (New)
    const consumables = data.consumablesCost || 0;

    const directCost = totalElectricityCost + totalDepreciationCost + totalMaterialCost + data.extraCost + consumables;

    return {
      electricity: totalElectricityCost,
      depreciation: totalDepreciationCost,
      material: totalMaterialCost,
      extra: data.extraCost,
      consumables,
      totalDirect: directCost,
      laborValue: laborValue,
      riskFactor,
      totalMachineMinutes: totalRiskAdjustedMachineMinutes
    };
  }, [data, settings]);

  // Pricing Calculations
  // Formula: Price = (DirectCost + LaborCost) / (1 - Margin%)
  // This ensures that the Margin% is truly Net Profit AFTER paying labor.
  const totalBaseCost = costs.totalDirect + costs.laborValue;
  const suggestedPrice = totalBaseCost / (1 - (desiredMargin / 100));
  
  // If user enters a custom price
  const finalPrice = customPrice ? parseFloat(customPrice) : suggestedPrice;
  
  // Profit Analysis
  // 1. Gross Profit (Revenue - Direct Costs)
  const grossProfit = finalPrice - costs.totalDirect;
  
  // 2. Business Net Profit (Gross Profit - Labor)
  const laborCost = costs.laborValue;
  const businessProfit = grossProfit - laborCost;
  
  // 3. Calculate actual margins achieved
  const finalMargin = finalPrice > 0 ? (businessProfit / finalPrice) * 100 : 0;

  // Reference Prices
  const minViablePrice = totalBaseCost; // Break-even (Company profit = 0, covers Labor)
  const recommendedPrice = minViablePrice / 0.70; // Target 30% Net Profit Margin

  const formatMoney = (val: number) => `S/. ${val.toFixed(2)}`;

  const formatDuration = (totalMinutes: number) => {
    const minutesTotal = Math.round(totalMinutes);
    if (minutesTotal <= 0) return '0 min';
    
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

  return (
    <div className="space-y-6">
      {/* 1. Cost Breakdown Card */}
      <Card className="bg-muted/10 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex justify-between items-center">
            <span>Costo Operativo (Directo)</span>
            {(machineCount > 1 || data.failureRate > 0) && (
                <Badge variant="outline" className="text-[10px] font-normal gap-1">
                    {machineCount > 1 && <span>{machineCount} maq.</span>}
                    {data.failureRate > 0 && <span>+{data.failureRate}% riesgo</span>}
                </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" /> Tiempo Impresión
                </span>
                <span className="font-mono text-xs text-right">
                    {formatDuration(costs.totalMachineMinutes)}
                    {machineCount > 1 && <span className="block text-[10px] text-muted-foreground">({machineCount} máquinas)</span>}
                </span>
            </div>
            
            {/* Machine Breakdown if multiple */}
            {machineCount > 1 && data.machineDetails && (
              <div className="pl-6 border-l-2 border-muted my-2 space-y-1">
                 {data.machineDetails.map((m, idx) => (
                   <div key={idx} className="flex justify-between text-[10px] text-muted-foreground">
                      <span>{m.machineName}</span>
                      <span>{formatDuration(m.duration)}</span>
                   </div>
                 ))}
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                    <Scale className="w-4 h-4" /> Material
                </span>
                <span className="font-mono">{formatMoney(costs.material)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="w-4 h-4" /> Energía
                </span>
                <span className="font-mono">{formatMoney(costs.electricity)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                    <Factory className="w-4 h-4" /> Depreciación
                </span>
                <span className="font-mono">{formatMoney(costs.depreciation)}</span>
            </div>
            {costs.consumables > 0 && (
                <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <Info className="w-4 h-4" /> Insumos
                    </span>
                    <span className="font-mono">{formatMoney(costs.consumables)}</span>
                </div>
            )}
            {costs.extra > 0 && (
                <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="w-4 h-4" /> Extras
                    </span>
                    <span className="font-mono">{formatMoney(costs.extra)}</span>
                </div>
            )}

            <Separator className="my-2" />

            <div className="flex justify-between items-center text-sm font-medium">
                <span>Total Directo</span>
                <span>{formatMoney(costs.totalDirect)}</span>
            </div>
        </CardContent>
      </Card>

      {/* 2. Labor Cost */}
      <Card className="bg-muted/10 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Mano de Obra (Tiempo)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" /> Valor del Tiempo
                </span>
                <span className="font-mono">{formatMoney(costs.laborValue)}</span>
            </div>
            
            {/* Labor Breakdown */}
            {data.laborDetails && (
                <div className="pl-6 border-l-2 border-muted my-2 space-y-1">
                   {data.laborDetails.generalMinutes > 0 && (
                       <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>General ({formatDuration(data.laborDetails.generalMinutes)})</span>
                          <span>{formatMoney((data.laborDetails.generalMinutes / 60) * settings.humanHourlyRate)}</span>
                       </div>
                   )}
                   {data.laborDetails.paintingMinutes > 0 && (
                       <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Pintado ({formatDuration(data.laborDetails.paintingMinutes)})</span>
                          <span>{formatMoney((data.laborDetails.paintingMinutes / 60) * (settings.humanHourlyRatePainting || settings.humanHourlyRate))}</span>
                       </div>
                   )}
                   {data.laborDetails.modelingMinutes > 0 && (
                       <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Modelado ({formatDuration(data.laborDetails.modelingMinutes)})</span>
                          <span>{formatMoney((data.laborDetails.modelingMinutes / 60) * (settings.humanHourlyRateModeling || settings.humanHourlyRate))}</span>
                       </div>
                   )}
                </div>
            )}
        </CardContent>
      </Card>

      {/* 2. Pricing Simulator */}
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Simulador de Precio
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

            {/* Reference Prices (Benchmarks) */}
            <div className="grid grid-cols-2 gap-3">
                <div 
                    className="p-3 rounded-lg border bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/50 cursor-pointer hover:bg-orange-100/50 transition-colors group"
                    onClick={() => {
                        setCustomPrice(minViablePrice.toFixed(2));
                        // Calculate implied margin for slider sync (approx)
                        const impliedMargin = ((minViablePrice - costs.totalDirect) / minViablePrice) * 100;
                        setDesiredMargin(Math.round(impliedMargin));
                    }}
                >
                    <div className="text-[10px] uppercase tracking-wider text-orange-600 font-bold mb-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Mínimo Viable
                    </div>
                    <div className="text-xl font-bold text-orange-700 dark:text-orange-500">
                        {formatMoney(minViablePrice)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 group-hover:text-orange-600/80">
                        Cubre Costos + Sueldo.
                        <br/>
                        Utilidad Empresa: S/. 0
                    </div>
                </div>

                <div 
                    className="p-3 rounded-lg border bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/50 cursor-pointer hover:bg-emerald-100/50 transition-colors group"
                    onClick={() => {
                        setCustomPrice(recommendedPrice.toFixed(2));
                        const impliedMargin = ((recommendedPrice - costs.totalDirect) / recommendedPrice) * 100;
                        setDesiredMargin(Math.round(impliedMargin));
                    }}
                >
                    <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Recomendado
                    </div>
                    <div className="text-xl font-bold text-emerald-700 dark:text-emerald-500">
                        {formatMoney(recommendedPrice)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 group-hover:text-emerald-600/80">
                        Empresa Sana (30% Neto).
                        <br/>
                        Para crecimiento real.
                    </div>
                </div>
            </div>
            
            {/* Controls */}
            <div className="grid gap-6 p-4 bg-muted/20 rounded-xl">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="flex flex-col gap-1">
                            <span>Nivel de Ganancia (Margen)</span>
                            <span className="text-[10px] font-normal text-muted-foreground">
                                ¿Qué porcentaje del cobro final será ganancia neta para la empresa?
                            </span>
                        </Label>
                        <span className="text-xl font-bold text-primary">{desiredMargin}%</span>
                    </div>
                    
                    <input 
                        type="range"
                        min="10"
                        max="80"
                        step="5"
                        value={desiredMargin}
                        onChange={(e) => {
                            setDesiredMargin(Number(e.target.value));
                            setCustomPrice('');
                        }}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    
                    {/* Explicación Dinámica Amigable */}
                    <div className="bg-primary/5 rounded-lg p-3 text-sm text-muted-foreground border border-primary/10">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 text-primary" />
                            <div className="space-y-1">
                                <p>
                                    <span className="font-semibold text-primary">Interpretación:</span>
                                    <br/>
                                    Por cada <strong>S/. 100</strong> que cobres al cliente:
                                </p>
                                <ul className="list-disc pl-4 space-y-0.5 text-xs">
                                    <li><strong>S/. {100 - desiredMargin}</strong> se van en cubrir costos y sueldos.</li>
                                    <li><strong>S/. {desiredMargin}</strong> quedan libres para la empresa (crecimiento).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>O define tú mismo el Precio Final:</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground font-bold">S/.</span>
                        <Input 
                            type="number" 
                            className="pl-9 font-bold text-lg"
                            placeholder={suggestedPrice.toFixed(2)}
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                <div className="flex justify-between items-end border-b pb-4">
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Precio Final Sugerido</span>
                        <div className="flex items-center gap-2">
                            <h3 className="text-3xl font-bold text-foreground">
                                {formatMoney(finalPrice)}
                            </h3>
                            {customPrice && (
                                <Badge variant={finalMargin >= 40 ? 'default' : finalMargin >= 30 ? 'secondary' : 'destructive'}>
                                    Margen {finalMargin.toFixed(1)}%
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profit Split Visualization */}
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-3">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        Reparto de la Ganancia (S/. {grossProfit.toFixed(2)})
                    </h5>
                    
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">1. Tu Sueldo (Mano de Obra)</span>
                            <span className="text-[10px] text-muted-foreground">
                                {formatDuration(data.humanMinutes)} ({data.humanMinutes} min) @ S/. {settings.humanHourlyRate}/h
                            </span>
                        </div>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                            {formatMoney(laborCost)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-blue-200/50 dark:border-blue-800/50">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">2. Utilidad Neta Empresa</span>
                            <span className="text-[10px] text-muted-foreground">
                                Para reinversión y crecimiento
                            </span>
                        </div>
                        <span className={`font-bold text-lg ${businessProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {formatMoney(businessProfit)}
                        </span>
                    </div>
                </div>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
