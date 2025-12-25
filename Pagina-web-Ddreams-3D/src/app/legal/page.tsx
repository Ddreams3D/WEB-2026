'use client';

import { useState, useEffect } from 'react';
import { useB2B } from '@/contexts/B2BContext';
import { useLegal, ContractFilters } from '@/contexts/LegalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Download, Send, Eye, Edit, Copy, Trash2, FileText, Shield, Handshake, Scale, Clock, CheckCircle, AlertTriangle, XCircle, Calendar, Building, User, Mail, Phone, Tag, BarChart3, TrendingUp, AlertCircle, Settings, RefreshCw, Archive, Star, Bookmark, ExternalLink, MessageSquare, Bell, Target, Award, Zap } from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function LegalPage() {
  const { currentCompany } = useB2B();
  const { 
    contracts, 
    templates,
    stats,
    loading,
    searchContracts,
    filterContracts,
    sendContract,
    signContract,
    cancelContract,
    deleteContract,
    duplicateContract,
    sendReminder,
    getExpiringContracts,
    refreshData
  } = useLegal();
  
  const [activeTab, setActiveTab] = useState('contracts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [filteredContracts, setFilteredContracts] = useState(contracts);

  useEffect(() => {
    let filtered = contracts;
    
    // Aplicar búsqueda
    if (searchQuery) {
      filtered = searchContracts(searchQuery);
    }
    
    // Aplicar filtros
    const filters: ContractFilters = {};
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (typeFilter !== 'all') filters.type = typeFilter;
    if (priorityFilter !== 'all') filters.priority = priorityFilter;
    
    if (Object.keys(filters).length > 0) {
      filtered = filterContracts(filters);
    }
    
    setFilteredContracts(filtered);
  }, [searchQuery, statusFilter, typeFilter, priorityFilter, contracts]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'draft': 'outline',
      'sent': 'secondary',
      'signed': 'default',
      'expired': 'destructive',
      'cancelled': 'outline',
      'completed': 'default'
    };
    
    const labels: Record<string, string> = {
      'draft': 'Borrador',
      'sent': 'Enviado',
      'signed': 'Firmado',
      'expired': 'Vencido',
      'cancelled': 'Cancelado',
      'completed': 'Completado'
    };
    
    const icons: Record<string, React.ReactNode> = {
      'draft': <Edit className="h-4 w-4 mr-1" />,
      'sent': <Send className="h-4 w-4 mr-1" />,
      'signed': <CheckCircle className="h-4 w-4 mr-1" />,
      'expired': <AlertTriangle className="h-4 w-4 mr-1" />,
      'cancelled': <XCircle className="h-4 w-4 mr-1" />,
      'completed': <Award className="h-4 w-4 mr-1" />
    };
    
    return (
      <Badge variant={variants[status] || 'outline'} className="text-sm">
        {icons[status]}
        {labels[status] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'nda': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'service_agreement': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'manufacturing_contract': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'licensing': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'custom': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    
    const labels: Record<string, string> = {
      'nda': 'NDA',
      'service_agreement': 'Servicios',
      'manufacturing_contract': 'Fabricación',
      'licensing': 'Licencia',
      'custom': 'Personalizado'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] || colors.custom}`}>
        {labels[type] || type}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    
    const labels: Record<string, string> = {
      'high': 'Alta',
      'medium': 'Media',
      'low': 'Baja'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[priority] || colors.medium}`}>
        {labels[priority] || priority}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const handleBulkAction = async (action: string) => {
    if (selectedContracts.length === 0) return;
    
    try {
      for (const contractId of selectedContracts) {
        switch (action) {
          case 'send':
            await sendContract(contractId);
            break;
          case 'cancel':
            await cancelContract(contractId);
            break;
          case 'delete':
            await deleteContract(contractId);
            break;
          case 'duplicate':
            await duplicateContract(contractId);
            break;
        }
      }
      setSelectedContracts([]);
      await refreshData();
    } catch (error) {
      console.error('Error en acción masiva:', error);
    }
  };

  const toggleContractSelection = (contractId: string) => {
    setSelectedContracts(prev => 
      prev.includes(contractId) 
        ? prev.filter(id => id !== contractId)
        : [...prev, contractId]
    );
  };

  const selectAllContracts = () => {
    setSelectedContracts(
      selectedContracts.length === filteredContracts.length 
        ? [] 
        : filteredContracts.map(c => c.id)
    );
  };

  if (!currentCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Scale className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Empresarial Requerido</h2>
            <p className="text-muted-foreground text-center">
              Para gestionar contratos y acuerdos legales, necesitas iniciar sesión con una cuenta empresarial.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión Legal</h1>
          <p className="text-muted-foreground mt-2">
            Administra contratos, NDAs y acuerdos legales para {currentCompany.name}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Link href="/legal/plantillas">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Plantillas
            </Button>
          </Link>
          <Link href="/legal/nuevo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Contrato
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contratos</p>
                <p className="text-2xl font-bold">{stats.totalContracts}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contratos Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeContracts}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes de Firma</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingSignatures}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vencen Pronto</p>
                <p className="text-2xl font-bold text-red-600">{stats.expiringSoon}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        {/* Contratos */}
        <TabsContent value="contracts" className="space-y-6">
          {/* Filtros y búsqueda */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar contratos por título, cliente o email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="sent">Enviado</SelectItem>
                      <SelectItem value="signed">Firmado</SelectItem>
                      <SelectItem value="expired">Vencido</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="nda">NDA</SelectItem>
                      <SelectItem value="service_agreement">Servicios</SelectItem>
                      <SelectItem value="manufacturing_contract">Fabricación</SelectItem>
                      <SelectItem value="licensing">Licencia</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las prioridades</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Acciones masivas */}
              {selectedContracts.length > 0 && (
                <div className="flex items-center justify-between mt-4 p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">
                    {selectedContracts.length} contrato(s) seleccionado(s)
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('send')}>
                      <Send className="h-4 w-4 mr-1" />
                      Enviar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('duplicate')}>
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('cancel')}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de contratos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contratos ({filteredContracts.length})</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllContracts}
                  >
                    {selectedContracts.length === filteredContracts.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredContracts.length > 0 ? (
                <div className="space-y-4">
                  {filteredContracts.map((contract) => (
                    <div key={contract.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedContracts.includes(contract.id)}
                            onChange={() => toggleContractSelection(contract.id)}
                            className="mt-1"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <Link href={`/legal/${contract.id}`}>
                                <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                                  {contract.title}
                                </h3>
                              </Link>
                              {getStatusBadge(contract.status)}
                              {getTypeBadge(contract.type)}
                              {getPriorityBadge(contract.priority)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Building className="h-4 w-4" />
                                <span>{contract.clientName}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{contract.clientEmail}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>Creado: {formatDate(contract.createdAt)}</span>
                              </div>
                            </div>
                            
                            {contract.tags.length > 0 && (
                              <div className="flex items-center space-x-2 mt-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-wrap gap-1">
                                  {contract.tags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {contract.expiresAt && (
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className={`text-sm ${
                                  new Date(contract.expiresAt) < new Date() 
                                    ? 'text-red-600 font-medium' 
                                    : new Date(contract.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                    ? 'text-orange-600 font-medium'
                                    : 'text-muted-foreground'
                                }`}>
                                  Vence: {formatDate(contract.expiresAt)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link href={`/legal/${contract.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/legal/${contract.id}/editar`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => duplicateContract(contract.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {contract.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => sendContract(contract.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {contract.status === 'sent' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => sendReminder(contract.id)}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay contratos</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
                      ? 'No se encontraron contratos que coincidan con los filtros aplicados.'
                      : 'Aún no has creado ningún contrato. ¡Comienza creando tu primer contrato!'}
                  </p>
                  <Link href="/legal/nuevo">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primer Contrato
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plantillas */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Plantillas de Contratos ({templates.length})</CardTitle>
                <Link href="/legal/plantillas/nueva">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Plantilla
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                        {getTypeBadge(template.type)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Versión:</span>
                          <span className="font-medium">{template.version}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Variables:</span>
                          <span className="font-medium">{template.variables.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Actualizada:</span>
                          <span className="font-medium">{formatDate(template.updatedAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Link href={`/legal/nuevo?template=${template.id}`} className="flex-1">
                            <Button className="w-full" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Usar Plantilla
                            </Button>
                          </Link>
                          <Link href={`/legal/plantillas/${template.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/legal/plantillas/${template.id}/editar`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contratos por estado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Contratos por Estado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.contractsByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(status)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(count / stats.totalContracts) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contratos por tipo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Contratos por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.contractsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeBadge(type)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(count / stats.totalContracts) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Métricas de rendimiento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Métricas de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tiempo Promedio de Firma:</span>
                    <span className="font-semibold">{stats.averageSigningTime} días</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tasa de Cumplimiento:</span>
                    <span className="font-semibold text-green-600">{stats.complianceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Completados este Mes:</span>
                    <span className="font-semibold">{stats.completedThisMonth}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contratos próximos a vencer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Próximos Vencimientos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getExpiringContracts(30).length > 0 ? (
                  <div className="space-y-3">
                    {getExpiringContracts(30).slice(0, 5).map((contract) => (
                      <div key={contract.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{contract.title}</p>
                          <p className="text-sm text-muted-foreground">{contract.clientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600">
                            {formatDate(contract.expiresAt!)}
                          </p>
                          <Link href={`/legal/${contract.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No hay contratos próximos a vencer
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}