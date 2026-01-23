'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FinanceSettings, MachineDefinition } from '../../finances/types';
import { Clock, Scale, User, DollarSign, AlertCircle, Plus, Trash2, Printer } from 'lucide-react';

interface QuoterFormProps {
  onCalculate: (data: any) => void;
  settings: FinanceSettings;
}

interface MachineEntry {
  id: string;
  machineId: string;
  days: string;
  hours: string;
  minutes: string;
  weight: string;
}

export function QuoterForm({ onCalculate, settings }: QuoterFormProps) {
  // Machine Lines
  const [machines, setMachines] = useState<MachineEntry[]>([
    { id: '1', machineId: 'default', days: '', hours: '', minutes: '', weight: '' }
  ]);

  // Human Time
  const [humanDays, setHumanDays] = useState('');
  const [humanHours, setHumanHours] = useState('');
  const [humanMinutes, setHumanMinutes] = useState('');
  
  const [additionalCost, setAdditionalCost] = useState(''); // Extra hardware etc.
  const [failureRate, setFailureRate] = useState('0'); // percentage
  
  // Available machines from settings
  const availableMachines = settings.machines || [];

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
    // Aggregate machine data
    let totalMinutes = 0;
    let totalWeight = 0;
    
    // We need to pass detailed machine usage to results
    const machineDetails = machines.map(m => {
      const days = parseFloat(m.days) || 0;
      const hours = parseFloat(m.hours) || 0;
      const minutes = parseFloat(m.minutes) || 0;
      const weight = parseFloat(m.weight) || 0;
      
      const duration = (days * 24 * 60) + (hours * 60) + minutes;
      
      totalMinutes += duration;
      totalWeight += weight;

      // Find selected machine definition
      const machineDef = availableMachines.find(am => am.id === m.machineId);

      return {
        machineId: m.machineId,
        machineName: machineDef?.name || 'Máquina Genérica',
        type: machineDef?.type || 'fdm',
        duration,
        weight,
        hourlyRate: machineDef?.hourlyRate // If available
      };
    });

    const hDays = parseFloat(humanDays) || 0;
    const hHours = parseFloat(humanHours) || 0;
    const hMinutes = parseFloat(humanMinutes) || 0;
    const humanTotalMinutes = (hDays * 24 * 60) + (hHours * 60) + hMinutes;

    const extraCost = parseFloat(additionalCost) || 0;
    const risk = parseFloat(failureRate) || 0;

    if (totalMinutes > 0 || totalWeight > 0) {
      onCalculate({
        totalMinutes, // Aggregated for quick checks
        materialWeight: totalWeight, // Aggregated
        humanMinutes: humanTotalMinutes,
        extraCost,
        failureRate: risk,
        machineDetails // Detailed breakdown
      });
    }
  }, [machines, humanDays, humanHours, humanMinutes, additionalCost, failureRate, availableMachines]);

  return (
    <div className="space-y-6">
      
      {/* Machine Lines */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
                <Printer className="w-3.5 h-3.5 text-muted-foreground" />
                Máquinas y Materiales
            </Label>
            <Button variant="ghost" size="sm" onClick={addMachineLine} className="h-6 text-xs gap-1">
                <Plus className="w-3 h-3" /> Agregar Máquina
            </Button>
        </div>

        <div className="space-y-3">
            {machines.map((machine, index) => (
                <div key={machine.id} className="bg-muted/30 p-3 rounded-lg border border-border/50 space-y-3 relative group">
                    {machines.length > 1 && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                            onClick={() => removeMachineLine(machine.id)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                    
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Máquina</Label>
                        <Select 
                            value={machine.machineId} 
                            onValueChange={(v) => updateMachineLine(machine.id, 'machineId', v)}
                        >
                            <SelectTrigger className="h-8">
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

                    <div className="grid grid-cols-2 gap-3">
                        {/* Time Inputs */}
                        <div className="space-y-1.5">
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
                                        className="h-8 pr-5 text-xs"
                                    />
                                    <span className="absolute right-1.5 top-2 text-[10px] text-muted-foreground">d</span>
                                </div>
                                <div className="relative flex-1">
                                    <Input 
                                        type="number" 
                                        placeholder="0" 
                                        value={machine.hours}
                                        onChange={(e) => updateMachineLine(machine.id, 'hours', e.target.value)}
                                        min="0"
                                        className="h-8 pr-5 text-xs"
                                    />
                                    <span className="absolute right-1.5 top-2 text-[10px] text-muted-foreground">h</span>
                                </div>
                                <div className="relative flex-1">
                                    <Input 
                                        type="number" 
                                        placeholder="0" 
                                        value={machine.minutes}
                                        onChange={(e) => updateMachineLine(machine.id, 'minutes', e.target.value)}
                                        min="0"
                                        max="59"
                                        className="h-8 pr-5 text-xs"
                                    />
                                    <span className="absolute right-1.5 top-2 text-[10px] text-muted-foreground">m</span>
                                </div>
                            </div>
                        </div>

                        {/* Weight Input */}
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <Scale className="w-3 h-3" /> Peso (g/ml)
                            </Label>
                            <Input 
                                type="number" 
                                placeholder="0" 
                                value={machine.weight}
                                onChange={(e) => updateMachineLine(machine.id, 'weight', e.target.value)}
                                min="0"
                                className="h-8 text-xs"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="space-y-2">
          <Label className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              Mano de Obra
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                type="number" 
                placeholder="0" 
                value={humanDays}
                onChange={(e) => setHumanDays(e.target.value)}
                min="0"
              />
              <span className="absolute right-2 top-2 text-xs text-muted-foreground">d</span>
            </div>
            <div className="relative flex-1">
              <Input 
                type="number" 
                placeholder="0" 
                value={humanHours}
                onChange={(e) => setHumanHours(e.target.value)}
                min="0"
              />
              <span className="absolute right-2 top-2 text-xs text-muted-foreground">h</span>
            </div>
            <div className="relative flex-1">
              <Input 
                type="number" 
                placeholder="0" 
                value={humanMinutes}
                onChange={(e) => setHumanMinutes(e.target.value)}
                min="0"
                max="59"
              />
              <span className="absolute right-2 top-2 text-xs text-muted-foreground">m</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">Post-procesado, slicer, pintura</p>
      </div>

      <div className="space-y-2">
          <Label className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              Costos Extra
          </Label>
          <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">S/.</span>
              <Input 
              type="number" 
              placeholder="0.00" 
              className="pl-7"
              value={additionalCost}
              onChange={(e) => setAdditionalCost(e.target.value)}
              min="0"
              />
          </div>
          <p className="text-[10px] text-muted-foreground">Hardware, lija, pintura, etc.</p>
      </div>
      
      <div className="space-y-2 border-t pt-4">
          <Label className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <AlertCircle className="w-3.5 h-3.5" />
              Tasa de Fallo / Riesgo (%)
          </Label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
                <Input 
                type="number" 
                placeholder="0" 
                value={failureRate}
                onChange={(e) => setFailureRate(e.target.value)}
                min="0"
                max="100"
                className="border-amber-200 focus:ring-amber-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">%</span>
            </div>
            <div className="text-xs text-muted-foreground max-w-[180px]">
                Aumenta materiales y tiempo de máquina para cubrir impresiones fallidas.
            </div>
          </div>
      </div>

      <div className="pt-2">
          <Button className="w-full" variant="secondary" onClick={() => {
              setMachines([{ id: '1', machineId: 'default', days: '', hours: '', minutes: '', weight: '' }]);
              setHumanDays('');
              setHumanHours('');
              setHumanMinutes('');
              setAdditionalCost('');
              setFailureRate('0');
              onCalculate(null);
          }}>
              Limpiar Formulario
          </Button>
      </div>
    </div>
  );
}
