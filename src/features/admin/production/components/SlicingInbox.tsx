'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Link as LinkIcon, Trash2, RefreshCw, Box, History, Undo2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlicingInboxItem } from '../types';
import { SlicingInboxService } from '../services/slicing-inbox.service';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { LinkProductModal } from './LinkProductModal';

export function SlicingInbox() {
  const [items, setItems] = useState<SlicingInboxItem[]>([]);
  const [linkedItems, setLinkedItems] = useState<SlicingInboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedItem, setSelectedItem] = useState<SlicingInboxItem | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const [pending, linked] = await Promise.all([
        SlicingInboxService.getPendingItems(),
        SlicingInboxService.getLinkedItems()
      ]);
      setItems(pending);
      setLinkedItems(linked);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando inbox de producción');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleIgnore = async (id: string) => {
    try {
      await SlicingInboxService.ignoreItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Item ignorado');
    } catch (error) {
      toast.error('Error al ignorar');
    }
  };

  const handleLink = (item: SlicingInboxItem) => {
    setSelectedItem(item);
    setIsLinkModalOpen(true);
  };

  const handleUndoLink = async (id: string) => {
    try {
      await SlicingInboxService.unlinkItem(id);
      toast.success('Vinculación deshecha. Item devuelto a pendientes.');
      fetchItems();
    } catch (error) {
      console.error(error);
      toast.error('Error al deshacer vinculación');
    }
  };

  const handleLinkSuccess = () => {
    fetchItems(); // Recargar todo
  };

  const renderItemList = (itemList: SlicingInboxItem[], isHistory: boolean) => {
    if (loading && itemList.length === 0) {
      return (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (itemList.length === 0) {
      return (
        <div className="text-center p-8 text-muted-foreground">
          <p>{isHistory ? 'No hay historial reciente.' : 'No hay items pendientes.'}</p>
          {!isHistory && <p className="text-xs mt-2">Ejecuta el script de slicing para enviar datos.</p>}
        </div>
      );
    }

    return (
      <div className="divide-y">
        {itemList.map((item) => (
          <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors flex justify-between items-start group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{item.name}</span>
                <Badge variant="outline" className="text-[10px] h-5">
                  {item.machineType}
                </Badge>
                {item.qualityProfile && (
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {item.qualityProfile}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {item.fileName}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  ⚖️ {item.grams}g
                </span>
                <span className="flex items-center gap-1">
                  ⏱️ {Math.round(item.time)}m
                </span>
                <span>
                  • {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isHistory ? (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  onClick={() => handleUndoLink(item.id)}
                  title="Deshacer vinculación (Undo)"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleIgnore(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 gap-1.5"
                    onClick={() => handleLink(item)}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Vincular
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Box className="w-5 h-5 text-primary" />
                Bandeja de Slicing
              </CardTitle>
              <CardDescription>
                Archivos detectados desde OrcaSlicer/BambuStudio
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchItems} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pb-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">Pendientes ({items.length})</TabsTrigger>
              <TabsTrigger value="history">Historial ({linkedItems.length})</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-[400px]">
              <TabsContent value="pending" className="m-0 border-none">
                {renderItemList(items, false)}
              </TabsContent>
              <TabsContent value="history" className="m-0 border-none">
                {renderItemList(linkedItems, true)}
              </TabsContent>
            </ScrollArea>
          </CardContent>
        </Tabs>
      </Card>
      
      <LinkProductModal 
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        inboxItem={selectedItem}
        onSuccess={handleLinkSuccess}
      />
    </>
  );
}
