import React, { useState } from 'react';
import { GlossaryItem } from '@/shared/types/glossary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Maximize2, Trash2 } from 'lucide-react';

interface CategoryViewerProps {
  items: GlossaryItem[];
  isEditMode: boolean;
  onUpdate: (id: string, definition: string) => void;
  onRemove: (id: string) => void;
}

export function CategoryViewer({ items, isEditMode, onUpdate, onRemove }: CategoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (items.length === 0) return null;

  // Ensure index is valid when items change
  if (currentIndex >= items.length) {
    setCurrentIndex(0);
  }

  const currentItem = items[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center gap-4 w-full">
        {/* Prev Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrev}
          className="h-12 w-12 rounded-full hidden md:flex hover:bg-muted shrink-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Main Card */}
        <div className="flex-1 w-full max-w-3xl mx-auto">
          <Card className="min-h-[400px] flex flex-col relative overflow-hidden border-border/60 shadow-xl">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/5 space-y-1">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-2xl md:text-3xl font-bold leading-tight text-foreground/90 transition-colors">
                  {currentItem.term}
                </CardTitle>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullScreen(true)}
                    className="text-muted-foreground hover:text-primary"
                    title="Pantalla completa"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                  {isEditMode && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(currentItem.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription className="font-mono text-xs opacity-60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                ID: {currentItem.id}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8 flex-1 flex flex-col p-6 md:p-10">
              {isEditMode ? (
                <Textarea
                  value={currentItem.definition}
                  onChange={(e) => onUpdate(currentItem.id, e.target.value)}
                  className="flex-1 min-h-[200px] resize-none text-lg bg-background/50 focus:bg-background transition-colors p-6 leading-relaxed"
                />
              ) : (
                <div className="prose prose-lg dark:prose-invert max-w-none flex-1">
                  <p className="text-lg md:text-xl text-muted-foreground leading-loose whitespace-pre-wrap">
                    {currentItem.definition}
                  </p>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-border/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono opacity-50">
                    {currentIndex + 1} / {items.length}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground/70 font-mono bg-muted px-3 py-1.5 rounded-full">
                  {currentItem.lastUpdated ? new Date(currentItem.lastUpdated).toLocaleDateString() : '-'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNext}
          className="h-12 w-12 rounded-full hidden md:flex hover:bg-muted shrink-0"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Navigation Controls */}
      <div className="flex md:hidden items-center justify-between w-full px-4 gap-4">
        <Button variant="outline" size="lg" onClick={handlePrev} className="flex-1 rounded-full">
          <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {items.length}
        </span>
        <Button variant="outline" size="lg" onClick={handleNext} className="flex-1 rounded-full">
          Siguiente <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Full Screen Dialog */}
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b bg-muted/10">
            <DialogTitle className="text-3xl font-bold flex items-center gap-3">
              {currentItem.term}
              <Badge className="ml-2">{currentItem.category}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-8 bg-card">
            <p className="text-xl md:text-2xl text-muted-foreground leading-loose whitespace-pre-wrap max-w-3xl mx-auto">
              {currentItem.definition}
            </p>
          </div>
          <div className="p-4 border-t bg-muted/10 flex justify-end">
             <Button onClick={() => setIsFullScreen(false)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
