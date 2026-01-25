import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AdminService } from '@/services/admin.service';

interface UseAdminProtectionProps {
  requiredRole?: 'admin' | 'moderator';
  redirectOnFail?: boolean; // Deprecated, kept for interface compatibility but ignored
  redirectPath?: string;
}

export function useAdminProtection({ 
  requiredRole = 'admin', 
  redirectOnFail = false,
  redirectPath = '/login' 
}: UseAdminProtectionProps = {}) {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();
  
  // States:
  // checking: true = "unknown" (show spinner)
  // hasAccess: true = "yes" (show content)
  // hasAccess: false = "no" (redirect or show error)
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verifyAccess = async () => {
      // 1. Wait for Auth to be ready (Firebase Auth)
      if (!isAuthReady) {
        if (mounted) setChecking(true);
        return;
      }

      // 2. Auth is Ready. Check User.
      if (!user) {
        // No user => No access.
        // Component will decide whether to redirect to login or show debug.
        console.log('[useAdminProtection] No user found. Access denied.');
        if (mounted) {
          setHasAccess(false);
          setChecking(false);
        }
        return;
      }

      // 3. User exists. Check Admin Status (Client Side).
      try {
        console.log('[useAdminProtection] Checking admin access for:', user.email);
        // "unknown" state while checking
        if (mounted) setChecking(true);

        const isAdmin = await AdminService.checkIsAdmin(user.id, user.email);
        console.log('[useAdminProtection] Access result:', isAdmin);
        
        if (mounted) {
          setHasAccess(isAdmin);
          setChecking(false);
        }
      } catch (error) {
        console.warn('Firebase admin check failed', error);
        // Fail safe: deny access on error
        if (mounted) {
          setHasAccess(false);
          setChecking(false);
        }
      }
    };

    verifyAccess();

    return () => {
      mounted = false;
    };
  }, [user, isAuthReady]);

  return { checking, hasAccess, user, isAuthReady };
}

// Hook simple para verificar permisos sin redirección (para UI condicional)
export function useAdminPermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({ isAdmin: false, role: 'user', isLoading: true });

  useEffect(() => {
    let mounted = true;

    const checkPermissions = async () => {
      if (!user?.email) {
        if (mounted) setPermissions({ isAdmin: false, role: 'user', isLoading: false });
        return;
      }

      try {
        const isAdmin = await AdminService.checkIsAdmin(user.id, user.email);
        if (mounted) {
          setPermissions({ 
            isAdmin, 
            role: isAdmin ? 'admin' : 'user',
            isLoading: false 
          });
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        if (mounted) {
          setPermissions({ isAdmin: false, role: 'user', isLoading: false });
        }
      }
    };

    checkPermissions();

    return () => {
      mounted = false;
    };
  }, [user]);

  return permissions;
}
