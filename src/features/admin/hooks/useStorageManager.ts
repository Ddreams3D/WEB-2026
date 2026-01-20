import { useState, useEffect, useCallback } from 'react';
import { 
    ref, 
    getDownloadURL, 
    StorageReference,
    list,
    listAll, // Import listAll ensures we get everything without pagination limits
    uploadBytes,
    deleteObject,
    getMetadata
} from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useToast } from '@/components/ui/ToastManager';
import { toast } from 'sonner';
import { StorageAuditService } from '@/services/storage-audit.service';
import { ServiceLandingsService } from '@/services/service-landings.service';
import { ProductService } from '@/services/product.service';
import { ServiceService } from '@/services/service.service';
import { ProjectService } from '@/services/project.service';
import * as SeasonalService from '@/services/seasonal.service';
import { STORAGE_PATHS } from '@/shared/constants/storage-paths';

export interface StorageFile {
    type: 'file';
    name: string;
    fullPath: string;
    url: string;
    size: number;
    contentType: string;
    timeCreated: string;
    ref: StorageReference;
    isUsed?: boolean; // New field to indicate usage
}

export interface StorageFolder {
    type: 'folder';
    name: string;
    fullPath: string;
    ref: StorageReference;
}

export type StorageItem = StorageFile | StorageFolder;
export type ViewMode = 'grid' | 'list';

export const SECTIONS = [
    { id: 'root', label: 'Raíz (Sistema)', path: '' },
    { id: 'images', label: 'Todo (Images)', path: `${STORAGE_PATHS.IMAGES}/` },
    { id: 'finances', label: 'Finanzas', path: `${STORAGE_PATHS.FINANCES}/` },
    { id: 'orders', label: 'Pedidos', path: `${STORAGE_PATHS.ORDERS}/` },
    { id: 'landings', label: 'Landings', path: `${STORAGE_PATHS.LANDINGS}/` },
    { id: 'catalogo', label: 'Catálogo', path: `${STORAGE_PATHS.PRODUCTS}/` },
    { id: 'seasonal', label: 'Temporadas', path: `${STORAGE_PATHS.SEASONAL}/` },
    { id: 'servicios', label: 'Servicios', path: `${STORAGE_PATHS.SERVICES}/` },
    { id: 'proyectos', label: 'Proyectos', path: `${STORAGE_PATHS.PROJECTS}/` },
    { id: 'categories', label: 'Categorías', path: `${STORAGE_PATHS.CATEGORIES}/` },
    { id: 'soportes', label: 'Soportes', path: `${STORAGE_PATHS.SOPORTES}/` },
    { id: 'ui', label: 'Interfaz (UI)', path: `${STORAGE_PATHS.UI}/` },
    { id: 'blog', label: 'Blog', path: `${STORAGE_PATHS.BLOG}/` },
    { id: 'home', label: 'Home / Web', path: `${STORAGE_PATHS.HOME}/` },
    { id: 'company', label: 'Company', path: `${STORAGE_PATHS.COMPANY}/` },
];

export interface StorageProgress {
    phase: 'scanning' | 'moving' | 'updating_db' | 'completed';
    current: number;
    total: number;
    message?: string;
}

export function useStorageManager() {
    const [items, setItems] = useState<StorageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState<StorageProgress | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    const [currentPath, setCurrentPath] = useState(SECTIONS[0].path);
    const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
    const [usedUrls, setUsedUrls] = useState<Set<string>>(new Set());
    const { showSuccess, showError, showInfo } = useToast();

    // Load used URLs on mount to identify active images
    useEffect(() => {
        StorageAuditService.getUsedImageUrls().then(urls => {
            console.log(`[StorageManager] Found ${urls.size} active images.`);
            setUsedUrls(urls);
        });
    }, []);

    const updateReferences = async (oldUrl: string, newUrl: string) => {
        let totalUpdated = 0;
        totalUpdated += await ServiceLandingsService.updateImageReference(oldUrl, newUrl);
        totalUpdated += await ProductService.updateImageReference(oldUrl, newUrl);
        totalUpdated += await ServiceService.updateImageReference(oldUrl, newUrl);
        totalUpdated += await ProjectService.updateImageReference(oldUrl, newUrl);
        totalUpdated += await SeasonalService.updateImageReference(oldUrl, newUrl);
        return totalUpdated;
    };

    // Load files from Storage
    const loadFiles = useCallback(async (path: string, token?: string) => {
        try {
            setLoading(true);
            
            const storageInstance = storage;
            if (!storageInstance) {
                console.warn('Firebase Storage not initialized');
                setItems([]);
                return;
            }

            const storageRef = ref(storageInstance, path);
            
            // List all items (files) and prefixes (folders)
            // Pagination implemented for scalability
            const result = await list(storageRef, { 
                maxResults: 50, // Smaller chunks for faster initial load
                pageToken: token 
            });
            
            setNextPageToken(result.nextPageToken);
            
            // Process Folders (only on first page)
            const folderItems: StorageFolder[] = !token ? result.prefixes.map(prefix => ({
                type: 'folder',
                name: prefix.name,
                fullPath: prefix.fullPath,
                ref: prefix
            })) : [];

            // Process Files
            const filePromises = result.items.map(async (itemRef) => {
                // Skip .keep files used for folder creation
                if (itemRef.name === '.keep') return null;

                try {
                    const url = await getDownloadURL(itemRef);
                    // Use lightweight metadata fetch if possible, or cache it
                    const metadata = await import('firebase/storage').then(m => m.getMetadata(itemRef));
                    
                    return {
                        type: 'file',
                        name: itemRef.name,
                        fullPath: itemRef.fullPath,
                        url,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        timeCreated: metadata.timeCreated,
                        ref: itemRef
                    } as StorageFile;
                } catch (error) {
                    console.error(`Error loading file ${itemRef.name}:`, error);
                    return null;
                }
            });
            
            const loadedFiles = (await Promise.all(filePromises)).filter(Boolean) as StorageFile[];
            
            if (token) {
                setItems(prev => [...prev, ...loadedFiles]);
            } else {
                setItems([...folderItems, ...loadedFiles]);
            }
        } catch (error) {
            console.error('Error loading files:', error);
            showError('Error al cargar los archivos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setNextPageToken(undefined); // Reset token on path change
        loadFiles(currentPath);
    }, [currentPath, loadFiles]);

    const loadMore = () => {
        if (nextPageToken) {
            loadFiles(currentPath, nextPageToken);
        }
    };

    const handleSectionChange = (sectionId: string) => {
        const section = SECTIONS.find(s => s.id === sectionId);
        if (section) {
            setActiveSection(sectionId);
            setCurrentPath(section.path);
            setSelectedItem(null);
        }
    };

    const handleFolderClick = (folderName: string) => {
        const newPath = currentPath.endsWith('/') 
            ? `${currentPath}${folderName}/` 
            : `${currentPath}/${folderName}/`;
        setCurrentPath(newPath);
    };

    const handleNavigateUp = () => {
        if (!currentPath) return;
        const parts = currentPath.split('/').filter(Boolean);
        parts.pop();
        const newPath = parts.length > 0 ? parts.join('/') + '/' : '';
        setCurrentPath(newPath);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showSuccess('URL copiada al portapapeles');
    };

    // Helper to check if file is used (exposed to consumers)
    const isFileUsed = useCallback((url: string) => usedUrls.has(url), [usedUrls]);

    const uploadFile = async (file: File) => {
        if (!storage || !currentPath) return;

        // 1. Sanitize Name & Compress
        const sanitizeFileName = (name: string): string => {
            return name
                .toLowerCase()
                .replace(/[^a-z0-9.]/g, '-') // Replace special chars/spaces with dashes
                .replace(/-+/g, '-')         // Collapse multiple dashes
                .replace(/^-|-$/g, '');      // Trim dashes
        };

        let fileToUpload = file;
        
        // Compress if image (client-side optimization)
        if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
            try {
                const { compressImage } = await import('@/lib/image-compression');
                toast.loading('Optimizando imagen...', { id: 'compression' });
                fileToUpload = await compressImage(file, {
                    maxWidth: 1920,
                    quality: 0.85,
                    type: 'image/webp'
                });
                toast.dismiss('compression');
                
                if (fileToUpload.size < file.size) {
                    const saved = ((file.size - fileToUpload.size) / 1024).toFixed(0);
                    toast.success(`Imagen optimizada: Ahorrado ${saved}KB`);
                }
            } catch (e) {
                console.warn('Compression failed, using original', e);
                toast.dismiss('compression');
            }
        }

        let fileName = sanitizeFileName(fileToUpload.name);
        
        // 2. Check for Duplicates / Name Collision
        const fileRef = ref(storage, `${currentPath}${fileName}`);
        
        try {
            await getMetadata(fileRef);
            // If we are here, file exists!
            // Append timestamp to avoid overwrite (Scalability Rule #1)
            const ext = fileName.split('.').pop();
            const name = fileName.substring(0, fileName.lastIndexOf('.'));
            fileName = `${name}-${Date.now()}.${ext}`;
            
            showInfo('Nombre duplicado', `El archivo se renombró automáticamente a ${fileName}`);
        } catch (error: any) {
            // If object not found, good to go.
            if (error.code !== 'storage/object-not-found') {
                console.error('Error checking file existence:', error);
                // Continue anyway, worst case is overwrite if permission issue
            }
        }

        // 3. Upload
        const finalRef = ref(storage, `${currentPath}${fileName}`);
        
        try {
            setLoading(true);
            await uploadBytes(finalRef, fileToUpload, {
                cacheControl: 'public, max-age=31536000, immutable', // Cache for 1 year (CDN Optimization)
                contentType: fileToUpload.type
            });
            
            showSuccess('Archivo subido', `Guardado en: ${currentPath}`);
            await loadFiles(currentPath);
        } catch (error) {
            console.error('Upload failed:', error);
            showError('Error al subir el archivo');
        } finally {
            setLoading(false);
        }
    };

    const migrateStructure = async () => {
        const storageInstance = storage;
        if (!storageInstance) return;
        
        const MIGRATIONS = [
            { from: 'products', to: STORAGE_PATHS.PRODUCTS },
            { from: 'services', to: STORAGE_PATHS.SERVICES },
            { from: 'projects', to: STORAGE_PATHS.PROJECTS },
            { from: 'seasonal', to: STORAGE_PATHS.SEASONAL },
            { from: 'categories', to: STORAGE_PATHS.CATEGORIES },
            { from: 'ui', to: STORAGE_PATHS.UI }, // Be careful if 'ui' already exists or overlaps
        ];

        const processFolder = async (sourcePath: string, targetPath: string) => {
            const sourceRef = ref(storageInstance, sourcePath);
            let result;
            try {
                result = await listAll(sourceRef);
            } catch (e) {
                console.log(`Folder ${sourcePath} not found or empty.`);
                return;
            }

            // Move files
            for (const fileRef of result.items) {
                try {
                    const url = await getDownloadURL(fileRef);
                    // Create minimal StorageFile for moveFile
                    const fileItem: StorageFile = {
                        type: 'file',
                        name: fileRef.name,
                        fullPath: fileRef.fullPath,
                        url,
                        size: 0, // Not needed for move
                        contentType: 'application/octet-stream', // Fallback
                        timeCreated: '',
                        ref: fileRef
                    };
                    
                    // moveFile expects targetPath to end with /
                    const targetFolder = targetPath.endsWith('/') ? targetPath : targetPath + '/';
                    
                    // Check if file already exists in target (Avoid duplication/overwrite loop)
                    const targetFileRef = ref(storageInstance, `${targetFolder}${fileRef.name}`);
                    try {
                        await getMetadata(targetFileRef);
                        // If exists, we just update references and delete the old one (Deduplication)
                        console.log(`File ${fileRef.name} already exists in target. Merging...`);
                        
                        // Update references to point to the existing target file
                        const targetUrl = await getDownloadURL(targetFileRef);
                        await updateReferences(fileItem.url, targetUrl);
                        
                        // Delete the old duplicate
                        await deleteObject(fileRef);
                        continue; // Skip moveFile since we handled it
                    } catch (e: any) {
                        // File doesn't exist (object-not-found), proceed with move
                        if (e.code !== 'storage/object-not-found') throw e;
                    }

                    await moveFile(fileItem, targetFolder);
                } catch (err) {
                    console.error(`Failed to move ${fileRef.fullPath}`, err);
                }
            }

            // Recurse folders
            for (const folderRef of result.prefixes) {
                const subSource = folderRef.fullPath; // e.g., products/cat1
                const subTarget = `${targetPath}/${folderRef.name}`; // e.g., images/catalogo/cat1
                await processFolder(subSource, subTarget);
            }
        };

        try {
            setLoading(true);
            toast.info('Iniciando migración de estructura...');
            
            let processedCount = 0;
            const totalMigrations = MIGRATIONS.filter(m => m.from !== m.to).length;

            for (const mig of MIGRATIONS) {
                // Skip if source == target (already migrated)
                if (mig.from === mig.to) continue;
                
                setProgress({
                    phase: 'moving',
                    current: processedCount + 1,
                    total: totalMigrations,
                    message: `Migrando ${mig.from} a ${mig.to}...`
                });
                
                await processFolder(mig.from, mig.to);
                processedCount++;
            }
            
            toast.success('Migración completada. Verifica las nuevas carpetas.');
            await loadFiles(currentPath);
        } catch (error) {
            console.error('Migration failed:', error);
            toast.error('Error durante la migración');
        } finally {
            setLoading(false);
            setProgress(null);
        }
    };

    const createFolder = async (folderName: string) => {
        if (!folderName || !storage) return;
        try {
            setLoading(true);
            // Create a dummy file to establish the folder
            // Use .keep convention
            const folderRef = ref(storage, `${currentPath}${folderName}/.keep`);
            const emptyBlob = new Blob([], { type: 'application/x-empty' });
            await uploadBytes(folderRef, emptyBlob);
            
            showSuccess('Carpeta creada');
            await loadFiles(currentPath);
        } catch (error) {
            console.error('Error creating folder:', error);
            showError('Error al crear la carpeta');
        } finally {
            setLoading(false);
        }
    };

    const moveFile = async (file: StorageFile, targetPath: string) => {
        if (!storage) return;
        try {
            setLoading(true);
            
            // 1. Get the file content
            const response = await fetch(file.url);
            const blob = await response.blob();
            
            // 2. Upload to new location
            const newRef = ref(storage, `${targetPath}${file.name}`);
            const uploadResult = await uploadBytes(newRef, blob, { contentType: file.contentType });
            const newUrl = await getDownloadURL(uploadResult.ref);
            
            // 3. Update References in DB
            const totalUpdated = await updateReferences(file.url, newUrl);

            if (totalUpdated > 0) {
                toast.success(`Enlace actualizado en ${totalUpdated} lugar(es).`);
            }

            // 4. Delete old file
            await deleteObject(file.ref);
            
            toast.success('Archivo movido y referencias actualizadas');
            await loadFiles(currentPath);
            setSelectedItem(null);
        } catch (error) {
            console.error('Error moving file:', error);
            toast.error('Error al mover el archivo');
        } finally {
            setLoading(false);
        }
    };

    const deleteFile = async (item: StorageItem) => {
        if (!storage) return;

        // PROTECTED FOLDERS GUARD
        // Removed 'assets' from protected roots to allow cleanup of empty folders
        const PROTECTED_ROOTS = [STORAGE_PATHS.IMAGES, STORAGE_PATHS.FINANCES, STORAGE_PATHS.ORDERS]; 
        const isProtected = PROTECTED_ROOTS.some(root => 
            item.fullPath === root || 
            item.fullPath === root + '/' ||
            // Protect specific official subfolders in images
            (item.fullPath.startsWith(`${STORAGE_PATHS.IMAGES}/`) && [
                STORAGE_PATHS.LANDINGS, STORAGE_PATHS.PRODUCTS, STORAGE_PATHS.SEASONAL, 
                STORAGE_PATHS.SERVICES, STORAGE_PATHS.PROJECTS, STORAGE_PATHS.CATEGORIES, 
                STORAGE_PATHS.HOME, STORAGE_PATHS.COMPANY, STORAGE_PATHS.UI, 'images/recuperado'
            ].some(protectedPath => item.fullPath === protectedPath || item.fullPath === protectedPath + '/'))
        );

        if (item.type === 'folder' && isProtected) {
            toast.error('Acción Bloqueada: Esta carpeta es vital para el sistema.');
            return;
        }

        try {
            setLoading(true);

            if (item.type === 'folder') {
                // Recursive delete for folders
                const folderRef = ref(storage, item.fullPath);
                const res = await listAll(folderRef);
                
                // Delete all files in the folder
                const deletePromises = res.items.map(fileRef => deleteObject(fileRef));
                await Promise.all(deletePromises);

                // Recursively delete subfolders
                for (const subFolderRef of res.prefixes) {
                    await deleteFile({
                        type: 'folder',
                        name: subFolderRef.name,
                        fullPath: subFolderRef.fullPath,
                        ref: subFolderRef
                    });
                }
                
                showSuccess('Carpeta eliminada correctamente');
            } else {
                // Single file delete
                await deleteObject(item.ref);
                showSuccess('Archivo eliminado correctamente');
            }

            await loadFiles(currentPath);
            setSelectedItem(null);
        } catch (error) {
            console.error('Error deleting item:', error);
            showError('Error al eliminar. Asegúrate de tener permisos.');
        } finally {
            setLoading(false);
        }
    };

    return {
        items,
        loading,
        viewMode,
        selectedItem,
        activeSection,
        currentPath,
        setViewMode,
        setSelectedItem,
        handleSectionChange,
        handleFolderClick,
        handleNavigateUp,
        copyToClipboard,
        loadFiles,
        isFileUsed,
        createFolder,
        moveFile,
        deleteFile,
        progress, // Export progress
        uploadFile,
        migrateStructure, // Export migration tool
        updateReferences, // Export reference updater
        loadMore,
        hasMore: !!nextPageToken
    };
}
