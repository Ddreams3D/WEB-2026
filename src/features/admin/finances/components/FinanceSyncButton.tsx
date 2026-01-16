import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { SyncService } from '../services/syncService';
import { FinanceRecord } from '../types';
import { toast } from 'sonner';

interface FinanceSyncButtonProps {
  records: FinanceRecord[];
  onSyncComplete: (newRecords: FinanceRecord[]) => void;
  storageKey: string;
}

export function FinanceSyncButton({ records, onSyncComplete, storageKey }: FinanceSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const getBackupFileName = () => {
    return storageKey === 'finance_records' 
      ? 'company_finances_backup_v1.json' 
      : 'personal_finances_backup_v1.json';
  };

  const handleSync = async () => {
    setIsSyncing(true);
    const toastId = toast.loading('Sincronizando con la nube...');

    try {
      const fileName = getBackupFileName();
      const mergedRecords = await SyncService.syncFinanceData(records, fileName);
      
      onSyncComplete(mergedRecords);
      setLastSync(new Date());
      
      toast.success('Sincronización completada', { id: toastId });
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Error al sincronizar. Verifica tu conexión.', { id: toastId });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSync} 
      disabled={isSyncing}
      className="gap-2 border-dashed"
    >
      {isSyncing ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        <Cloud className="w-4 h-4" />
      )}
      {isSyncing ? 'Sincronizando...' : 'Sincronizar Nube'}
    </Button>
  );
}
