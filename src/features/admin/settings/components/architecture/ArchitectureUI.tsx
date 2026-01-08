import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';

export function TabHeader({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    amber: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    emerald: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    indigo: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
    slate: "text-slate-600 bg-slate-100 dark:bg-slate-900/30",
    red: "text-red-600 bg-red-100 dark:bg-red-900/30",
  };
  
  return (
    <div className="flex items-center gap-4 mb-6 pb-6 border-b">
      <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.blue}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-3xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-lg">{desc}</p>
      </div>
    </div>
  );
}

export function TechHero({ icon: Icon, title, desc, tags, color, className }: { icon: any, title: string, desc: string, tags: string[], color: string, className?: string }) {
  return (
    <div className={`p-6 rounded-2xl border bg-card hover:shadow-md transition-all ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex gap-2">
          {tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
        </div>
      </div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export function SectionGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-4 border-primary pl-3">{title}</h4>
      {children}
    </div>
  );
}

export function TechCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
      <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
      <div>
        <h5 className="font-semibold text-sm mb-1">{title}</h5>
        <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
      </div>
    </div>
  );
}

export function TechFeature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-accent/5 border border-transparent hover:border-accent/20 transition-all">
      <div className="p-2 bg-background rounded-lg shadow-sm h-fit">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h5 className="font-bold text-sm mb-1">{title}</h5>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export function TechPill({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card text-xs font-medium hover:border-primary/50 transition-colors">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      {label}
    </div>
  );
}

export function HistoryItem({ title, desc, date }: { title: string, desc: string, date?: string }) {
  return (
    <li className="flex gap-3 items-start">
      <div className="mt-0.5 p-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 shrink-0">
        <Check className="w-3 h-3" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-sm block">{title}</span>
          {date && <span className="text-[10px] text-muted-foreground border px-1.5 py-0.5 rounded-full bg-background/50">{date}</span>}
        </div>
        <span className="text-xs text-muted-foreground block mt-0.5">{desc}</span>
      </div>
    </li>
  );
}

export function NavTab({ value, icon: Icon, label }: { value: string, icon: any, label: string }) {
  return (
    <TabsTrigger 
      value={value} 
      className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium text-sm hidden md:inline">{label}</span>
    </TabsTrigger>
  );
}
