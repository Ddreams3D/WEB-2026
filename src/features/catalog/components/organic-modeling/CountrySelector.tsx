import React, { useState, useMemo } from 'react';
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { Search, Check, ChevronDown } from 'lucide-react';

export interface Country {
  name: string;
  code: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { name: 'Perú', code: '+51', flag: '🇵🇪' },
  { name: 'México', code: '+52', flag: '🇲🇽' },
  { name: 'Colombia', code: '+57', flag: '🇨🇴' },
  { name: 'Chile', code: '+56', flag: '🇨🇱' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷' },
  { name: 'España', code: '+34', flag: '🇪🇸' },
  { name: 'Estados Unidos', code: '+1', flag: '🇺🇸' },
  { name: 'Ecuador', code: '+593', flag: '🇪🇨' },
  { name: 'Venezuela', code: '+58', flag: '🇻🇪' },
  { name: 'Bolivia', code: '+591', flag: '🇧🇴' },
  { name: 'Uruguay', code: '+598', flag: '🇺🇾' },
  { name: 'Paraguay', code: '+595', flag: '🇵🇾' },
  { name: 'Brasil', code: '+55', flag: '🇧🇷' },
  { name: 'Costa Rica', code: '+506', flag: '🇨🇷' },
  { name: 'Panamá', code: '+507', flag: '🇵🇦' },
  { name: 'Rep. Dominicana', code: '+1', flag: '🇩🇴' },
  { name: 'Guatemala', code: '+502', flag: '🇬🇹' },
  { name: 'El Salvador', code: '+503', flag: '🇸🇻' },
  { name: 'Honduras', code: '+504', flag: '🇭🇳' },
  { name: 'Nicaragua', code: '+505', flag: '🇳🇮' },
];

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCountry = COUNTRIES.find(c => c.code === value) || COUNTRIES[0];

  const filteredCountries = useMemo(() => {
    if (!search) return COUNTRIES;
    const lower = search.toLowerCase();
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      c.code.includes(lower)
    );
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-auto py-1 px-2 gap-1.5 font-normal text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-sm">{selectedCountry.code}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 bg-popover border border-border shadow-lg" align="start">
        <div className="p-2 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Buscar país..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs border-none bg-muted/50 focus-visible:ring-0"
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-[200px] overflow-y-auto py-1">
          {filteredCountries.length === 0 ? (
            <div className="py-2 px-4 text-xs text-muted-foreground text-center">
              No se encontraron países.
            </div>
          ) : (
            filteredCountries.map((country) => (
              <Button
                key={`${country.code}-${country.name}`}
                variant="ghost"
                className={`w-full justify-start h-8 px-2 text-sm font-normal ${
                  value === country.code ? 'bg-accent text-accent-foreground' : ''
                }`}
                onClick={() => {
                  onChange(country.code);
                  setOpen(false);
                  setSearch('');
                }}
              >
                <span className="mr-2 text-lg leading-none">{country.flag}</span>
                <span className="flex-1 text-left truncate">{country.name}</span>
                <span className="ml-auto text-muted-foreground text-xs">{country.code}</span>
                {value === country.code && (
                  <Check className="ml-2 h-3.5 w-3.5 text-primary" />
                )}
              </Button>
            ))
          )}
          <Button
            variant="ghost"
            className="w-full justify-start h-8 px-2 text-sm font-normal text-muted-foreground hover:text-foreground"
            onClick={() => {
              onChange('manual');
              setOpen(false);
              setSearch('');
            }}
          >
            <span className="mr-2 text-lg leading-none">🌐</span>
            <span className="flex-1 text-left">Otro código</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
