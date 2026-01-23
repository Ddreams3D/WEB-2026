import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PHONE_DISPLAY, EMAIL_BUSINESS, ADDRESS_BUSINESS } from '@/shared/constants/contactInfo';

// Register a font (optional, using standard fonts for now)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  // Header Redesign
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 20,
  },
  brandBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logo: {
    width: 130,
    height: 45,
    objectFit: 'contain',
    marginBottom: 4,
  },
  slogan: {
    fontSize: 9,
    color: '#64748b',
    letterSpacing: 0.3,
  },
  contactBlock: {
    alignItems: 'flex-end',
  },
  contactText: {
    fontSize: 8,
    color: '#94a3b8',
    marginBottom: 3,
    textAlign: 'right',
  },
  // Title Section
  titleContainer: {
    marginBottom: 25,
  },
  reportTitle: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  metaData: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 4,
  },
  // Client Card Design
  clientCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
  },
  clientLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  clientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  clientContact: {
    fontSize: 9,
    color: '#64748b',
    marginRight: 15,
  },
  // Existing Table Styles (Cleaned up slightly)
  table: {
    display: 'flex',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 32,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableCol: {
    width: '20%',
    padding: 8,
  },
  tableColWide: {
    width: '60%',
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableCell: {
    fontSize: 9,
    color: '#334155',
  },
  // Totals
  totalSection: {
    marginTop: 20,
    alignItems: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
    width: '100%',
  },
  totalLabel: {
    fontSize: 9,
    color: '#64748b',
    marginRight: 20,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    width: 100,
    textAlign: 'right',
  },
  finalTotal: {
    fontSize: 14,
    color: '#0f172a',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 15,
  },
  link: {
    color: '#0f172a',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
});

interface QuotePDFProps {
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
  options: {
    showDetails: boolean;
    showIgv: boolean;
  };
}

export const QuotePDF = ({ data, settings, clientInfo, projectName, pricing, options }: QuotePDFProps) => {
  const currentDate = format(new Date(), 'PPP', { locale: es });
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Redesigned */}
        <View style={styles.header}>
          {/* Brand Block */}
          <View style={styles.brandBlock}>
             <Image 
                style={styles.logo} 
                src={`${typeof window !== 'undefined' ? window.location.origin : ''}/images/ui/brand/logo-ddreams-3d.jpg?v=${new Date().getTime()}`} 
                cache={false}
             />
             <Text style={styles.slogan}>Impresión 3D personalizada – Arequipa, Perú</Text>
          </View>
          
          {/* Contact Block (Discreet) */}
          <View style={styles.contactBlock}>
            <Text style={styles.contactText}>{ADDRESS_BUSINESS}</Text>
            <Text style={styles.contactText}>{EMAIL_BUSINESS}</Text>
            <Text style={styles.contactText}>{PHONE_DISPLAY}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.reportTitle}>PRESUPUESTO</Text>
          <Text style={styles.metaData}>Fecha: {currentDate}</Text>
        </View>

        {/* Client Info (Card Style) */}
        <View style={styles.clientCard}>
          <Text style={styles.clientLabel}>Preparado para</Text>
          <Text style={styles.clientName}>{clientInfo.name || 'Cliente General'}</Text>
          <View style={styles.clientInfoRow}>
             {clientInfo.phone && (
               <Text style={styles.clientContact}>{clientInfo.phone}</Text>
             )}
             {clientInfo.email && (
               <Text style={styles.clientContact}>{clientInfo.email}</Text>
             )}
          </View>
        </View>

        {/* Details Table */}
        <View>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColWide}>
              <Text style={styles.tableCellHeader}>Descripción</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>{options.showDetails ? 'Especificaciones' : 'Cantidad'}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>{options.showDetails ? 'Detalle' : 'Precio'}</Text>
            </View>
          </View>

          {options.showDetails && data.machineDetails ? (
            <>
              {data.machineDetails.map((machine: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableColWide}>
                    <Text style={styles.tableCell}>{projectName || 'Servicio de Impresión 3D Personalizado'}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {data.isProductionMode ? (
                        `${machine.unitDuration ? Math.floor(machine.unitDuration / 60) + 'h ' + (machine.unitDuration % 60) + 'm' : ''} / ${machine.unitWeight || machine.weight}g`
                      ) : (
                        `${Math.floor(machine.duration / 60)}h ${machine.duration % 60}m / ${machine.weight}g`
                      )}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{machine.type === 'fdm' ? 'FDM' : 'Resina'}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.tableRow}>
              <View style={styles.tableColWide}>
                <Text style={styles.tableCell}>{projectName || 'Servicio de Impresión 3D'}</Text>
                <Text style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>
                  {data.isProductionMode 
                    ? `Producción en serie de ${data.quantity} unidades.` 
                    : 'Fabricación digital personalizada bajo demanda.'}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{data.isProductionMode ? data.quantity : 1}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>S/ {pricing.subtotal.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>S/ {pricing.subtotal.toFixed(2)}</Text>
          </View>
          {options.showIgv && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IGV (18%):</Text>
              <Text style={styles.totalValue}>S/ {pricing.igv.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.totalRow, { marginTop: 4 }]}>
            <Text style={[styles.totalLabel, { color: '#0f172a', fontWeight: 'bold' }]}>TOTAL:</Text>
            <Text style={[styles.totalValue, styles.finalTotal]}>S/ {pricing.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gracias por confiar en Ddreams 3D. Este documento es una cotización preliminar y no representa una factura fiscal.</Text>
          <Text style={{ marginTop: 4 }}>Para más información, visita nuestra web:</Text>
          <Link src="https://ddreams3d.com" style={[styles.link, { marginTop: 2, fontSize: 9 }]}>ddreams3d.com</Link>
        </View>
      </Page>
    </Document>
  );
};
