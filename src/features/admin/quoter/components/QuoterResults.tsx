'use client';

import React, { useMemo, useState } from 'react';
import { FinanceSettings } from '../../finances/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Scale, Clock, User, AlertCircle, DollarSign, TrendingUp, Factory } from 'lucide-react';

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
           // If machine has specific hourly rate (usually rental price or full cost), 
           // we might want to use that? 
           // But wait, MachineDefinition.hourlyRate usually implies "Charge to client".
           // Here we are calculating COST.
           // So we should stick to depreciation rate.
           // However, if we have specific machines, maybe we should have specific depreciation?
           // Current FinanceSettings only has global rates.
           // Let's stick to global rates based on type for now, as per types.ts
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

    // 3. Human Labor
    const riskAdjustedHumanMinutes = data.humanMinutes * riskFactor;
    
    const directCost = totalElectricityCost + totalDepreciationCost + totalMaterialCost + data.extraCost;
    
    // Calculate implied labor value
    const humanHours = riskAdjustedHumanMinutes / 60;
    const laborValue = humanHours * settings.humanHourlyRate;

    return {
      electricity: totalElectricityCost,
      depreciation: totalDepreciationCost,
      material: totalMaterialCost,
      extra: data.extraCost,
      totalDirect: directCost,
      laborValue: laborValue,
      riskFactor,
      totalMachineMinutes: totalRiskAdjustedMachineMinutes
    };
  }, [data, settings]);

  // Pricing Calculations
  // Formula: Price = Cost / (1 - Margin%)
  // Margin here is Gross Margin (Operational Profit Margin)
  const suggestedPrice = costs.totalDirect / (1 - (desiredMargin / 100));
  const profit = suggestedPrice - costs.totalDirect;
  
  // If user enters a custom price
  const finalPrice = customPrice ? parseFloat(customPrice) : suggestedPrice;
  const finalProfit = finalPrice - costs.totalDirect;
  const finalMargin = finalPrice > 0 ? (finalProfit / finalPrice) * 100 : 0;
  
  // Split Analysis
  // From the profit, we pay labor. What remains is Business Net Profit.
  const laborCost = costs.laborValue;
  const businessProfit = finalProfit - laborCost;

  // Reference Prices
  const minViablePrice = costs.totalDirect + laborCost; // Break-even (Company profit = 0)
  const recommendedPrice = minViablePrice / 0.70; // Target 30% Net Profit Margin (after labor)

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
            {costs.extra > 0 && (
                <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="w-4 h-4" /> Extras
                    </span>
                    <span className="font-mono">{formatMoney(costs.extra)}</span>
                </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between items-center font-bold">
                <span>Total Costo Directo</span>
                <span>{formatMoney(costs.totalDirect)}</span>
            </div>
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
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Label>Margen Deseado</Label>
                        <span className="text-sm font-bold text-primary">{desiredMargin}%</span>
                    </div>
                    <input 
                        type="range"
                        min="0"
                        max="90"
                        step="1"
                        value={desiredMargin}
                        onChange={(e) => {
                            setDesiredMargin(Number(e.target.value));
                            setCustomPrice('');
                        }}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <p className="text-[10px] text-muted-foreground">
                        Porcentaje del precio final que será ganancia bruta.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>O ingresa un Precio Manual:</Label>
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
                        Reparto de la Ganancia (S/. {finalProfit.toFixed(2)})
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
