import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { QuotePDF } from './QuotePDF';
import { Download, FileText, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface QuotePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  settings: any;
  clientInfo: {
    name: string;
    phone: string;
    email: string;
  };
  projectName: string;
  pricing: {
    subtotal: number;
    igv: number;
    total: number;
    includeIgv: boolean;
  };
  onSendWhatsApp: (blob: Blob | null) => void;
}

export function QuotePreviewModal({ 
  isOpen, 
  onClose, 
  data, 
  settings, 
  clientInfo, 
  projectName,
  pricing,
  onSendWhatsApp 
}: QuotePreviewModalProps) {
  const [options, setOptions] = useState({
    showDetails: false,
    showIgv: false,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Vista Previa de Cotización
          </DialogTitle>
          <DialogDescription>
            Configura y descarga el documento PDF para el cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Settings */}
          <div className="w-full md:w-64 bg-muted/30 p-6 border-r space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Opciones de PDF</h4>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="showDetails" 
                  checked={options.showDetails} 
                  onCheckedChange={(c) => setOptions(prev => ({ ...prev, showDetails: !!c }))} 
                />
                <Label htmlFor="showDetails" className="text-sm cursor-pointer">Mostrar detalles técnicos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="showIgv" 
                  checked={options.showIgv} 
                  onCheckedChange={(c) => setOptions(prev => ({ ...prev, showIgv: !!c }))} 
                />
                <Label htmlFor="showIgv" className="text-sm cursor-pointer">Desglosar IGV</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Acciones</h4>
              
              <PDFDownloadLink
                document={
                  <QuotePDF 
                    data={data} 
                    settings={settings} 
                    clientInfo={clientInfo} 
                    projectName={projectName}
                    pricing={pricing} 
                    options={options} 
                  />
                }
                fileName={`Cotizacion_${clientInfo.name || 'Cliente'}.pdf`}
                className="w-full"
              >
                {({ blob, url, loading, error }) => (
                  <Button disabled={loading} className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    {loading ? 'Generando...' : 'Descargar PDF'}
                  </Button>
                )}
              </PDFDownloadLink>

              <Button 
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                onClick={() => {
                   // Since we can't easily get the blob synchronously from the link wrapper, 
                   // we might rely on the user downloading it first or trigger generation.
                   // For now, we trigger the WhatsApp link generation.
                   onSendWhatsApp(null);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar WhatsApp
              </Button>
              <p className="text-[10px] text-muted-foreground text-center px-2">
                * Se descargará el PDF y se abrirá WhatsApp Web. Arrastra el archivo al chat.
              </p>
            </div>
          </div>

          {/* PDF Preview Area */}
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center p-4">
            <PDFViewer className="w-full h-full rounded shadow-lg border" showToolbar={false}>
              <QuotePDF 
                data={data} 
                settings={settings} 
                clientInfo={clientInfo} 
                projectName={projectName}
                pricing={pricing} 
                options={options} 
              />
            </PDFViewer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
