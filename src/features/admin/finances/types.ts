export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'paid' | 'pending' | 'cancelled' | 'refunded';
export type PaymentMethod = 'yape' | 'plin' | 'transfer' | 'cash' | 'credit_card' | 'other';
export type TransactionSource = 'web' | 'landing_print' | 'landing_design' | 'whatsapp' | 'instagram' | 'referral' | 'manual' | 'other';

export interface FinanceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface FinanceRecord {
  id: string;
  date: string; // ISO date string
  type: TransactionType;
  title: string; // Short description/concept
  
  // Customer/Entity Info
  clientName?: string;
  clientContact?: string; // Email or Phone
  clientRuc?: string; // Optional for invoices

  // Financials
  amount: number;
  currency: 'PEN' | 'USD';
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  
  // Categorization
  category: string; // e.g., '3D Printing', 'Design', 'Material Cost', 'Marketing'
  source: TransactionSource;
  
  // Details
  items: FinanceItem[];
  notes?: string;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  relatedOrderId?: string; // If linked to an actual system order

  // New Fields for Tracking
  expenseType?: 'production' | 'fixed' | 'variable';
  paymentPhase?: 'deposit' | 'final' | 'full';

  // Sync Metadata
  _deleted?: boolean;
  _synced?: boolean;
  
  // Grouping
  groupId?: string; // For linking Deposit + Balance transactions

  // Bot Integration
  originInboxId?: string; // Deterministic ID from Telegram (chatId_messageId)

  // Production Snapshot (Immutable Cost Data)
  productionSnapshot?: ProductionSnapshot;
}

export type ProductionType = 'fdm' | 'resin' | 'cnc' | 'other';

export interface ProductionComponent {
  id: string;
  type: ProductionType;
  machineId?: string;
  machineName?: string;
  
  // Inputs
  machineTimeMinutes: number;
  materialWeightG: number;
  
  // Computed for this component
  computedEnergyCost: number;
  computedDepreciationCost: number;
  computedMaterialCost: number;
  
  // Rates applied
  appliedRates: {
    machineDepreciationRate: number;
    materialCostPerUnit: number;
    electricityPrice: number;
  };
}

export interface ProductionSnapshot {
  type: ProductionType | 'mixed';
  
  // User Inputs (Aggregated)
  machineTimeMinutes: number;
  humanTimeMinutes: number;
  materialWeightG: number; // Grams (FDM) or ml (Resin) - Sum of all
  
  // Computed Costs (Snapshot - Aggregated)
  computedEnergyCost: number;
  computedDepreciationCost: number;
  computedMaterialCost: number;
  computedLaborCost: number; // Usually 0 in cash flow, but tracked for efficiency
  
  // Configuration used at the moment of creation (Legacy / Primary)
  appliedRates: {
    electricityPrice: number;
    machineDepreciationRate: number;
    materialCostPerUnit: number; // Cost per Kg or L depending on type
    humanHourlyRate: number;
  };
  
  // Specific Machine Metadata (Legacy - kept for backward compatibility)
  machineId?: string;
  machineName?: string;
  
  // Multi-machine support
  components?: ProductionComponent[];
}

export interface MachineDefinition {
  id: string;
  name: string;
  type: 'fdm' | 'resin';
  purchaseCost: number;
  lifeYears: number;
  dailyHours: number;
  hourlyRate: number;
}

export interface FinanceSettings {
  electricityPrice: number; // PEN per kWh
  machineDepreciationRate: number; // Deprecated, kept for backward compatibility
  machineDepreciationRateFdm: number; // New: Specific for FDM
  machineDepreciationRateResin: number; // New: Specific for Resin
  materialCostFdm: number; // PEN per kg
  materialCostResin: number; // PEN per liter
  humanHourlyRate: number; // PEN per hour (Target)
  machines?: MachineDefinition[]; // New: List of specific machines
  updatedAt?: number; // Timestamp for sync
}

export interface InboxItem {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  currency: 'PEN' | 'USD';
  date: string;
  rawText: string;
  status: 'pending' | 'processed';
  createdAt: number;
  context?: 'personal' | 'company';
}

export type MonthlyBudgetItem = {
  id: string;
  label: string;
  amount: number;
  linkedCategory?: string;
};

export type MonthlyBudgets = Record<string, MonthlyBudgetItem[]>;

export const FINANCE_CATEGORIES = {
  income: [
    'Servicio de Impresión 3D',
    'Servicio de Diseño 3D',
    'Venta de Productos',
    'Consultoría',
    'Préstamos',
    'Otros Ingresos',
    'Ingreso desde Ddreams 3D'
  ],
  expense: {
    production: [
      'Materiales (Filamento, Resina)',
      'Insumos de Post-procesado',
      'Mantenimiento de Equipos',
      'Logística y Envíos (Directo)',
      'Empaquetado'
    ],
    fixed: [
      'Alquiler de Local',
      'Internet / Teléfono',
      'Luz / Agua',
      'Software / Suscripciones',
      'Sueldos Fijos',
      'Préstamos / Deudas',
      'Retiros del dueño / Finanzas personales'
    ],
    variable: [
      'Publicidad (Ads)',
      'Marketing / Branding',
      'Comisiones de Ventas',
      'Transporte / Movilidad',
      'Eventos / Ferias',
      'Otros Gastos Variables'
    ]
  }
};

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'yape', label: 'Yape' },
  { value: 'plin', label: 'Plin' },
  { value: 'transfer', label: 'Transferencia Bancaria' },
  { value: 'credit_card', label: 'Tarjeta de Crédito/Débito' },
  { value: 'cash', label: 'Efectivo' },
  { value: 'other', label: 'Otro' },
];

export const TRANSACTION_SOURCES: { value: TransactionSource; label: string }[] = [
  { value: 'web', label: 'Sitio Web Principal' },
  { value: 'landing_print', label: 'Landing Impresión 3D' },
  { value: 'landing_design', label: 'Landing Diseño' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'referral', label: 'Recomendación' },
  { value: 'manual', label: 'Registro Manual' },
  { value: 'other', label: 'Otro' },
];
