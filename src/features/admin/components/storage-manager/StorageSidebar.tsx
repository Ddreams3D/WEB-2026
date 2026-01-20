import React from 'react';
import { Folder, FolderOpen, Home, Layers, ShoppingBag, Briefcase, Calendar, Image as ImageIcon, HelpCircle, Layout, BookOpen, ArchiveRestore, Palette } from 'lucide-react';
import { SECTIONS } from '@/features/admin/hooks/useStorageManager';

interface StorageSidebarProps {
    activeSection: string;
    handleSectionChange: (sectionId: string) => void;
}

export function StorageSidebar({ activeSection, handleSectionChange }: StorageSidebarProps) {
    const getIcon = (id: string) => {
        switch (id) {
            case 'root': return <Home className="w-4 h-4" />;
            case 'images': return <ImageIcon className="w-4 h-4" />;
            case 'catalogo': return <ShoppingBag className="w-4 h-4" />;
            case 'servicios': return <Layers className="w-4 h-4" />;
            case 'proyectos': return <Briefcase className="w-4 h-4" />;
            case 'seasonal': return <Calendar className="w-4 h-4" />;
            case 'categories': return <Palette className="w-4 h-4" />;
            case 'soportes': return <HelpCircle className="w-4 h-4" />;
            case 'ui': return <Layout className="w-4 h-4" />;
            case 'blog': return <BookOpen className="w-4 h-4" />;
            case 'home': return <Home className="w-4 h-4" />;
            case 'recuperado': return <ArchiveRestore className="w-4 h-4" />;
            default: return <Folder className="w-4 h-4" />;
        }
    };

    return (
        <div className="w-64 flex-shrink-0 flex flex-col gap-2 border-r pr-6 h-full">
            <h3 className="text-lg font-semibold mb-4 px-2">Explorador</h3>
            <div className="flex flex-col gap-1">
                {SECTIONS.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => handleSectionChange(section.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                            activeSection === section.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent text-muted-foreground'
                        }`}
                    >
                        {getIcon(section.id)}
                        {section.label}
                    </button>
                ))}
            </div>
            
            <div className="mt-auto p-4 bg-muted/50 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground text-center">
                    Gestiona tus archivos de forma ordenada y segura.
                </p>
            </div>
        </div>
    );
}
