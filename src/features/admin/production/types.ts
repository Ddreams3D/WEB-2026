export interface SlicingInboxItem {
  id: string;
  name: string;
  fileName: string;
  grams: number;
  time: number;
  machineType: 'FDM' | 'RESIN';
  filamentType?: string;
  qualityProfile?: string; // Nuevo: 0.12, 0.16, Standard, etc.
  
  // Metadatos Archivo
  fileSize?: number; 
  fileTimestamp?: number; 
  multicolorChanges?: number;
  
  // Nuevos campos de v17 (Detalles de Impresión)
  printerModel?: string;      // e.g. "Bambu Lab X1 Carbon"
  nozzleDiameter?: string;    // e.g. "0.4"
  totalLayers?: number;       // e.g. 543
  filamentLengthMeters?: number; // e.g. 12.5

  // Observabilidad
  scriptVersion?: string; // Nuevo: Para tracking de bugs en clientes
  
  createdAt: string;
  status: 'pending' | 'linked' | 'ignored';
  linkedProductId?: string;
  
  // Historial de Vinculación (Undo Support)
  linkedAt?: string;
  linkedBy?: string; // "Admin" por ahora
  previousStatus?: 'pending' | 'ignored';

  source: 'slicer-hook' | 'telegram-manual';
  fingerprint?: string; 
}

export type SlicingInboxCreateDTO = Omit<SlicingInboxItem, 'id' | 'createdAt' | 'status' | 'linkedAt' | 'linkedBy' | 'previousStatus'>;
