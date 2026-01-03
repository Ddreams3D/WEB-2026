import React from 'react';
import { Database, HardDrive } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase';
import { cn } from '@/lib/utils';

export default function ConnectionStatus() {
  const isConnected = isFirebaseConfigured;

  // Debug logging for production issues
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isConfigured = isFirebaseConfigured;
      console.log('[Firebase Status] Configured:', isConfigured);
      if (!isConfigured) {
        console.warn('[Firebase Status] Firebase keys are missing or invalid.');
        console.log('API Key present:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
        console.log('Project ID present:', !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
        console.log('Auth Domain present:', !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
      }
    }
  }, []);

  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all duration-300",
      "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm",
      isConnected 
        ? "border-emerald-200/50 dark:border-emerald-800/50 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]" 
        : "border-rose-200/50 dark:border-rose-800/50 shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]"
    )}>
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2 shadow-sm",
            isConnected ? "bg-emerald-500" : "bg-rose-500"
          )}></span>
        </div>
        <span className={cn(
          "text-xs font-semibold tracking-wide",
          isConnected ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
        )}>
          {isConnected ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      {/* Vertical Divider */}
      <div className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />

      {/* Source Indicator */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {isConnected ? (
          <Database className="w-3 h-3" />
        ) : (
          <HardDrive className="w-3 h-3" />
        )}
        <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
          {isConnected ? 'Cloud' : 'Local'}
        </span>
      </div>
    </div>
  );
}
