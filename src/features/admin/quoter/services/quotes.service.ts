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
        const machineDetails = quote.data.machineDetails || [];
        
        // Determine composite type
        const componentTypes = machineDetails.map((m: any) => m.type === 'resin' ? 'resin' : 'fdm');
        const uniqueTypes = new Set(componentTypes);
        const mainType = uniqueTypes.size === 1 ? Array.from(uniqueTypes)[0] : 'mixed';

        const productionSnapshot = {
             type: mainType as any,
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
             },
             components: machineDetails.map((m: any) => ({
                 id: uuidv4(),
                 type: (m.type === 'resin' ? 'resin' : 'fdm') as any,
                 machineId: m.machineId === 'default' ? '' : m.machineId,
                 machineName: m.machineName,
                 machineTimeMinutes: m.duration || 0,
                 materialWeightG: m.weight || 0
             }))
        };
        
        // 3. Create Records
        const finalAmount = details ? details.amount : quote.totalBilled;
        const totalSaleAmount = quote.totalBilled;
        const isDeposit = details?.paymentPhase === 'deposit';
        
        const title = isDeposit
            ? `Adelanto Cotización: ${quote.projectName}` 
            : `Venta Cotización: ${quote.projectName}`;

        const remainingBalance = isDeposit ? (totalSaleAmount - finalAmount) : 0;
        const groupId = isDeposit ? uuidv4() : undefined;

        // Record 1: The Payment (Deposit or Full)
        const paymentRecord: FinanceRecord = {
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
            
            // Deal Context
            totalSaleAmount: totalSaleAmount,
            remainingBalance: remainingBalance > 0 ? remainingBalance : undefined,
            depositAmount: isDeposit ? finalAmount : undefined,
            groupId: groupId,
            relatedQuoteId: quote.id,

            items: [
                {
                    id: uuidv4(),
                    description: `Servicio de Impresión 3D - ${quote.projectName} (${isDeposit ? 'Adelanto' : 'Total'})`,
                    quantity: 1,
                    unitPrice: finalAmount,
                    total: finalAmount
                }
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            paymentPhase: details?.paymentPhase || 'full',
            productionSnapshot: productionSnapshot
        };

        records.unshift(paymentRecord);

        // Record 2: The Pending Balance (if Deposit)
        if (isDeposit && remainingBalance > 0) {
             const pendingRecord: FinanceRecord = {
                id: uuidv4(),
                date: new Date().toISOString(), // Same date
                type: 'income',
                title: `Saldo Cotización: ${quote.projectName}`,
                clientName: details ? details.clientName : quote.clientName,
                clientContact: quote.clientPhone || quote.clientEmail,
                amount: remainingBalance,
                currency: quote.currency,
                status: 'pending',
                paymentMethod: 'transfer', // Default, will be updated when paid
                category: 'Servicio de Impresión 3D',
                source: 'manual',
                
                // Deal Context
                totalSaleAmount: totalSaleAmount,
                groupId: groupId, // Link to deposit

                items: [
                    {
                        id: uuidv4(),
                        description: `Saldo Pendiente - ${quote.projectName}`,
                        quantity: 1,
                        unitPrice: remainingBalance,
                        total: remainingBalance
                    }
                ],
                createdAt: Date.now() + 1, // Ensure it's slightly newer/distinct
                updatedAt: Date.now(),
                paymentPhase: 'final',
                productionSnapshot: undefined // Costs are attached to the deposit/main record
            };
            records.unshift(pendingRecord);
        }

        // 4. Save
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

        // 5. Update Quote
        if (quote.id) {
            // Only mark as fully accepted if paid in full, or maybe we want to mark it accepted regardless?
            // Let's mark as accepted so it doesn't stay in draft/sent
            await this.updateStatus(quote.id, 'accepted');
        }
    }
};
