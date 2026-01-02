'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
    ref, 
    getDownloadURL, 
    StorageReference,
    list
} from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { 
    Loader2, 
    ExternalLink, 
    Copy, 
    Image as ImageIcon, 
    FileText, 
    Grid, 
    List as ListIcon, 
    RefreshCw,
    Folder,
    FolderOpen,
    ChevronRight,
    Home,
    ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';

interface StorageFile {
    type: 'file';
    name: string;
    fullPath: string;
    url: string;
    size: number;
    contentType: string;
    timeCreated: string;
    ref: StorageReference;
}

interface StorageFolder {
    type: 'folder';
    name: string;
    fullPath: string;
    ref: StorageReference;
}

type StorageItem = StorageFile | StorageFolder;

type ViewMode = 'grid' | 'list';

// Updated sections based on user feedback
const SECTIONS = [
    { id: 'catalogo', label: 'Catálogo (Inventario)', path: 'images/catalogo/' },
    { id: 'servicios', label: 'Servicios', path: 'images/services/' },
    { id: 'proyectos', label: 'Proyectos Destacados', path: 'images/projects/' },
    { id: 'explorer', label: 'Explorador (Avanzado)', path: '' }, // Root access
];

export default function StorageManager() {
    const [items, setItems] = useState<StorageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    // Path state now depends on the active section + navigation
    const [currentPath, setCurrentPath] = useState(SECTIONS[0].path);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const loadFiles = useCallback(async (path: string) => {
        try {
            setLoading(true);
            const storageRef = ref(storage, path);
            
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
                    // Get metadata is expensive for list, avoiding for now or doing it lazily could be better
                    // But for basic display we can skip metadata or fetch it if needed. 
                    // However, we need metadata for size/type/time.
                    // Let's try to get minimal info or just list.
                    // Ideally getMetadata(itemRef)
                    // For performance, we might skip getMetadata in bulk if lists are huge.
                    // But for now, let's fetch it to show details.
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

    // Effect to load files when path changes
    useEffect(() => {
        loadFiles(currentPath);
    }, [currentPath, loadFiles]);

    // Handler for section switching
    const handleSectionChange = (sectionId: string) => {
        const section = SECTIONS.find(s => s.id === sectionId);
        if (section) {
            setActiveSection(sectionId);
            setCurrentPath(section.path);
            setSelectedItem(null);
        }
    };

    const handleFolderClick = (folderName: string) => {
        // Append folder name to current path
        // Ensure we handle the slash correctly
        const newPath = currentPath.endsWith('/') 
            ? `${currentPath}${folderName}/` 
            : `${currentPath}/${folderName}/`;
        setCurrentPath(newPath);
    };

    const handleNavigateUp = () => {
        if (!currentPath) return;
        
        // Check if we are at the root of a section to prevent going up beyond the section
        // But for "Explorer" we allow going to root.
        // For specific sections, we might want to restrict, but let's allow navigation for flexibility
        // unless the user wants strict silos.
        // Given "Explorer" exists, maybe we can keep it simple.
        
        const parts = currentPath.split('/').filter(Boolean);
        parts.pop();
        const newPath = parts.length > 0 ? parts.join('/') + '/' : '';
        setCurrentPath(newPath);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('URL copiada al portapapeles');
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Sidebar / Sections */}
            <div className="w-64 flex-shrink-0 flex flex-col gap-2 border-r pr-6">
                <h3 className="text-lg font-semibold mb-4 px-2">Ubicaciones</h3>
                {SECTIONS.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => handleSectionChange(section.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            activeSection === section.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent text-muted-foreground'
                        }`}
                    >
                        {section.id === 'catalogo' && <Folder className="w-4 h-4" />}
                        {section.id === 'servicios' && <Folder className="w-4 h-4" />}
                        {section.id === 'proyectos' && <Folder className="w-4 h-4" />}
                        {section.id === 'explorer' && <FolderOpen className="w-4 h-4" />}
                        {section.label}
                    </button>
                ))}
                
                <div className="mt-auto p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                        <strong>Nota:</strong> Los archivos de &quot;Catálogo&quot; corresponden a tu inventario. &quot;Servicios&quot; son las imágenes de tus servicios ofrecidos.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <button 
                            onClick={handleNavigateUp}
                            disabled={!currentPath}
                            className="p-2 hover:bg-accent rounded-full disabled:opacity-30"
                            title="Subir un nivel"
                        >
                            <ArrowUp className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                            <Home className="w-4 h-4 mr-1" />
                            <span className="mx-1">/</span>
                            {currentPath.split('/').filter(Boolean).map((part, index, arr) => (
                                <span key={index} className="flex items-center">
                                    <span className={index === arr.length - 1 ? "font-medium text-foreground" : ""}>
                                        {part}
                                    </span>
                                    {index < arr.length - 1 && <ChevronRight className="w-3 h-3 mx-1" />}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => loadFiles(currentPath)}
                            title="Recargar"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        
                        <div className="flex border rounded-md overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}
                                title="Vista Cuadrícula"
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 ${viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`}
                                title="Vista Lista"
                            >
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* File Grid/List */}
                <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg bg-card/50">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p>Cargando archivos...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <FolderOpen className="w-12 h-12 mb-4 opacity-20" />
                            <p>Carpeta vacía</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {items.map((item) => (
                                <div
                                    key={item.fullPath}
                                    onClick={() => item.type === 'folder' ? handleFolderClick(item.name) : setSelectedItem(item)}
                                    className={`
                                        group relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md
                                        ${selectedItem?.fullPath === item.fullPath ? 'ring-2 ring-primary border-primary' : 'border-border'}
                                        ${item.type === 'folder' ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-background'}
                                    `}
                                >
                                    {item.type === 'folder' ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-blue-500 dark:text-blue-400">
                                            <Folder className="w-12 h-12 mb-2 fill-current opacity-20" />
                                            <span className="text-sm font-medium text-center line-clamp-2 px-2 text-foreground">
                                                {item.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="relative w-full h-full">
                                                {item.contentType?.startsWith('image/') ? (
                                                    <Image
                                                        src={item.url}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-accent/20">
                                                        <FileText className="w-10 h-10 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-xs text-white truncate">{item.name}</p>
                                                <p className="text-[10px] text-white/70">{formatSize(item.size)}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3">Nombre</th>
                                        <th className="px-4 py-3 w-32">Tamaño</th>
                                        <th className="px-4 py-3 w-32">Tipo</th>
                                        <th className="px-4 py-3 w-48">Creado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {items.map((item) => (
                                        <tr
                                            key={item.fullPath}
                                            onClick={() => item.type === 'folder' ? handleFolderClick(item.name) : setSelectedItem(item)}
                                            className={`
                                                cursor-pointer hover:bg-accent/50 transition-colors
                                                ${selectedItem?.fullPath === item.fullPath ? 'bg-accent' : ''}
                                            `}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {item.type === 'folder' ? (
                                                        <Folder className="w-5 h-5 text-blue-500" />
                                                    ) : item.contentType?.startsWith('image/') ? (
                                                        <ImageIcon className="w-5 h-5 text-purple-500" />
                                                    ) : (
                                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                    <span className="truncate max-w-[300px]">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {item.type === 'file' ? formatSize(item.size) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {item.type === 'file' ? item.contentType : 'Carpeta'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {item.type === 'file' && item.timeCreated ? formatDate(item.timeCreated) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Panel */}
            {selectedItem && selectedItem.type === 'file' && (
                <div className="w-80 flex-shrink-0 border-l bg-card p-6 overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        <div className="aspect-square relative rounded-lg border bg-accent/20 overflow-hidden">
                            {selectedItem.contentType?.startsWith('image/') ? (
                                <Image
                                    src={selectedItem.url}
                                    alt={selectedItem.name}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FileText className="w-16 h-16 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className="font-semibold break-words mb-2">{selectedItem.name}</h4>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex justify-between border-b pb-2">
                                    <span>Tamaño</span>
                                    <span className="font-medium text-foreground">{formatSize(selectedItem.size)}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span>Tipo</span>
                                    <span className="font-medium text-foreground">{selectedItem.contentType}</span>
                                </div>
                                <div className="flex flex-col gap-1 border-b pb-2">
                                    <span>Creado</span>
                                    <span className="font-medium text-foreground">{formatDate(selectedItem.timeCreated)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span>Ruta completa</span>
                                    <code className="text-xs bg-muted p-1 rounded break-all">{selectedItem.fullPath}</code>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-auto">
                            <button
                                onClick={() => window.open(selectedItem.url, '_blank')}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Abrir original
                            </button>
                            <button
                                onClick={() => copyToClipboard(selectedItem.url)}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                            >
                                <Copy className="w-4 h-4" />
                                Copiar URL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
