'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces
export interface ContractTemplate {
  id: string;
  name: string;
  type: 'nda' | 'service_agreement' | 'manufacturing_contract' | 'licensing' | 'custom';
  description: string;
  content: string;
  variables: string[]; // Variables que se pueden personalizar
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface ContractVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: string[]; // Para tipo select
  defaultValue?: string;
  placeholder?: string;
}

export interface Contract {
  id: string;
  templateId: string;
  templateName: string;
  type: string;
  title: string;
  companyId: string;
  companyName: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled' | 'completed';
  content: string; // Contenido final del contrato
  variables: Record<string, any>; // Valores de las variables
  createdAt: string;
  sentAt?: string;
  signedAt?: string;
  expiresAt?: string;
  completedAt?: string;
  signatureUrl?: string;
  documentUrl?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  relatedOrderId?: string;
  relatedQuoteId?: string;
}

export interface Signature {
  id: string;
  contractId: string;
  signerName: string;
  signerEmail: string;
  signerRole: 'client' | 'company' | 'witness';
  signedAt: string;
  ipAddress: string;
  signatureData: string; // Base64 de la firma
  documentHash: string;
}

export interface LegalStats {
  totalContracts: number;
  activeContracts: number;
  pendingSignatures: number;
  expiringSoon: number;
  completedThisMonth: number;
  contractsByType: Record<string, number>;
  contractsByStatus: Record<string, number>;
  averageSigningTime: number; // en días
  complianceRate: number; // porcentaje
}

export interface LegalSettings {
  defaultExpirationDays: number;
  requireWitness: boolean;
  autoReminders: boolean;
  reminderDaysBefore: number[];
  digitalSignatureRequired: boolean;
  documentRetentionYears: number;
  companySignatory: {
    name: string;
    title: string;
    email: string;
  };
  legalNotices: {
    jurisdiction: string;
    governingLaw: string;
    disputeResolution: string;
  };
}

export interface ContractFilters {
  status?: string;
  type?: string;
  priority?: string;
  clientName?: string;
}

interface LegalContextType {
  // Estado
  contracts: Contract[];
  templates: ContractTemplate[];
  signatures: Signature[];
  stats: LegalStats;
  settings: LegalSettings;
  loading: boolean;
  
  // Funciones de contratos
  createContract: (templateId: string, data: Partial<Contract>) => Promise<string>;
  updateContract: (id: string, data: Partial<Contract>) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  duplicateContract: (id: string) => Promise<string>;
  sendContract: (id: string) => Promise<void>;
  signContract: (id: string, signatureData: string) => Promise<void>;
  cancelContract: (id: string, reason?: string) => Promise<void>;
  completeContract: (id: string) => Promise<void>;
  
  // Funciones de plantillas
  createTemplate: (data: Partial<ContractTemplate>) => Promise<string>;
  updateTemplate: (id: string, data: Partial<ContractTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string) => Promise<string>;
  
  // Funciones de búsqueda y filtrado
  getContractById: (id: string) => Promise<Contract | null>;
  getTemplateById: (id: string) => Promise<ContractTemplate | null>;
  searchContracts: (query: string) => Contract[];
  filterContracts: (filters: ContractFilters) => Contract[];
  
  // Funciones de documentos
  generateDocument: (contractId: string) => Promise<string>;
  downloadDocument: (contractId: string) => Promise<void>;
  previewContract: (templateId: string, variables: Record<string, any>) => string;
  
  // Funciones de notificaciones
  sendReminder: (contractId: string) => Promise<void>;
  getExpiringContracts: (days: number) => Contract[];
  
  // Funciones de estadísticas
  loadStats: () => Promise<void>;
  getComplianceReport: (startDate: string, endDate: string) => Promise<any>;
  
  // Funciones de configuración
  updateSettings: (settings: Partial<LegalSettings>) => Promise<void>;
  
  // Funciones de datos
  loadContracts: () => Promise<void>;
  loadTemplates: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const LegalContext = createContext<LegalContextType | undefined>(undefined);

export const useLegal = () => {
  const context = useContext(LegalContext);
  if (!context) {
    throw new Error('useLegal must be used within a LegalProvider');
  }
  return context;
};

interface LegalProviderProps {
  children: ReactNode;
}

export const LegalProvider: React.FC<LegalProviderProps> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [stats, setStats] = useState<LegalStats>({
    totalContracts: 0,
    activeContracts: 0,
    pendingSignatures: 0,
    expiringSoon: 0,
    completedThisMonth: 0,
    contractsByType: {},
    contractsByStatus: {},
    averageSigningTime: 0,
    complianceRate: 0
  });
  const [settings, setSettings] = useState<LegalSettings>({
    defaultExpirationDays: 30,
    requireWitness: false,
    autoReminders: true,
    reminderDaysBefore: [7, 3, 1],
    digitalSignatureRequired: true,
    documentRetentionYears: 7,
    companySignatory: {
      name: 'Director Legal',
      title: 'Representante Legal',
      email: 'legal@ddreams3d.com'
    },
    legalNotices: {
      jurisdiction: 'Lima, Perú',
      governingLaw: 'Leyes de la República del Perú',
      disputeResolution: 'Arbitraje en Lima, Perú'
    }
  });
  const [loading, setLoading] = useState(false);

  // Datos mock iniciales
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Plantillas mock
    const mockTemplates: ContractTemplate[] = [
      {
        id: 'template-1',
        name: 'Acuerdo de Confidencialidad (NDA)',
        type: 'nda',
        description: 'Acuerdo estándar de confidencialidad para proteger información sensible',
        content: `ACUERDO DE CONFIDENCIALIDAD

Entre {{COMPANY_NAME}} y {{CLIENT_NAME}}

Fecha: {{CONTRACT_DATE}}

1. INFORMACIÓN CONFIDENCIAL
Las partes acuerdan mantener en estricta confidencialidad toda información relacionada con:
- Diseños 3D y modelos
- Procesos de fabricación
- Información comercial
- {{ADDITIONAL_INFO}}

2. DURACIÓN
Este acuerdo tendrá una duración de {{DURATION_MONTHS}} meses.

3. OBLIGACIONES
{{OBLIGATIONS}}

4. PENALIDADES
En caso de incumplimiento, la parte infractora pagará una penalidad de {{PENALTY_AMOUNT}}.

Firmas:

_________________                    _________________
{{COMPANY_SIGNATORY}}               {{CLIENT_NAME}}
{{COMPANY_NAME}}                    Cliente`,
        variables: ['COMPANY_NAME', 'CLIENT_NAME', 'CONTRACT_DATE', 'ADDITIONAL_INFO', 'DURATION_MONTHS', 'OBLIGATIONS', 'PENALTY_AMOUNT', 'COMPANY_SIGNATORY'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        version: '1.2'
      },
      {
        id: 'template-2',
        name: 'Contrato de Servicios de Impresión 3D',
        type: 'service_agreement',
        description: 'Contrato para servicios de impresión 3D y modelado',
        content: `CONTRATO DE SERVICIOS DE IMPRESIÓN 3D

Entre {{COMPANY_NAME}} y {{CLIENT_NAME}}

1. SERVICIOS
{{COMPANY_NAME}} se compromete a proporcionar:
- {{SERVICES_DESCRIPTION}}
- Materiales: {{MATERIALS}}
- Tiempo de entrega: {{DELIVERY_TIME}}

2. PRECIO Y PAGO
Precio total: {{TOTAL_AMOUNT}}
Forma de pago: {{PAYMENT_TERMS}}

3. ESPECIFICACIONES TÉCNICAS
{{TECHNICAL_SPECS}}

4. GARANTÍAS
{{WARRANTIES}}

5. ENTREGA
Lugar de entrega: {{DELIVERY_ADDRESS}}
Fecha estimada: {{DELIVERY_DATE}}`,
        variables: ['COMPANY_NAME', 'CLIENT_NAME', 'SERVICES_DESCRIPTION', 'MATERIALS', 'DELIVERY_TIME', 'TOTAL_AMOUNT', 'PAYMENT_TERMS', 'TECHNICAL_SPECS', 'WARRANTIES', 'DELIVERY_ADDRESS', 'DELIVERY_DATE'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
        version: '1.1'
      },
      {
        id: 'template-3',
        name: 'Acuerdo de Licencia de Diseño',
        type: 'licensing',
        description: 'Licencia para uso de diseños 3D propietarios',
        content: `ACUERDO DE LICENCIA DE DISEÑO

1. LICENCIANTE: {{COMPANY_NAME}}
2. LICENCIATARIO: {{CLIENT_NAME}}

3. OBJETO DE LA LICENCIA
Se otorga licencia para usar los siguientes diseños:
{{LICENSED_DESIGNS}}

4. TIPO DE LICENCIA
Tipo: {{LICENSE_TYPE}}
Duración: {{LICENSE_DURATION}}
Territorio: {{TERRITORY}}

5. REGALÍAS
{{ROYALTY_TERMS}}

6. RESTRICCIONES
{{RESTRICTIONS}}`,
        variables: ['COMPANY_NAME', 'CLIENT_NAME', 'LICENSED_DESIGNS', 'LICENSE_TYPE', 'LICENSE_DURATION', 'TERRITORY', 'ROYALTY_TERMS', 'RESTRICTIONS'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z',
        version: '1.0'
      }
    ];

    // Contratos mock
    const mockContracts: Contract[] = [
      {
        id: 'contract-1',
        templateId: 'template-1',
        templateName: 'Acuerdo de Confidencialidad (NDA)',
        type: 'nda',
        title: 'NDA - TechCorp Solutions',
        companyId: 'company-1',
        companyName: 'Ddreams 3D',
        clientName: 'TechCorp Solutions',
        clientEmail: 'legal@techcorp.com',
        clientPhone: '+51 999 888 777',
        status: 'signed',
        content: 'Contenido del contrato procesado...',
        variables: {
          COMPANY_NAME: 'Ddreams 3D',
          CLIENT_NAME: 'TechCorp Solutions',
          CONTRACT_DATE: '2024-01-15',
          DURATION_MONTHS: '12',
          PENALTY_AMOUNT: 'S/ 10,000'
        },
        createdAt: '2024-01-15T10:00:00Z',
        sentAt: '2024-01-15T14:00:00Z',
        signedAt: '2024-01-16T09:30:00Z',
        expiresAt: '2025-01-15T23:59:59Z',
        priority: 'high',
        tags: ['confidencialidad', 'tecnología'],
        relatedQuoteId: 'quote-1'
      },
      {
        id: 'contract-2',
        templateId: 'template-2',
        templateName: 'Contrato de Servicios de Impresión 3D',
        type: 'service_agreement',
        title: 'Servicios 3D - MedDevice Inc',
        companyId: 'company-1',
        companyName: 'Ddreams 3D',
        clientName: 'MedDevice Inc',
        clientEmail: 'contracts@meddevice.com',
        status: 'sent',
        content: 'Contenido del contrato de servicios...',
        variables: {
          COMPANY_NAME: 'Ddreams 3D',
          CLIENT_NAME: 'MedDevice Inc',
          SERVICES_DESCRIPTION: 'Impresión 3D de prototipos médicos',
          TOTAL_AMOUNT: 'S/ 15,000',
          DELIVERY_TIME: '10 días hábiles'
        },
        createdAt: '2024-01-20T08:00:00Z',
        sentAt: '2024-01-20T16:00:00Z',
        expiresAt: '2024-02-20T23:59:59Z',
        priority: 'medium',
        tags: ['servicios', 'médico'],
        relatedOrderId: 'order-1'
      },
      {
        id: 'contract-3',
        templateId: 'template-1',
        templateName: 'Acuerdo de Confidencialidad (NDA)',
        type: 'nda',
        title: 'NDA - StartupXYZ',
        companyId: 'company-1',
        companyName: 'Ddreams 3D',
        clientName: 'StartupXYZ',
        clientEmail: 'info@startupxyz.com',
        status: 'draft',
        content: 'Borrador del contrato...',
        variables: {
          COMPANY_NAME: 'Ddreams 3D',
          CLIENT_NAME: 'StartupXYZ',
          CONTRACT_DATE: '2024-01-25',
          DURATION_MONTHS: '6'
        },
        createdAt: '2024-01-25T11:00:00Z',
        priority: 'low',
        tags: ['startup', 'confidencialidad']
      }
    ];

    setTemplates(mockTemplates);
    setContracts(mockContracts);
    calculateStats(mockContracts);
  };

  const calculateStats = (contractList: Contract[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newStats: LegalStats = {
      totalContracts: contractList.length,
      activeContracts: contractList.filter(c => ['sent', 'signed'].includes(c.status)).length,
      pendingSignatures: contractList.filter(c => c.status === 'sent').length,
      expiringSoon: contractList.filter(c => 
        c.expiresAt && new Date(c.expiresAt) <= nextWeek && c.status === 'signed'
      ).length,
      completedThisMonth: contractList.filter(c => 
        c.completedAt && new Date(c.completedAt) >= thisMonth
      ).length,
      contractsByType: contractList.reduce((acc, contract) => {
        acc[contract.type] = (acc[contract.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      contractsByStatus: contractList.reduce((acc, contract) => {
        acc[contract.status] = (acc[contract.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageSigningTime: 2.5, // Mock: días promedio
      complianceRate: 95.5 // Mock: porcentaje
    };

    setStats(newStats);
  };

  // Funciones de contratos
  const createContract = async (templateId: string, data: Partial<Contract>): Promise<string> => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error('Plantilla no encontrada');

    const newContract: Contract = {
      id: `contract-${Date.now()}`,
      templateId,
      templateName: template.name,
      type: template.type,
      title: data.title || `${template.name} - ${data.clientName}`,
      companyId: data.companyId || 'company-1',
      companyName: data.companyName || 'Ddreams 3D',
      clientName: data.clientName || '',
      clientEmail: data.clientEmail || '',
      clientPhone: data.clientPhone,
      status: 'draft',
      content: template.content,
      variables: data.variables || {},
      createdAt: new Date().toISOString(),
      priority: data.priority || 'medium',
      tags: data.tags || [],
      notes: data.notes,
      relatedOrderId: data.relatedOrderId,
      relatedQuoteId: data.relatedQuoteId,
      ...data
    };

    setContracts(prev => [...prev, newContract]);
    calculateStats([...contracts, newContract]);
    return newContract.id;
  };

  const updateContract = async (id: string, data: Partial<Contract>): Promise<void> => {
    setContracts(prev => prev.map(contract => 
      contract.id === id ? { ...contract, ...data } : contract
    ));
  };

  const deleteContract = async (id: string): Promise<void> => {
    setContracts(prev => prev.filter(contract => contract.id !== id));
  };

  const duplicateContract = async (id: string): Promise<string> => {
    const contract = contracts.find(c => c.id === id);
    if (!contract) throw new Error('Contrato no encontrado');

    const newContract: Contract = {
      ...contract,
      id: `contract-${Date.now()}`,
      title: `${contract.title} (Copia)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      sentAt: undefined,
      signedAt: undefined,
      completedAt: undefined,
      signatureUrl: undefined,
      documentUrl: undefined
    };

    setContracts(prev => [...prev, newContract]);
    return newContract.id;
  };

  const sendContract = async (id: string): Promise<void> => {
    await updateContract(id, {
      status: 'sent',
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + settings.defaultExpirationDays * 24 * 60 * 60 * 1000).toISOString()
    });
  };

  const signContract = async (id: string, signatureData: string): Promise<void> => {
    await updateContract(id, {
      status: 'signed',
      signedAt: new Date().toISOString(),
      signatureUrl: signatureData
    });
  };

  const cancelContract = async (id: string, reason?: string): Promise<void> => {
    await updateContract(id, {
      status: 'cancelled',
      notes: reason ? `Cancelado: ${reason}` : 'Contrato cancelado'
    });
  };

  const completeContract = async (id: string): Promise<void> => {
    await updateContract(id, {
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  // Funciones de plantillas
  const createTemplate = async (data: Partial<ContractTemplate>): Promise<string> => {
    const newTemplate: ContractTemplate = {
      id: `template-${Date.now()}`,
      name: data.name || 'Nueva Plantilla',
      type: data.type || 'custom',
      description: data.description || '',
      content: data.content || '',
      variables: data.variables || [],
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      ...data
    };

    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate.id;
  };

  const updateTemplate = async (id: string, data: Partial<ContractTemplate>): Promise<void> => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, ...data, updatedAt: new Date().toISOString() } : template
    ));
  };

  const deleteTemplate = async (id: string): Promise<void> => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const duplicateTemplate = async (id: string): Promise<string> => {
    const template = templates.find(t => t.id === id);
    if (!template) throw new Error('Plantilla no encontrada');

    const newTemplate: ContractTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0'
    };

    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate.id;
  };

  // Funciones de búsqueda
  const getContractById = async (id: string): Promise<Contract | null> => {
    return contracts.find(contract => contract.id === id) || null;
  };

  const getTemplateById = async (id: string): Promise<ContractTemplate | null> => {
    return templates.find(template => template.id === id) || null;
  };

  const searchContracts = (query: string): Contract[] => {
    const lowercaseQuery = query.toLowerCase();
    return contracts.filter(contract => 
      contract.title.toLowerCase().includes(lowercaseQuery) ||
      contract.clientName.toLowerCase().includes(lowercaseQuery) ||
      contract.clientEmail.toLowerCase().includes(lowercaseQuery) ||
      contract.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const filterContracts = (filters: ContractFilters): Contract[] => {
    return contracts.filter(contract => {
      if (filters.status && contract.status !== filters.status) return false;
      if (filters.type && contract.type !== filters.type) return false;
      if (filters.priority && contract.priority !== filters.priority) return false;
      if (filters.clientName && !contract.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) return false;
      return true;
    });
  };

  // Funciones de documentos
  const generateDocument = async (contractId: string): Promise<string> => {
    const contract = await getContractById(contractId);
    if (!contract) throw new Error('Contrato no encontrado');
    
    // Simular generación de documento
    return `document-${contractId}.pdf`;
  };

  const downloadDocument = async (contractId: string): Promise<void> => {
    const documentUrl = await generateDocument(contractId);
    // Simular descarga
  };

  const previewContract = (templateId: string, variables: Record<string, any>): string => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return '';

    let content = template.content;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
    });

    return content;
  };

  // Funciones de notificaciones
  const sendReminder = async (contractId: string): Promise<void> => {
    // Simular envío de recordatorio
  };

  const getExpiringContracts = (days: number): Contract[] => {
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return contracts.filter(contract => 
      contract.expiresAt && 
      new Date(contract.expiresAt) <= futureDate &&
      contract.status === 'signed'
    );
  };

  // Funciones de estadísticas
  const loadStats = async (): Promise<void> => {
    calculateStats(contracts);
  };

  const getComplianceReport = async (startDate: string, endDate: string): Promise<any> => {
    // Simular reporte de cumplimiento
    return {
      period: { startDate, endDate },
      totalContracts: contracts.length,
      completedOnTime: Math.floor(contracts.length * 0.95),
      averageCompletionTime: 2.3,
      complianceRate: 95.5
    };
  };

  // Funciones de configuración
  const updateSettings = async (newSettings: Partial<LegalSettings>): Promise<void> => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Funciones de datos
  const loadContracts = async (): Promise<void> => {
    setLoading(true);
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const loadTemplates = async (): Promise<void> => {
    setLoading(true);
    // Simular carga de plantillas
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  const refreshData = async (): Promise<void> => {
    await Promise.all([loadContracts(), loadTemplates(), loadStats()]);
  };

  const value: LegalContextType = {
    // Estado
    contracts,
    templates,
    signatures,
    stats,
    settings,
    loading,
    
    // Funciones de contratos
    createContract,
    updateContract,
    deleteContract,
    duplicateContract,
    sendContract,
    signContract,
    cancelContract,
    completeContract,
    
    // Funciones de plantillas
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    
    // Funciones de búsqueda
    getContractById,
    getTemplateById,
    searchContracts,
    filterContracts,
    
    // Funciones de documentos
    generateDocument,
    downloadDocument,
    previewContract,
    
    // Funciones de notificaciones
    sendReminder,
    getExpiringContracts,
    
    // Funciones de estadísticas
    loadStats,
    getComplianceReport,
    
    // Funciones de configuración
    updateSettings,
    
    // Funciones de datos
    loadContracts,
    loadTemplates,
    refreshData
  };

  return (
    <LegalContext.Provider value={value}>
      {children}
    </LegalContext.Provider>
  );
};