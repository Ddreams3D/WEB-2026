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
}

export const FINANCE_CATEGORIES = {
  income: [
    'Servicio de Impresión 3D',
    'Servicio de Diseño 3D',
    'Venta de Productos',
    'Consultoría',
    'Préstamos',
    'Otros Ingresos'
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
      'Préstamos / Deudas'
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
