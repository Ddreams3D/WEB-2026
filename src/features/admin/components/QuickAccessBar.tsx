'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Languages, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Cpu } from 'lucide-react';

export function QuickAccessBar() {
  const links = [
    {
      href: '/admin/configuracion?tab=glossary',
      icon: BookOpen,
      label: 'Glosario y Conceptos',
      color: 'text-emerald-500',
      bg: 'hover:bg-emerald-500/10'
    },
    {
      href: '/admin/configuracion?tab=prompt-lang',
      icon: Languages,
      label: 'Lenguaje del Proyecto',
      color: 'text-indigo-500',
      bg: 'hover:bg-indigo-500/10'
    },
    {
      href: '/admin/configuracion?tab=ai-rules',
      icon: Brain,
      label: 'Reglas de IA',
      color: 'text-amber-500',
      bg: 'hover:bg-amber-500/10'
    }
  ];

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider delayDuration={100}>
        {links.map((link) => (
          <Tooltip key={link.href}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={`h-9 w-9 rounded-full ${link.color} ${link.bg}`}
              >
                <Link href={link.href}>
                  <link.icon className="w-5 h-5" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        <div className="w-px h-4 bg-border mx-1 opacity-50" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Link href="/admin/configuracion?tab=architecture">
                <Cpu className="w-5 h-5" />
                <span className="sr-only">Arquitectura del Proyecto</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Arquitectura del Proyecto</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
