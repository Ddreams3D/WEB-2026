import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinanceSettings } from '../hooks/useFinanceSettings';
import { Settings, Save, RefreshCw, Calculator, ChevronDown, ChevronUp, Info, Plus, Trash2, Printer, Edit } from 'lucide-react';
import { FinanceSettings, MachineDefinition } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

interface FinanceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FinanceSettings;
  onUpdate: (newSettings: FinanceSettings) => void;
}

export function FinanceSettingsModal({ isOpen, onClose, settings, onUpdate }: FinanceSettingsModalProps) {
  const [localSettings, setLocalSettings] = React.useState<FinanceSettings>(settings);
  const [showDepreciationCalc, setShowDepreciationCalc] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("fdm");
  
  // Depreciation Calculator State
  const [calcName, setCalcName] = React.useState<string>('');
  const [calcCost, setCalcCost] = React.useState<string>('');
  const [calcYears, setCalcYears] = React.useState<string>('3');
  const [calcDailyHours, setCalcDailyHours] = React.useState<string>('8');
  const [editingId, setEditingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [settings, isOpen]);

  const handleChange = (field: keyof FinanceSettings, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateRate = (cost: number, years: number, hours: number) => {
    if (cost > 0 && years > 0 && hours > 0) {
      const totalHours = years * 365 * hours;
      return cost / totalHours;
    }
    return 0;
  };

  const handleEditMachine = (machine: MachineDefinition) => {
    setEditingId(machine.id);
    setCalcName(machine.name);
    setCalcCost(machine.purchaseCost.toString());
    setCalcYears(machine.lifeYears.toString());
    setCalcDailyHours(machine.dailyHours.toString());
    setShowDepreciationCalc(true);
    // Optional: Switch tab if needed, though usually user clicks from correct tab
    // setActiveTab(machine.type); 
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCalcName('');
    setCalcCost('');
    setCalcYears('3');
    setCalcDailyHours('8');
    setShowDepreciationCalc(false);
  };

  const handleSaveMachine = () => {
    const cost = parseFloat(calcCost) || 0;
    const years = parseFloat(calcYears) || 0;
    const hours = parseFloat(calcDailyHours) || 0;
    const rate = calculateRate(cost, years, hours);
    
    if (rate > 0 && calcName.trim()) {
      if (editingId) {
        // Update existing
        setLocalSettings(prev => ({
          ...prev,
          machines: (prev.machines || []).map(m => 
            m.id === editingId 
            ? { 
                ...m, 
                name: calcName.trim(), 
                purchaseCost: cost, 
                lifeYears: years, 
                dailyHours: hours, 
                hourlyRate: parseFloat(rate.toFixed(4)),
                // Ensure type remains consistent or updates if we want to allow type change
                type: activeTab as 'fdm' | 'resin' 
              } 
            : m
          )
        }));
      } else {
        // Create new
        const newMachine: MachineDefinition = {
          id: uuidv4(),
          name: calcName.trim(),
          type: activeTab as 'fdm' | 'resin',
          purchaseCost: cost,
          lifeYears: years,
          dailyHours: hours,
          hourlyRate: parseFloat(rate.toFixed(4))
        };
  
        setLocalSettings(prev => ({
          ...prev,
          machines: [...(prev.machines || []), newMachine]
        }));
      }

      // Reset form
      handleCancelEdit();
    }
  };

  const handleDeleteMachine = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      machines: (prev.machines || []).filter(m => m.id !== id)
    }));
  };
  
  const applyPreset = (years: number, hours: number) => {
    setCalcYears(years.toString());
    setCalcDailyHours(hours.toString());
  };

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  const fdmMachines = (localSettings.machines || []).filter(m => m.type === 'fdm');
  const resinMachines = (localSettings.machines || []).filter(m => m.type === 'resin');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" /> Configuración de Costos
          </DialogTitle>
          <DialogDescription>
            Gestiona tus máquinas y costos globales.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">Costos Globales</h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="electricity">Energía (S/. / kWh)</Label>
                <div className="relative">
                  <Input 
                    id="electricity" 
                    type="number" 
                    step="0.01"
                    value={localSettings.electricityPrice}
                    onChange={(e) => handleChange('electricityPrice', e.target.value)}
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">S/.</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="human">Tu Meta por Hora (Mano de Obra)</Label>
                <div className="relative">
                  <Input 
                    id="human" 
                    type="number" 
                    step="0.01"
                    value={localSettings.humanHourlyRate}
                    onChange={(e) => handleChange('humanHourlyRate', e.target.value)}
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">S/.</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Cuánto quieres ganar TÚ por cada hora de trabajo manual (pintado, diseño, etc).
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">Gestión de Impresoras</h4>
            
            <Tabs defaultValue="fdm" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fdm">FDM (Filamento)</TabsTrigger>
                <TabsTrigger value="resin">SLA (Resina)</TabsTrigger>
              </TabsList>
              
              {/* FDM CONFIGURATION */}
              <TabsContent value="fdm" className="space-y-4 mt-4">
                <div className="space-y-2">
                    <Label>Costo Material (S/. / kg)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={localSettings.materialCostFdm}
                        onChange={(e) => handleChange('materialCostFdm', e.target.value)}
                        className="pl-8"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">S/.</span>
                    </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Mis Impresoras FDM</Label>
                  {fdmMachines.length === 0 ? (
                    <div className="text-center py-4 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                      No tienes impresoras FDM registradas.
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {fdmMachines.map(machine => (
                        <div key={machine.id} className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                              <Printer className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{machine.name}</div>
                              <div className="text-[10px] text-muted-foreground">
                                {machine.lifeYears} años @ {machine.dailyHours}h/día
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-bold text-sm text-emerald-600">S/. {machine.hourlyRate.toFixed(2)}/h</div>
                              <div className="text-[10px] text-muted-foreground">Depreciación</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-500/10" onClick={() => handleEditMachine(machine)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteMachine(machine.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* RESIN CONFIGURATION */}
              <TabsContent value="resin" className="space-y-4 mt-4">
                 <div className="space-y-2">
                    <Label>Costo Resina (S/. / Litro)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={localSettings.materialCostResin}
                        onChange={(e) => handleChange('materialCostResin', e.target.value)}
                        className="pl-8"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">S/.</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Mis Impresoras Resina</Label>
                  {resinMachines.length === 0 ? (
                    <div className="text-center py-4 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                      No tienes impresoras SLA registradas.
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {resinMachines.map(machine => (
                        <div key={machine.id} className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                              <Printer className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{machine.name}</div>
                              <div className="text-[10px] text-muted-foreground">
                                {machine.lifeYears} años @ {machine.dailyHours}h/día
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-bold text-sm text-purple-600">S/. {machine.hourlyRate.toFixed(2)}/h</div>
                              <div className="text-[10px] text-muted-foreground">Depreciación</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-500/10" onClick={() => handleEditMachine(machine)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteMachine(machine.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* ADD MACHINE CALCULATOR */}
            <div className="bg-muted/30 border rounded-lg p-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex justify-between items-center mb-2"
                onClick={() => {
                    if (editingId) {
                        handleCancelEdit();
                    } else {
                        setShowDepreciationCalc(!showDepreciationCalc);
                    }
                }}
              >
                <span className="flex items-center gap-2 font-semibold">
                  {editingId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
                  {editingId ? 'Editar Impresora' : `Agregar Nueva Impresora (${activeTab === 'fdm' ? 'FDM' : 'Resina'})`}
                </span>
                {showDepreciationCalc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              
              {showDepreciationCalc && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Nombre / Modelo</Label>
                      <Input 
                        className="h-8 text-xs" 
                        placeholder={activeTab === 'fdm' ? 'Ej: Bambu Lab X1C' : 'Ej: Saturn 3 Ultra'}
                        value={calcName}
                        onChange={(e) => setCalcName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <Label className="text-[10px] text-muted-foreground">Costo (S/.)</Label>
                      <Input 
                        type="number" 
                        className="h-8 text-xs" 
                        placeholder="0.00"
                        value={calcCost}
                        onChange={(e) => setCalcCost(e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="text-[10px] text-muted-foreground">Vida Útil (Años)</Label>
                      <Input 
                        type="number" 
                        className="h-8 text-xs" 
                        value={calcYears}
                        onChange={(e) => setCalcYears(e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="text-[10px] text-muted-foreground">Uso Diario (h)</Label>
                      <Input 
                        type="number" 
                        className="h-8 text-xs" 
                        value={calcDailyHours}
                        onChange={(e) => setCalcDailyHours(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estimaciones (Presets)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" className="h-auto py-2 flex-col gap-1 text-[10px]" onClick={() => applyPreset(3, 4)}>
                        <span className="font-bold">Hobby</span>
                        <span className="text-muted-foreground opacity-70">3a @ 4h</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-auto py-2 flex-col gap-1 text-[10px]" onClick={() => applyPreset(2, 8)}>
                        <span className="font-bold">Negocio</span>
                        <span className="text-muted-foreground opacity-70">2a @ 8h</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-auto py-2 flex-col gap-1 text-[10px]" onClick={() => applyPreset(1.5, 16)}>
                        <span className="font-bold">Granja</span>
                        <span className="text-muted-foreground opacity-70">1.5a @ 16h</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {editingId && (
                        <Button 
                            variant="outline"
                            size="sm" 
                            className="w-1/3"
                            onClick={handleCancelEdit}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button 
                        size="sm" 
                        className={cn("bg-primary text-primary-foreground shadow-sm", editingId ? "w-2/3" : "w-full")}
                        onClick={handleSaveMachine}
                        disabled={!calcName || !calcCost}
                    >
                        {editingId ? 'Actualizar Impresora' : 'Guardar Impresora'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> Guardar Configuración
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
