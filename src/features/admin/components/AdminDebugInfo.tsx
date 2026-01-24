'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_EMAILS } from '@/config/roles';

export function AdminDebugInfo() {
  const { user } = useAuth();

  if (!user) return null;

  const isHardcoded = user.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
  const roleColor = user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 p-2 text-xs text-yellow-800 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <strong>⚠️ DEBUG INFO:</strong> 
        <span>User: <span className="font-mono font-bold">{user.email}</span></span>
        <span className="text-gray-400">|</span>
        <span>UID: <span className="font-mono">{user.id}</span></span>
      </div>
      <div className="flex gap-2 items-center">
        {isHardcoded && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold border border-red-200">Hardcoded Admin</span>}
        <span className={`px-2 py-0.5 rounded-full border ${roleColor} font-medium`}>Role: {user.role || 'none'}</span>
      </div>
    </div>
  );
}
