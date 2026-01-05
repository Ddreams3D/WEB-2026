import React from 'react';
import { Folder, FolderOpen } from 'lucide-react';
import { SECTIONS } from '@/features/admin/hooks/useStorageManager';

interface StorageSidebarProps {
    activeSection: string;
    handleSectionChange: (sectionId: string) => void;
}

export function StorageSidebar({ activeSection, handleSectionChange }: StorageSidebarProps) {
    return (
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
    );
}
