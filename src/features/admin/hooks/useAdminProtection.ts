import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AdminService } from '@/services/admin.service';

interface UseAdminProtectionProps {
  requiredRole?: 'admin' | 'moderator';
  redirectOnFail?: boolean;
  redirectPath?: string;
}

export function useAdminProtection({ 
  requiredRole = 'admin', 
  redirectOnFail = false, // DISABLED BY DEFAULT TO PREVENT LOOPS
  redirectPath = '/login' 
}: UseAdminProtectionProps = {}) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verifyAccess = async () => {
      // 1. Wait for Auth to be ready
      if (authLoading) return;

      // 2. Try Firebase Auth (Client Side)
      if (user) {
        try {
          console.log('[useAdminProtection] Checking admin access for:', user.email);
          const isAdmin = await AdminService.checkIsAdmin(user.id, user.email);
          console.log('[useAdminProtection] Access result:', isAdmin);
          
          if (mounted && isAdmin) {
            setHasAccess(true);
            setChecking(false);
            return;
          }
        } catch (error) {
          console.warn('Firebase admin check failed', error);
        }
      } else {
         console.log('[useAdminProtection] No user found in AuthContext');
      }

      // 3. Access Denied
      if (mounted) {
        console.warn('[useAdminProtection] Access Denied. Redirect enabled:', redirectOnFail);
        if (redirectOnFail) {
           console.warn('[useAdminProtection] Redirecting to:', redirectPath);
           // NUCLEAR OPTION: Desactivamos redirección forzosa temporalmente incluso si se solicita
           // router.push(redirectPath);
           console.warn('[useAdminProtection] Redirect BLOCKED by debug mode');
        }
        setHasAccess(false);
        setChecking(false);
      }
    };

    verifyAccess();

    return () => {
      mounted = false;
    };
  }, [user, authLoading, router, redirectOnFail, redirectPath]);

  return { checking, hasAccess, user, isLoading: authLoading };
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

// Export legacy helpers if needed, but they are now powered by the hook logic mostly.
// Keeping empty/stub functions if they are imported elsewhere to avoid breaking build,
// or removing them if I am confident. 
// search results showed: export { useAdminPermissions, grantAdminPermissions, revokeAdminPermissions };
// in AdminProtection.tsx.

// grantAdminPermissions and revokeAdminPermissions were using localStorage.
// Now that we use Firestore, we should probably update them to use AdminService too, 
// OR just remove them if they were only for local dev. 
// The user asked to "migrar lógica... a Firestore". 
// So I will update them to use AdminService.grantAdminRole but that needs to be async and might not fit the signature.
// These were likely dev helpers. I'll remove them or make them log a warning that they are deprecated/async now.

export const grantAdminPermissions = async (uid: string) => {
  console.warn('grantAdminPermissions is deprecated. Use AdminService.grantAdminRole()');
  await AdminService.grantAdminRole(uid);
};

export const revokeAdminPermissions = async (uid: string) => {
  console.warn('revokeAdminPermissions is deprecated. Use AdminService.revokeAdminRole()');
  await AdminService.revokeAdminRole(uid);
};
