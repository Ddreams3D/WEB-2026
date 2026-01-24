import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  doc, 
  updateDoc,
  deleteField
} from 'firebase/firestore';
import { SlicingInboxItem, SlicingInboxCreateDTO } from '../types';

const COLLECTION = 'slicing_inbox';

export const SlicingInboxService = {
  /**
   * Crea una nueva entrada en el inbox.
   * Es idempotente: usa un fingerprint (hash) para evitar duplicados exactos en estado pendiente.
   */
  async createItem(data: SlicingInboxCreateDTO): Promise<string> {
    if (!db) throw new Error('Database not initialized');
    try {
      // 1. Generar Fingerprint Robusto
      let fingerprint = '';
      if (data.fileSize && data.fileTimestamp) {
         // Fingerprint v2: Robusto
         fingerprint = `${data.fileName}|${data.fileSize}|${data.fileTimestamp}|${data.grams}|${data.time}`;
      } else {
         // Fingerprint v1: Básico (Fallback)
         fingerprint = `${data.fileName}|${data.grams}|${data.time}|${data.machineType}`;
      }

      // 2. Check Idempotencia Real (Solo si no viene vinculado explícitamente)
      if (!data.linkedProductId) {
        const q = query(
          collection(db, COLLECTION),
          where('fingerprint', '==', fingerprint),
          where('status', '==', 'pending')
        );
        
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const existing = snapshot.docs[0].data() as SlicingInboxItem;
          const diffMinutes = (new Date().getTime() - new Date(existing.createdAt).getTime()) / 60000;
          
          if (diffMinutes < 30) {
            console.log(`[SlicingInbox] Ignorando duplicado exacto (Fingerprint): ${data.fileName}`);
            return snapshot.docs[0].id; 
          }
        }
      }

      // 3. Preparar nuevo item
      const newItem: any = {
        ...data,
        fingerprint,
        createdAt: new Date().toISOString(),
        status: data.linkedProductId ? 'linked' : 'pending'
      };

      if (data.linkedProductId) {
        newItem.linkedAt = new Date().toISOString();
        newItem.linkedBy = 'SlicerScript';
        
        // ACTUALIZAR PRODUCTO (Vinculación Automática)
        try {
            const productRef = doc(db, 'products', data.linkedProductId);
            await updateDoc(productRef, {
                productionData: {
                    lastSliced: new Date().toISOString(),
                    grams: data.grams,
                    printTimeMinutes: data.time,
                    machineType: data.machineType,
                    filamentType: data.filamentType,
                    fileName: data.fileName,
                    qualityProfile: data.qualityProfile,
                    printerModel: data.printerModel,
                    nozzleDiameter: data.nozzleDiameter,
                    totalLayers: data.totalLayers,
                    filamentLengthMeters: data.filamentLengthMeters,
                    multicolorChanges: data.multicolorChanges || 0
                }
            });
        } catch (prodErr) {
            console.error('[SlicingInbox] Error updating product:', prodErr);
            // No fallamos la creación del inbox item, pero logueamos el error
        }
      }

      const docRef = await addDoc(collection(db, COLLECTION), newItem);
      return docRef.id;

    } catch (error) {
      console.error('[SlicingInbox] Error creating item:', error);
      throw error;
    }
  },

  /**
   * Obtiene los items pendientes del inbox
   */
  async getPendingItems(): Promise<SlicingInboxItem[]> {
    if (!db) throw new Error('Database not initialized');
    const q = query(
      collection(db, COLLECTION),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SlicingInboxItem));
  },

  /**
   * Obtiene items vinculados recientemente (Historial)
   */
  async getLinkedItems(): Promise<SlicingInboxItem[]> {
    if (!db) throw new Error('Database not initialized');
    const q = query(
        collection(db, COLLECTION),
        where('status', '==', 'linked'),
        orderBy('linkedAt', 'desc'),
        limit(20)
    );
  
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as SlicingInboxItem));
  },

  /**
   * Marca un item como vinculado a un producto
   */
  async linkItemToProduct(inboxId: string, productId: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    const ref = doc(db, COLLECTION, inboxId);
    await updateDoc(ref, {
      status: 'linked',
      linkedProductId: productId,
      linkedAt: new Date().toISOString(),
      previousStatus: 'pending'
    });
  },

  /**
   * Deshace la vinculación (Undo)
   * Devuelve el item a estado 'pending' y borra la referencia al producto
   */
  async unlinkItem(inboxId: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    const ref = doc(db, COLLECTION, inboxId);
    await updateDoc(ref, {
        status: 'pending',
        linkedProductId: deleteField(),
        linkedAt: deleteField(),
        previousStatus: deleteField()
    });
  },

  /**
   * Ignora/Borra (Soft delete) un item
   */
  async ignoreItem(inboxId: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    const ref = doc(db, COLLECTION, inboxId);
    await updateDoc(ref, {
      status: 'ignored'
    });
  }
};
