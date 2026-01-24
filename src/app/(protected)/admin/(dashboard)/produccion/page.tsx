import { SlicingInbox } from '@/features/admin/production/components/SlicingInbox';

export default function ProductionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Producción</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inbox de Slicing */}
        <div className="lg:col-span-1">
          <SlicingInbox />
        </div>

        {/* Placeholder para futuras métricas o control de máquinas */}
        <div className="lg:col-span-1 border rounded-xl p-8 flex items-center justify-center text-muted-foreground border-dashed bg-muted/10">
          <div className="text-center">
            <p>Panel de Control de Máquinas</p>
            <p className="text-sm opacity-70">(Próximamente)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
