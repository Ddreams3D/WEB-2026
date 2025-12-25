'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentTerm {
  id: string;
  name: string;
  days: number;
  description: string;
  discountPercentage?: number; // Descuento por pago anticipado
}

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description: string;
  country: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  category: 'printing' | 'modeling' | 'post-processing' | 'shipping' | 'other';
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  companyAddress: string;
  companyTaxId: string;
  contactEmail: string;
  
  // Fechas
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  
  // Items y montos
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  
  // Estado y términos
  status: 'draft' | 'sent' | 'viewed' | 'overdue' | 'paid' | 'cancelled';
  paymentTerms: PaymentTerm;
  currency: 'USD' | 'EUR' | 'PEN' | 'MXN';
  
  // Referencias
  orderId?: string;
  quoteId?: string;
  
  // Notas y términos
  notes?: string;
  termsAndConditions?: string;
  
  // Metadatos
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'check' | 'cash' | 'other';
  reference: string;
  notes?: string;
  createdAt: string;
}

interface BillingSettings {
  companyInfo: {
    name: string;
    address: string;
    taxId: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
  };
  defaultPaymentTerms: PaymentTerm;
  defaultCurrency: 'USD' | 'EUR' | 'PEN' | 'MXN';
  taxRates: TaxRate[];
  invoiceTemplate: 'standard' | 'modern' | 'minimal';
  autoSendReminders: boolean;
  reminderDays: number[];
}

interface BillingStats {
  totalInvoiced: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  averagePaymentTime: number; // días
  invoiceCount: {
    draft: number;
    sent: number;
    paid: number;
    overdue: number;
  };
}

interface BillingContextType {
  // Estado
  invoices: Invoice[];
  payments: PaymentRecord[];
  settings: BillingSettings;
  stats: BillingStats;
  loading: boolean;
  
  // Funciones de facturación
  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt' | 'status'>) => Invoice;
  updateInvoice: (invoiceId: string, updates: Partial<Invoice>) => Promise<boolean>;
  deleteInvoice: (invoiceId: string) => Promise<boolean>;
  duplicateInvoice: (invoiceId: string) => Invoice;
  
  // Gestión de estado de facturas
  sendInvoice: (invoiceId: string) => Promise<boolean>;
  markAsPaid: (invoiceId: string, paymentData: Omit<PaymentRecord, 'id' | 'createdAt'>) => Promise<boolean>;
  markAsOverdue: (invoiceId: string) => Promise<boolean>;
  cancelInvoice: (invoiceId: string, reason: string) => Promise<boolean>;
  
  // Funciones de items
  addItemToInvoice: (invoiceId: string, item: Omit<InvoiceItem, 'id'>) => void;
  updateInvoiceItem: (invoiceId: string, itemId: string, updates: Partial<InvoiceItem>) => void;
  removeItemFromInvoice: (invoiceId: string, itemId: string) => void;
  
  // Cálculos
  calculateInvoiceTotals: (items: InvoiceItem[], discountAmount?: number) => {
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
  };
  
  // Datos y estadísticas
  loadInvoices: () => Promise<void>;
  loadPayments: () => Promise<void>;
  getInvoiceById: (id: string) => Invoice | null;
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[];
  getOverdueInvoices: () => Invoice[];
  calculateStats: () => BillingStats;
  
  // Configuración
  updateSettings: (newSettings: Partial<BillingSettings>) => Promise<boolean>;
  
  // Utilidades
  generateInvoiceNumber: () => string;
  exportInvoiceToPDF: (invoiceId: string) => Promise<Blob | null>;
  sendPaymentReminder: (invoiceId: string) => Promise<boolean>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

interface BillingProviderProps {
  children: ReactNode;
}

export const BillingProvider: React.FC<BillingProviderProps> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Configuración por defecto
  const [settings, setSettings] = useState<BillingSettings>({
    companyInfo: {
      name: 'Ddreams 3D',
      address: 'Av. Tecnología 123, Lima, Perú',
      taxId: '20123456789',
      phone: '+51 1 234-5678',
      email: 'facturacion@ddreams3d.com',
      website: 'www.ddreams3d.com'
    },
    defaultPaymentTerms: {
      id: 'net30',
      name: 'Net 30',
      days: 30,
      description: 'Pago a 30 días'
    },
    defaultCurrency: 'PEN',
    taxRates: [
      {
        id: 'igv',
        name: 'IGV',
        rate: 0.18,
        description: 'Impuesto General a las Ventas',
        country: 'PE'
      }
    ],
    invoiceTemplate: 'standard',
    autoSendReminders: true,
    reminderDays: [7, 3, 1] // días antes del vencimiento
  });

  const [stats, setStats] = useState<BillingStats>({
    totalInvoiced: 0,
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    averagePaymentTime: 0,
    invoiceCount: {
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0
    }
  });

  const generateInvoiceNumber = (): string => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = String(invoices.length + 1).padStart(4, '0');
    return `DD3D-${year}${month}-${sequence}`;
  };

  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt' | 'status'>): Invoice => {
    const newInvoice: Invoice = {
      ...data,
      id: `invoice-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = async (invoiceId: string, updates: Partial<Invoice>): Promise<boolean> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === invoiceId 
            ? { ...invoice, ...updates, updatedAt: new Date().toISOString() }
            : invoice
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error updating invoice:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (invoiceId: string): Promise<boolean> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const duplicateInvoice = (invoiceId: string): Invoice => {
    const originalInvoice = invoices.find(inv => inv.id === invoiceId);
    if (!originalInvoice) {
      throw new Error('Invoice not found');
    }
    
    const duplicatedInvoice: Invoice = {
      ...originalInvoice,
      id: `invoice-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      status: 'draft',
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + originalInvoice.paymentTerms.days * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setInvoices(prev => [...prev, duplicatedInvoice]);
    return duplicatedInvoice;
  };

  const sendInvoice = async (invoiceId: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simular envío de factura
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await updateInvoice(invoiceId, { status: 'sent' });
      return true;
    } catch (error) {
      console.error('Error sending invoice:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (invoiceId: string, paymentData: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Crear registro de pago
      const newPayment: PaymentRecord = {
        ...paymentData,
        id: `payment-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      setPayments(prev => [...prev, newPayment]);
      
      // Actualizar factura
      await updateInvoice(invoiceId, {
        status: 'paid',
        paidDate: paymentData.paymentDate
      });
      
      return true;
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAsOverdue = async (invoiceId: string): Promise<boolean> => {
    return await updateInvoice(invoiceId, { status: 'overdue' });
  };

  const cancelInvoice = async (invoiceId: string, reason: string): Promise<boolean> => {
    return await updateInvoice(invoiceId, {
      status: 'cancelled',
      notes: reason
    });
  };

  const addItemToInvoice = (invoiceId: string, item: Omit<InvoiceItem, 'id'>) => {
    const newItem: InvoiceItem = {
      ...item,
      id: `item-${Date.now()}`
    };
    
    setInvoices(prev => 
      prev.map(invoice => {
        if (invoice.id === invoiceId) {
          const updatedItems = [...invoice.items, newItem];
          const totals = calculateInvoiceTotals(updatedItems, invoice.discountAmount);
          
          return {
            ...invoice,
            items: updatedItems,
            ...totals,
            updatedAt: new Date().toISOString()
          };
        }
        return invoice;
      })
    );
  };

  const updateInvoiceItem = (invoiceId: string, itemId: string, updates: Partial<InvoiceItem>) => {
    setInvoices(prev => 
      prev.map(invoice => {
        if (invoice.id === invoiceId) {
          const updatedItems = invoice.items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          );
          const totals = calculateInvoiceTotals(updatedItems, invoice.discountAmount);
          
          return {
            ...invoice,
            items: updatedItems,
            ...totals,
            updatedAt: new Date().toISOString()
          };
        }
        return invoice;
      })
    );
  };

  const removeItemFromInvoice = (invoiceId: string, itemId: string) => {
    setInvoices(prev => 
      prev.map(invoice => {
        if (invoice.id === invoiceId) {
          const updatedItems = invoice.items.filter(item => item.id !== itemId);
          const totals = calculateInvoiceTotals(updatedItems, invoice.discountAmount);
          
          return {
            ...invoice,
            items: updatedItems,
            ...totals,
            updatedAt: new Date().toISOString()
          };
        }
        return invoice;
      })
    );
  };

  const calculateInvoiceTotals = (items: InvoiceItem[], discountAmount: number = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = items.reduce((sum, item) => sum + (item.totalPrice * item.taxRate), 0);
    const totalAmount = subtotal + taxAmount - discountAmount;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100
    };
  };

  const loadInvoices = async (): Promise<void> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockInvoices: Invoice[] = [
        {
          id: 'invoice-1',
          invoiceNumber: 'DD3D-202401-0001',
          companyId: '1',
          companyName: 'TechCorp Industries',
          companyAddress: 'Av. Industrial 456, Lima',
          companyTaxId: '20987654321',
          contactEmail: 'compras@techcorp.com',
          issueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              id: 'item-1',
              description: 'Impresión 3D - Prototipos Automotrices (5 piezas)',
              quantity: 5,
              unitPrice: 150.00,
              totalPrice: 750.00,
              taxRate: 0.18,
              category: 'printing'
            },
            {
              id: 'item-2',
              description: 'Post-procesamiento y acabado',
              quantity: 1,
              unitPrice: 200.00,
              totalPrice: 200.00,
              taxRate: 0.18,
              category: 'post-processing'
            }
          ],
          subtotal: 950.00,
          taxAmount: 171.00,
          discountAmount: 0,
          totalAmount: 1121.00,
          status: 'sent',
          paymentTerms: settings.defaultPaymentTerms,
          currency: 'PEN',
          orderId: 'order-1',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin-1'
        }
      ];
      
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async (): Promise<void> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock payments data
      const mockPayments: PaymentRecord[] = [];
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceById = (id: string): Invoice | null => {
    return invoices.find(invoice => invoice.id === id) || null;
  };

  const getInvoicesByStatus = (status: Invoice['status']): Invoice[] => {
    return invoices.filter(invoice => invoice.status === status);
  };

  const getOverdueInvoices = (): Invoice[] => {
    const now = new Date();
    return invoices.filter(invoice => {
      const dueDate = new Date(invoice.dueDate);
      return dueDate < now && invoice.status !== 'paid' && invoice.status !== 'cancelled';
    });
  };

  const calculateStats = (): BillingStats => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPending = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalOverdue = getOverdueInvoices().reduce((sum, inv) => sum + inv.totalAmount, 0);
    
    const paidInvoices = invoices.filter(inv => inv.status === 'paid' && inv.paidDate);
    const averagePaymentTime = paidInvoices.length > 0 
      ? paidInvoices.reduce((sum, inv) => {
          const issueDate = new Date(inv.issueDate);
          const paidDate = new Date(inv.paidDate!);
          const daysDiff = Math.floor((paidDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + daysDiff;
        }, 0) / paidInvoices.length
      : 0;
    
    return {
      totalInvoiced,
      totalPaid,
      totalPending,
      totalOverdue,
      averagePaymentTime,
      invoiceCount: {
        draft: getInvoicesByStatus('draft').length,
        sent: getInvoicesByStatus('sent').length,
        paid: getInvoicesByStatus('paid').length,
        overdue: getOverdueInvoices().length
      }
    };
  };

  const updateSettings = async (newSettings: Partial<BillingSettings>): Promise<boolean> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setSettings(prev => ({ ...prev, ...newSettings }));
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportInvoiceToPDF = async (invoiceId: string): Promise<Blob | null> => {
    try {
      setLoading(true);
      // Simular generación de PDF
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una implementación real, aquí se generaría el PDF
      const mockPDFContent = 'Mock PDF content';
      const blob = new Blob([mockPDFContent], { type: 'application/pdf' });
      
      return blob;
    } catch (error) {
      console.error('Error exporting invoice to PDF:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendPaymentReminder = async (invoiceId: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simular envío de recordatorio
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error sending payment reminder:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: BillingContextType = {
    invoices,
    payments,
    settings,
    stats: calculateStats(),
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    duplicateInvoice,
    sendInvoice,
    markAsPaid,
    markAsOverdue,
    cancelInvoice,
    addItemToInvoice,
    updateInvoiceItem,
    removeItemFromInvoice,
    calculateInvoiceTotals,
    loadInvoices,
    loadPayments,
    getInvoiceById,
    getInvoicesByStatus,
    getOverdueInvoices,
    calculateStats,
    updateSettings,
    generateInvoiceNumber,
    exportInvoiceToPDF,
    sendPaymentReminder
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};

export default BillingProvider;
export type { Invoice, InvoiceItem, PaymentTerm, TaxRate };