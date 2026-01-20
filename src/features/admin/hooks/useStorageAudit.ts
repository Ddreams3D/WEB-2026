import { useState } from 'react';
import { ref, listAll, getMetadata, StorageReference, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { toast } from 'sonner';

import { STORAGE_PATHS } from '@/shared/constants/storage-paths';
import { processAuditResults, DuplicateGroup } from './auditUtils';

// Re-export types for component use
export type { DuplicateGroup } from './auditUtils';

export function useStorageAudit() {
    const [scanning, setScanning] = useState(false);
    const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
    const [progress, setProgress] = useState<string | null>(null);

    const scanDuplicates = async () => {
        if (!storage) return;
        const firebaseStorage = storage;
        
        setScanning(true);
        setDuplicates([]);
        setProgress('Iniciando escaneo...');

        try {
            const filesByHash = new Map<string, DuplicateGroup>();
            // Scan both canonical images and legacy roots to find duplicates across the system
            const foldersToProcess = [
                STORAGE_PATHS.IMAGES, // Canonical root
                'products', 'services', 'projects', 'seasonal', 'categories', 'ui' // Legacy roots
            ];
            
            // Helper for recursion
            const processFolder = async (path: string) => {
                const folderRef = ref(firebaseStorage, path);
                let result;
                try {
                    result = await listAll(folderRef);
                } catch (e) {
                    return;
                }

                for (const fileRef of result.items) {
                    try {
                        const meta = await getMetadata(fileRef);
                        const hash = meta.md5Hash;
                        if (!hash) continue;

                        if (!filesByHash.has(hash)) {
                            filesByHash.set(hash, {
                                hash,
                                size: meta.size,
                                files: []
                            });
                        }
                        
                        filesByHash.get(hash)?.files.push({
                            path: fileRef.fullPath,
                            name: fileRef.name,
                            timeCreated: meta.timeCreated,
                            ref: fileRef
                        });
                    } catch (err) {
                        console.error('Error processing file:', fileRef.fullPath);
                    }
                }

                for (const subFolder of result.prefixes) {
                    await processFolder(subFolder.fullPath);
                }
            };

            for (const root of foldersToProcess) {
                setProgress(`Escaneando: ${root}...`);
                await processFolder(root);
            }

            const results = processAuditResults(filesByHash);
            setDuplicates(results);
            
            if (results.length === 0) {
                toast.success('¡Increíble! No se encontraron duplicados.');
            } else {
                const totalWaste = results.reduce((acc, g) => acc + (g.size * (g.files.length - 1)), 0);
                const wasteMB = (totalWaste / (1024 * 1024)).toFixed(2);
                toast.warning(`Se encontraron ${results.length} grupos de duplicados. Desperdicio: ~${wasteMB} MB`);
            }

        } catch (error) {
            console.error('Audit failed:', error);
            toast.error('Error durante el escaneo.');
        } finally {
            setScanning(false);
            setProgress(null);
        }
    };

    const cleanDuplicates = async (updateReferences: (oldUrl: string, newUrl: string) => Promise<number>) => {
        if (!duplicates.length || !storage) return;
        setScanning(true);
        
        try {
            let groupsFixed = 0;
            const totalGroups = duplicates.length;

            for (let i = 0; i < totalGroups; i++) {
                const group = duplicates[i];
                // Winner is always index 0 due to sort in scanDuplicates
                const winner = group.files[0];
                const losers = group.files.slice(1);

                setProgress(`Procesando grupo ${i + 1}/${totalGroups}: Manteniendo ${winner.name}`);

                const winnerUrl = await getDownloadURL(winner.ref);

                for (const loser of losers) {
                    try {
                        const loserUrl = await getDownloadURL(loser.ref);
                        // Update DB references
                        await updateReferences(loserUrl, winnerUrl);
                        // Delete
                        await deleteObject(loser.ref);
                    } catch (e) {
                        console.error(`Failed to process duplicate ${loser.path}`, e);
                    }
                }
                groupsFixed++;
            }
            
            toast.success(`Limpieza completada. ${groupsFixed} grupos unificados.`);
            setDuplicates([]); // Clear results
        } catch (e) {
             console.error(e);
             toast.error('Error durante la limpieza.');
        } finally {
             setScanning(false);
             setProgress(null);
        }
    };

    return {
        scanning,
        progress,
        duplicates,
        scanDuplicates,
        cleanDuplicates
    };
}
