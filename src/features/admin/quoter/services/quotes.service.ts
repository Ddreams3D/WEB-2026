import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    doc, 
    getDocs, 
    query, 
    orderBy, 
    Timestamp,
    serverTimestamp,
    limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Quote } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { FinanceRecord, PaymentMethod } from '../../finances/types';

const COLLECTION = 'quotes';

export const QuotesService = {
    async saveQuote(quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = await addDoc(collection(db, COLLECTION), {
            ...quote,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: quote.status || 'draft'
        });

        return docRef.id;
    },

    async getRecentQuotes(limitCount = 20): Promise<Quote[]> {
        if (!db) return [];

        try {
            const q = query(
                collection(db, COLLECTION), 
                orderBy('createdAt', 'desc'), 
                limit(limitCount)
            );
            
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Convert Firestore Timestamps back to JS Dates
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as Quote;
            });
        } catch (error) {
            console.error('Error fetching quotes:', error);
            return [];
        }
    },

    async updateStatus(id: string, status: Quote['status']): Promise<void> {
        if (!db) throw new Error('Firestore not initialized');
        const ref = doc(db, COLLECTION, id);
        await updateDoc(ref, { 
            status,
            updatedAt: serverTimestamp()
        });
    },

    async deleteQuote(id: string): Promise<void> {
        if (!db) throw new Error('Firestore not initialized');
        const ref = doc(db, COLLECTION, id);
        await deleteDoc(ref);
    },

    async convertToSale(quote: Quote, details?: { 
        clientName: string, 
        paymentMethod: PaymentMethod, 
        amount: number,
        paymentPhase: 'full' | 'deposit'
    }): Promise<void> {
        const STORAGE_KEY = 'finance_records';
        
        // 1. Get current records
        let records: FinanceRecord[] = [];
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) records = JSON.parse(raw);
        } catch (e) {
            console.error("Error reading finance records", e);
        }

        // 2. Prepare Production Snapshot
        const costs = quote.data.calculatedCosts || {};
        
        // 3. Create Record
        const finalAmount = details ? details.amount : quote.totalBilled;
        const title = details?.paymentPhase === 'deposit' 
            ? `Adelanto Cotización: ${quote.projectName}` 
            : `Venta Cotización: ${quote.projectName}`;

        const newRecord: FinanceRecord = {
            id: uuidv4(),
            date: new Date().toISOString(),
            type: 'income',
            title: title,
            clientName: details ? details.clientName : quote.clientName,
            clientContact: quote.clientPhone || quote.clientEmail,
            amount: finalAmount,
            currency: quote.currency,
            status: 'paid',
            paymentMethod: details ? details.paymentMethod : 'transfer', 
            category: 'Servicio de Impresión 3D',
            source: 'manual',
            items: [
                {
                    id: uuidv4(),
                    description: `Servicio de Impresión 3D - ${quote.projectName}`,
                    quantity: 1,
                    unitPrice: finalAmount,
                    total: finalAmount
                }
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            paymentPhase: details?.paymentPhase || 'full',
            productionSnapshot: {
                 type: 'mixed',
                 machineTimeMinutes: quote.data.totalMinutes || 0,
                 humanTimeMinutes: quote.data.humanMinutes || 0,
                 materialWeightG: quote.data.materialWeight || 0,
                 computedEnergyCost: costs.electricity || 0,
                 computedDepreciationCost: costs.depreciation || 0,
                 computedMaterialCost: costs.material || 0,
                 computedLaborCost: costs.laborValue || 0,
                 appliedRates: {
                     electricityPrice: 0,
                     machineDepreciationRate: 0,
                     materialCostPerUnit: 0,
                     humanHourlyRate: 0
                 }
            }
        };

        // 4. Save
        records.unshift(newRecord);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

        // 5. Update Quote
        if (quote.id) {
            // Only mark as fully accepted if paid in full, or maybe we want to mark it accepted regardless?
            // Let's mark as accepted so it doesn't stay in draft/sent
            await this.updateStatus(quote.id, 'accepted');
        }
    }
};
