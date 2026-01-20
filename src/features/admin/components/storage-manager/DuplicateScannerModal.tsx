import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DuplicateGroup } from '../../hooks/useStorageAudit';
import { Loader2, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface DuplicateScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    duplicates: DuplicateGroup[];
    scanning: boolean;
    progress: string | null;
    onScan: () => void;
    onClean: () => void;
}

export function DuplicateScannerModal({
    isOpen,
    onClose,
    duplicates,
    scanning,
    progress,
    onScan,
    onClean
}: DuplicateScannerModalProps) {
    const totalWaste = duplicates.reduce((acc, g) => acc + (g.size * (g.files.length - 1)), 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Auditoría de Duplicados en Nube
                    </DialogTitle>
                    <DialogDescription>
                        Escanea tu almacenamiento en la nube para encontrar archivos idénticos en diferentes carpetas.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 flex flex-col gap-4 py-4">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg border">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Estado del Escaneo</span>
                            <span className="text-xs text-muted-foreground">
                                {scanning ? progress : duplicates.length > 0 ? 'Escaneo completado' : 'Listo para escanear'}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-destructive">
                                {formatBytes(totalWaste)}
                            </span>
                            <p className="text-xs text-muted-foreground">Desperdicio Total</p>
                        </div>
                    </div>

                    {/* Results List */}
                    <ScrollArea className="flex-1 border rounded-md p-4">
                        {scanning && (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p>{progress}</p>
                            </div>
                        )}

                        {!scanning && duplicates.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                                <p>No se encontraron duplicados. ¡Todo limpio!</p>
                            </div>
                        )}

                        {!scanning && duplicates.map((group, idx) => (
                            <div key={group.hash} className="mb-6 last:mb-0 border-b pb-4 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        Grupo #{idx + 1} ({formatBytes(group.size)})
                                    </h4>
                                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                                        {group.files.length} copias
                                    </span>
                                </div>
                                <div className="space-y-2 pl-6">
                                    {group.files.map((file, i) => (
                                        <div key={file.path} className={`text-xs p-2 rounded flex items-center justify-between ${i === 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted'}`}>
                                            <div className="flex flex-col">
                                                <span className={`font-mono ${i === 0 ? 'text-green-700 font-bold' : ''}`}>
                                                    {file.path}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(file.timeCreated).toLocaleString()}
                                                </span>
                                            </div>
                                            {i === 0 && (
                                                <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">
                                                    SE MANTIENE
                                                </span>
                                            )}
                                            {i > 0 && (
                                                <span className="text-[10px] text-destructive">
                                                    SE ELIMINARÁ
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={scanning}>
                        Cerrar
                    </Button>
                    {duplicates.length === 0 ? (
                        <Button onClick={onScan} disabled={scanning}>
                            {scanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Iniciar Escaneo
                        </Button>
                    ) : (
                        <div className="flex gap-2 w-full justify-end">
                            <Button variant="outline" onClick={onScan} disabled={scanning}>
                                Re-escanear
                            </Button>
                            <Button variant="destructive" onClick={onClean} disabled={scanning}>
                                {scanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Limpiar y Unificar ({duplicates.length})
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
