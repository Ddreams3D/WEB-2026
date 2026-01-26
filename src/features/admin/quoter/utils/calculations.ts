import { FinanceSettings } from '@/features/admin/finances/types';

export interface ProductionCostData {
  totalMinutes: number;
  materialWeight: number;
  humanMinutes: number;
  extraCost: number;
  failureRate: number;
  quantity?: number;
  isProductionMode?: boolean;
  machineDetails?: {
    machineId: string;
    machineName: string;
    type: 'fdm' | 'resin';
    duration: number;
    weight: number;
    unitDuration?: number;
    unitWeight?: number;
    hourlyRate?: number;
  }[];
  laborDetails?: {
    generalMinutes: number;
    paintingMinutes: number;
    modelingMinutes: number;
  };
  consumablesCost?: number;
}

export interface CostBreakdown {
  electricity: number;
  depreciation: number;
  material: number;
  extra: number;
  consumables: number;
  startupFee: number;
  totalDirect: number;
  laborValue: number;
  riskFactor: number;
  totalMachineMinutes: number;
  unitTotalCost: number;
}

export interface PricingResult {
  costs: CostBreakdown;
  suggestedNetPrice: number;
  minViablePrice: number;
  recommendedPrice: number;
}

export function calculateQuoteCosts(data: ProductionCostData, settings: FinanceSettings): CostBreakdown {
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
      
      // Fallback if hourlyRate not provided in details
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
  } else {
    // Fallback if no machine details (e.g. manual simple entry from product editor)
    // Assume FDM as default or infer from data if available
    // For now, we might not have details if just grams/time are passed.
    // We'll approximate using default FDM settings if details are missing but time/weight exist.
    if (data.totalMinutes > 0 || data.materialWeight > 0) {
        const riskAdjustedDuration = data.totalMinutes * riskFactor;
        const hours = riskAdjustedDuration / 60;
        totalRiskAdjustedMachineMinutes = riskAdjustedDuration;

        // Default to FDM behavior
        const powerKw = 0.2; 
        totalElectricityCost += (powerKw * settings.electricityPrice) * hours;

        // Average FDM depreciation
        let avgDepreciation = 0;
        if (settings.machines) {
            const fdms = settings.machines.filter(m => m.type === 'fdm');
            if (fdms.length > 0) {
                avgDepreciation = fdms.reduce((acc, m) => acc + m.hourlyRate, 0) / fdms.length;
            }
        }
        totalDepreciationCost += avgDepreciation * hours;

        const materialUnitCost = settings.filamentCostPerKg;
        const riskAdjustedWeight = data.materialWeight * riskFactor;
        totalMaterialCost += (riskAdjustedWeight / 1000) * materialUnitCost;
    }
  }

  // 2. Labor
  let laborValue = 0;
  if (data.laborDetails) {
      const generalHours = (data.laborDetails.generalMinutes * riskFactor) / 60;
      const paintingHours = (data.laborDetails.paintingMinutes * riskFactor) / 60;
      const modelingHours = (data.laborDetails.modelingMinutes * riskFactor) / 60; 

      laborValue += generalHours * settings.humanHourlyRate;
      laborValue += paintingHours * (settings.humanHourlyRatePainting || settings.humanHourlyRate * 1.5);
      laborValue += modelingHours * (settings.humanHourlyRateModeling || settings.humanHourlyRate * 2.5);
  } else {
      const riskAdjustedHumanMinutes = data.humanMinutes * riskFactor;
      const humanHours = riskAdjustedHumanMinutes / 60;
      laborValue = humanHours * settings.humanHourlyRate;
  }
  
  const consumables = data.consumablesCost || 0;
  const startupFee = settings.startupFee || 0; 

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
    unitTotalCost
  };
}

export function calculateSuggestedPrice(costs: CostBreakdown, desiredMargin: number): number {
    const totalBaseCost = costs.totalDirect + costs.laborValue;
    // Prevent division by zero or negative
    if (desiredMargin >= 100) return totalBaseCost * 2; // Fallback
    return totalBaseCost / (1 - (desiredMargin / 100));
}
