export type QuoteStatus = 'pending' | 'approved' | 'rejected' | 'draft';

export interface QuoteItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  // Extended fields for compatibility
  fileName?: string;
  notes?: string;
  material?: string;
  complexity?: 'low' | 'medium' | 'high';
  printTime?: number;
}

export interface MaterialPricing {
  id: string;
  name: string;
  pricePerGram: number;
}

export interface Quote {
  id: string;
  title: string;
  description?: string;
  status: QuoteStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: QuoteItem[];
  total: number;
  currency: string;
  // Extended fields
  subtotal?: number;
  tax?: number;
  discount?: number;
  validUntil?: string | Date;
}

export interface QuoteDetail extends Quote {
  notes?: string;
  number?: string;
  clientInfo?: {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
}

// Added alias for QuoteItem to satisfy QuoteItemsList
export interface QuoteItemDetail extends QuoteItem {
  description?: string;
}
