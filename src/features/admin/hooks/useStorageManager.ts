import { useState, useEffect, useCallback } from 'react';
import { 
    ref, 
    getDownloadURL, 
    StorageReference,
    list
} from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { toast } from 'sonner';

export interface StorageFile {
    type: 'file';
    name: string;
    fullPath: string;
    url: string;
    size: number;
    contentType: string;
    timeCreated: string;
    ref: StorageReference;
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
    { id: 'catalogo', label: 'Catálogo (Inventario)', path: 'images/catalogo/' },
    { id: 'servicios', label: 'Servicios', path: 'images/services/' },
    { id: 'proyectos', label: 'Proyectos Destacados', path: 'images/projects/' },
    { id: 'explorer', label: 'Explorador (Avanzado)', path: '' }, // Root access
];

export function useStorageManager() {
    const [items, setItems] = useState<StorageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    const [currentPath, setCurrentPath] = useState(SECTIONS[0].path);

    const loadFiles = useCallback(async (path: string) => {
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
            const result = await list(storageRef, { maxResults: 100 });
            
            // Process Folders
            const folderItems: StorageFolder[] = result.prefixes.map(prefix => ({
                type: 'folder',
                name: prefix.name,
                fullPath: prefix.fullPath,
                ref: prefix
            }));

            // Process Files
            const filePromises = result.items.map(async (itemRef) => {
                try {
                    const url = await getDownloadURL(itemRef);
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
            
            setItems([...folderItems, ...loadedFiles]);
        } catch (error) {
            console.error('Error loading files:', error);
            toast.error('Error al cargar los archivos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFiles(currentPath);
    }, [currentPath, loadFiles]);

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
        toast.success('URL copiada al portapapeles');
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
        loadFiles
    };
}
