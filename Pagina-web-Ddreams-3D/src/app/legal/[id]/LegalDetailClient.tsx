'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useB2B } from '@/contexts/B2BContext';
import { useLegal } from '@/contexts/LegalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Send,
  Download,
  Copy,
  Edit,
  Trash2,
  FileText,
  Shield,
  Scale,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Percent,
  FileClock,
  FileX,
  PenTool
} from '@/lib/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LegalDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { isB2BUser, currentCompany } = useB2B();
  const { getContractById, updateContract, deleteContract } = useLegal();
  
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      if (resolved && typeof resolved.id === 'string') {
        setResolvedParams({ id: resolved.id });
      }
    };
    
    resolveParams();
  }, [params]);
  
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const loadContract = useCallback(async () => {
    if (!resolvedParams?.id) return;
    
    try {
      const contractData = await getContractById(resolvedParams.id);
      setContract(contractData);
    } catch (error) {
      console.error('Error loading contract:', error);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams?.id, getContractById]);
  
  useEffect(() => {
    loadContract();
  }, [resolvedParams?.id, loadContract]);
  
  // Rest of the component logic would go here...
  // For now, just return a basic structure
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <FileX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Contrato no encontrado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              El contrato que buscas no existe o no tienes permisos para verlo.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a contratos
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {contract.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Contrato #{contract.id}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {contract.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 dark:text-gray-400">
              Detalles del contrato se mostrarían aquí...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}