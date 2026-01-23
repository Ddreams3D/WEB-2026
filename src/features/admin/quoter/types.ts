export interface Quote {
    id?: string;
    createdAt: Date; // Will be converted to Timestamp in Firestore
    updatedAt: Date;
    
    // Searchable metadata
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    projectName: string;
    
    // Financials
    totalBilled: number;
    netPrice: number;
    taxAmount: number;
    currency: 'PEN';
    
    // Status
    status: 'draft' | 'sent' | 'accepted' | 'rejected';
    
    // The full snapshot of the calculation
    data: any; 
    
    // Settings snapshot (to preserve historical costs)
    settingsSnapshot: any;
}
