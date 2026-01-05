import React from 'react';
import { 
  ShoppingCart, 
  Layout, 
  User, 
  Shield, 
  Code, 
  FileText, 
  Zap, 
  Globe 
} from 'lucide-react';
import { RouteCategory } from '../types';

export function CategoryIcon({ category }: { category: RouteCategory }) {
  switch(category) {
    case 'Tienda': return <ShoppingCart className="w-4 h-4" />;
    case 'Servicios': return <Layout className="w-4 h-4" />;
    case 'Usuario': return <User className="w-4 h-4" />;
    case 'Admin': return <Shield className="w-4 h-4" />;
    case 'Sistema': return <Code className="w-4 h-4" />;
    case 'Legal': return <FileText className="w-4 h-4" />;
    case 'Marketing': return <Zap className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
}
