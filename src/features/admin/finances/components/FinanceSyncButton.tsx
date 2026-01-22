import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { SyncService } from '../services/syncService';
import { FinanceRecord, MonthlyBudgets, FinanceSettings } from '../types';
import { toast } from 'sonner';

interface FinanceSyncButtonProps {
  records: FinanceRecord[];
  onSyncComplete: (newRecords: FinanceRecord[]) => void;
  storageKey: string;
  budgets?: MonthlyBudgets;
  onBudgetsSyncComplete?: (newBudgets: MonthlyBudgets) => void;
  settings?: FinanceSettings;
  onSettingsSyncComplete?: (newSettings: FinanceSettings) => void;
}

export function FinanceSyncButton({
  records,
  onSyncComplete,
  storageKey,
  budgets,
  onBudgetsSyncComplete,
  settings,
  onSettingsSyncComplete
}: FinanceSyncButtonProps) {
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
      
      if (storageKey === 'personal_finance_records' && budgets && onBudgetsSyncComplete) {
        const mergedBudgets = await SyncService.syncMonthlyBudgets(
          budgets,
          'personal_finances_budget_v1.json'
        );
        onBudgetsSyncComplete(mergedBudgets);
      }

      // Sync Settings if provided (Global Settings)
      if (settings && onSettingsSyncComplete) {
        const mergedSettings = await SyncService.syncFinanceSettings(
          settings,
          'finance_global_settings_v1.json'
        );
        onSettingsSyncComplete(mergedSettings);
      }

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
