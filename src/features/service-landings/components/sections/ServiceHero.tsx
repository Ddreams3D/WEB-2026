import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button, IsotypeLogo } from '@/components/ui';
import { ServiceLandingConfig } from '@/shared/types/service-landing';
import { PHONE_BUSINESS } from '@/shared/constants/contactInfo';

import Image from 'next/image';
import { ImageComparison } from '@/components/ui/ImageComparison';

interface ServiceHeroProps {
  config: ServiceLandingConfig;
  heroSection: any;
  primaryColor: string;
  isEditable?: boolean;
  onChangeField?: (field: 'title' | 'subtitle' | 'content', value: string) => void;
}

export function ServiceHero({ config, heroSection, primaryColor, isEditable = false, onChangeField }: ServiceHeroProps) {
  // WhatsApp Logic
  const whatsappMessage = encodeURIComponent(`Hola, estoy viendo su servicio de *${config.name}* y me gustaría cotizar un proyecto.`);
  const whatsappUrl = `https://wa.me/${PHONE_BUSINESS}?text=${whatsappMessage}`;

  // SPECIAL LAYOUT: Soportes Personalizados, Merchandising & Others (Full Width + Centered)
  const isOverlayLayout = [
    'soportes-personalizados',
    'merchandising-corporativo-3d',
    'maquetas-3d',
    'modelos-anatomicos-3d',
    'prototipado-tecnico-impresion-3d'
  ].includes(config.slug);

  if (isOverlayLayout) {
    return (
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
        {/* Full Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          {config.heroImage ? (
             <Image 
               src={config.heroImage} 
               alt={heroSection?.title || config.name}
               fill
               className="object-cover"
               priority
             />
          ) : (
             <div className="w-full h-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-black/60" /> {/* Dark Overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center space-y-8 animate-fade-in-up">
            {/* Logo */}
            <div className="mb-4">
                <IsotypeLogo 
                    className="w-24 h-10 md:w-32 md:h-12" 
                    primaryColor={primaryColor}
                />
            </div>

            {/* Subtitle / Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium shadow-sm text-white">
                <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                {isEditable && onChangeField ? (
                  <input
                    className="bg-transparent border-none outline-none font-bold text-center text-white placeholder-white/50 min-w-[200px]"
                    value={heroSection?.subtitle || config.name}
                    onChange={e => onChangeField('subtitle', e.target.value)}
                  />
                ) : (
                  <span className="font-bold">
                    {heroSection?.subtitle || config.name}
                  </span>
                )}
            </div>

            {/* Title */}
            {isEditable && onChangeField ? (
              <input
                className="w-full text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white text-center bg-transparent border-b border-dashed border-white/30 focus:outline-none focus:border-primary max-w-4xl"
                value={heroSection?.title || config.name}
                onChange={e => onChangeField('title', e.target.value)}
              />
            ) : (
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white max-w-4xl">
                {heroSection?.title || config.name}
              </h1>
            )}

            {/* Description */}
             {isEditable && onChangeField ? (
                <textarea
                  className="w-full text-lg text-white/90 max-w-2xl leading-relaxed text-center bg-transparent border border-dashed border-white/30 rounded-md p-2 focus:outline-none focus:border-primary"
                  value={heroSection?.content || config.metaDescription}
                  onChange={e => onChangeField('content', e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
                  {heroSection?.content || config.metaDescription}
                </p>
              )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <Button 
                      size="lg" 
                      className="h-12 px-8 text-base font-bold tracking-wide rounded-full shadow-lg transition-all hover:scale-105 text-white hover:opacity-90 w-full sm:w-auto"
                      style={{ backgroundColor: primaryColor }}
                      asChild
                  >
                      <Link href="#coleccion">
                          Explorar Colección
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
            </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-background">
      
      {/* Dynamic Background Elements (Left Side Only) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
          {/* Gradient Orbs */}
          <div className="absolute rounded-full opacity-10 blur-[100px] w-[500px] h-[500px] -top-[10%] -right-[10%] bg-[var(--primary-color)]" />
          <div className="absolute rounded-full opacity-10 blur-[100px] w-[500px] h-[500px] -bottom-[10%] -left-[10%] bg-[var(--primary-color)]" />
          
          {/* Pattern Overlay */}
          {config.id === 'organic-modeling' ? (
              // Organic Topography Pattern
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 C 20 10 40 10 60 0 M0 20 C 20 30 40 30 60 20 M0 40 C 20 50 40 50 60 40' stroke='currentColor' fill='none' stroke-width='0.5'/%3E%3Cpath d='M11 18 C 30 25 50 25 70 18 M11 38 C 30 45 50 45 70 38' stroke='currentColor' fill='none' stroke-width='0.5' transform='rotate(90 50 50)'/%3E%3Cpath d='M0,50 Q25,25 50,50 T100,50' stroke='currentColor' fill='none' stroke-width='0.5' opacity='0.5' /%3E%3C/svg%3E"), url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.5%22/%3E%3C/svg%3E')`,
                      backgroundSize: '300px 300px, 200px 200px',
                      maskImage: 'linear-gradient(to bottom, black, transparent)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
                  }}
              />
          ) : config.id === 'trophies' ? (
              // Trophies & Medals Random Distribution (Dense & Detailed)
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.4]">
                  {/* Floating Elements Container */}
                  <div className="relative w-full h-full">
                      
                      {/* --- LAYER 1: Large Background Elements (Blurred & Slow) --- */}
                      
                      {/* Giant Trophy Top Left */}
                      <svg className="absolute -top-[10%] -left-[10%] w-96 h-96 text-current opacity-10 animate-float-slow" style={{ transform: 'rotate(-15deg)' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 2h14a1 1 0 0 1 1 1v4c0 3.313-2.687 6-6 6v4h2a2 2 0 0 1 2 2v2h-10v-2a2 2 0 0 1 2-2h2v-4c-3.313 0-6-2.687-6-6v-4a1 1 0 0 1 1-1zm2 2v4c0 2.206 1.794 4 4 4s4-1.794 4-4v-4h-8z" />
                          <path d="M19 4h2v4c0 2.206-1.794 4-4 4h-2v-2h2c1.103 0 2-.897 2-2v-4zM5 12h-2c-2.206 0-4-1.794-4-4v-4h2v4c0 1.103.897 2 2 2h2v2z" />
                      </svg>

                      {/* Giant Medal Bottom Right */}
                      <svg className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] text-current opacity-05 animate-float-slow" style={{ animationDelay: '2s', transform: 'rotate(15deg)' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 7l-5-5h10l-5 5z" opacity="0.5"/>
                          <circle cx="12" cy="15" r="7" />
                          <path d="M12 11l1.5 3h3l-2.5 2l1 3l-3-2l-3 2l1-3l-2.5-2h3z" fill="var(--background)" opacity="0.3"/>
                      </svg>


                      {/* --- LAYER 2: Mid-Size Elements (Sharper & Recognizable) --- */}

                      {/* Classic Trophy Cup (Left Mid) */}
                      <svg className="absolute top-[30%] left-[5%] w-32 h-32 text-current opacity-20 animate-float-medium" style={{ transform: 'rotate(-5deg)' }} viewBox="0 0 24 24" fill="currentColor">
                           <path d="M7 2h10v2h-10z" />
                           <path d="M17 5v4c0 2.757-2.243 5-5 5s-5-2.243-5-5v-4h10zm2-1h-12v5c0 3.86 3.141 7 7 7s7-3.14 7-7v-5z" />
                           <path d="M11 15h2v4h-2z" />
                           <path d="M7 19h10v3h-10z" />
                           <path d="M19 6h2c1.103 0 2 .897 2 2v2c0 1.103-.897 2-2 2h-2v-6zm-14 0h-2c-1.103 0-2 .897-2 2v2c0 1.103.897 2 2 2h2v-6z" />
                      </svg>

                      {/* Star Trophy (Right Top) */}
                      <svg className="absolute top-[15%] right-[20%] w-28 h-28 text-current opacity-20 animate-float-medium" style={{ animationDelay: '1.5s', transform: 'rotate(10deg)' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                          <rect x="7" y="20" width="10" height="4" rx="1" />
                      </svg>

                      {/* Medal with Ribbon (Center Bottom) */}
                      <svg className="absolute bottom-[25%] left-[35%] w-24 h-24 text-current opacity-25 animate-float-medium" style={{ animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.5 2l-2.5 6l-2.5-6h-4l5 12h8l5-12z" opacity="0.7"/>
                          <circle cx="12" cy="16" r="6" />
                          <path d="M12 13l1 2h2l-1.5 1.5l0.5 2l-2-1.5l-2 1.5l0.5-2l-1.5-1.5h2z" fill="var(--background)" opacity="0.5"/>
                      </svg>
                      
                      {/* Winner Badge (Top Right Corner) */}
                      <svg className="absolute top-[5%] right-[5%] w-20 h-20 text-current opacity-15 animate-float-slow" style={{ animationDelay: '3s', transform: 'rotate(20deg)' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3 5h5l-4 4l1 5l-5-3l-5 3l1-5l-4-4h5z" />
                          <path d="M12 22l-4-4h8z" opacity="0.5"/>
                      </svg>


                      {/* --- LAYER 3: Small Fillers (High Density) --- */}

                      {/* Small Cups */}
                      <svg className="absolute top-[55%] left-[20%] w-12 h-12 text-current opacity-30 animate-float-fast" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V2zm6 12v6m-4 0h8" stroke="currentColor" strokeWidth="2" /></svg>
                      <svg className="absolute top-[80%] right-[30%] w-14 h-14 text-current opacity-20 animate-float-fast" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V2zm6 12v6m-4 0h8" stroke="currentColor" strokeWidth="2" /></svg>
                      <svg className="absolute top-[40%] right-[10%] w-10 h-10 text-current opacity-30 animate-float-fast" style={{ animationDelay: '2s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V2zm6 12v6m-4 0h8" stroke="currentColor" strokeWidth="2" /></svg>

                      {/* Small Medals (Replaced circles with actual medal shapes) */}
                      <svg className="absolute top-[20%] left-[45%] w-8 h-8 text-current opacity-40 animate-float-medium" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 7l-5-5h10l-5 5z" opacity="0.5"/>
                          <circle cx="12" cy="15" r="5" />
                          <path d="M12 12l1 2h2l-1.5 1.5l0.5 2l-2-1.5l-2 1.5l0.5-2l-1.5-1.5h2z" fill="var(--background)" opacity="0.5"/>
                      </svg>
                      <svg className="absolute bottom-[40%] left-[10%] w-10 h-10 text-current opacity-30 animate-float-medium" style={{ animationDelay: '1.5s' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 7l-5-5h10l-5 5z" opacity="0.5"/>
                          <circle cx="12" cy="15" r="5" />
                          <path d="M12 12l1 2h2l-1.5 1.5l0.5 2l-2-1.5l-2 1.5l0.5-2l-1.5-1.5h2z" fill="var(--background)" opacity="0.5"/>
                      </svg>
                      <svg className="absolute top-[70%] right-[45%] w-12 h-12 text-current opacity-25 animate-float-medium" style={{ animationDelay: '0.8s' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 7l-5-5h10l-5 5z" opacity="0.5"/>
                          <circle cx="12" cy="15" r="5" />
                          <path d="M12 12l1 2h2l-1.5 1.5l0.5 2l-2-1.5l-2 1.5l0.5-2l-1.5-1.5h2z" fill="var(--background)" opacity="0.5"/>
                      </svg>

                      {/* Stars / Sparkles */}
                      <svg className="absolute top-[10%] left-[25%] w-6 h-6 text-yellow-500 opacity-60 animate-pulse" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>
                      <svg className="absolute bottom-[15%] left-[50%] w-8 h-8 text-yellow-400 opacity-50 animate-pulse" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>
                      <svg className="absolute top-[50%] right-[5%] w-5 h-5 text-yellow-600 opacity-70 animate-pulse" style={{ animationDelay: '2s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>
                      <svg className="absolute top-[35%] left-[80%] w-7 h-7 text-yellow-300 opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>
                      <svg className="absolute bottom-[5%] right-[20%] w-6 h-6 text-yellow-500 opacity-60 animate-pulse" style={{ animationDelay: '1.2s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>

                      {/* Confetti Particles */}
                    <div className="absolute top-[25%] left-[15%] w-1.5 h-1.5 bg-current rounded-full opacity-30 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute top-[65%] left-[60%] w-2 h-2 bg-current rounded-full opacity-20 animate-ping" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-[35%] right-[40%] w-1 h-1 bg-current rounded-full opacity-40 animate-ping" style={{ animationDuration: '2.5s' }} />
                    <div className="absolute top-[15%] right-[35%] w-1.5 h-1.5 bg-current rounded-full opacity-25 animate-ping" style={{ animationDuration: '5s' }} />
                    {/* Extra Confetti */}
                    <div className="absolute top-[45%] left-[5%] w-2 h-2 bg-current rounded-full opacity-25 animate-ping" style={{ animationDuration: '3.5s' }} />
                    <div className="absolute bottom-[20%] right-[60%] w-1 h-1 bg-current rounded-full opacity-35 animate-ping" style={{ animationDuration: '2.8s' }} />
                    <div className="absolute top-[85%] left-[30%] w-1.5 h-1.5 bg-current rounded-full opacity-30 animate-ping" style={{ animationDuration: '4.2s' }} />
                    <div className="absolute bottom-[55%] right-[10%] w-2 h-2 bg-current rounded-full opacity-20 animate-ping" style={{ animationDuration: '3.8s' }} />

                    {/* --- EXTRA DUPLICATED ELEMENTS (For Density) --- */}

                    {/* Extra Classic Trophy (Bottom Right) */}
                    <svg className="absolute bottom-[10%] right-[25%] w-28 h-28 text-current opacity-20 animate-float-medium" style={{ transform: 'rotate(10deg)', animationDelay: '1.2s' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 2h10v2h-10z" />
                        <path d="M17 5v4c0 2.757-2.243 5-5 5s-5-2.243-5-5v-4h10zm2-1h-12v5c0 3.86 3.141 7 7 7s7-3.14 7-7v-5z" />
                        <path d="M11 15h2v4h-2z" />
                        <path d="M7 19h10v3h-10z" />
                        <path d="M19 6h2c1.103 0 2 .897 2 2v2c0 1.103-.897 2-2 2h-2v-6zm-14 0h-2c-1.103 0-2 .897-2 2v2c0 1.103.897 2 2 2h2v-6z" />
                    </svg>

                    {/* Extra Star Trophy (Bottom Left) */}
                    <svg className="absolute bottom-[20%] left-[5%] w-24 h-24 text-current opacity-20 animate-float-medium" style={{ animationDelay: '2.5s', transform: 'rotate(-8deg)' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                        <rect x="7" y="20" width="10" height="4" rx="1" />
                    </svg>

                    {/* Extra Medal with Ribbon (Top Left) */}
                    <svg className="absolute top-[10%] left-[35%] w-20 h-20 text-current opacity-25 animate-float-medium" style={{ animationDelay: '1.8s' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.5 2l-2.5 6l-2.5-6h-4l5 12h8l5-12z" opacity="0.7"/>
                        <circle cx="12" cy="16" r="6" />
                        <path d="M12 13l1 2h2l-1.5 1.5l0.5 2l-2-1.5l-2 1.5l0.5-2l-1.5-1.5h2z" fill="var(--background)" opacity="0.5"/>
                    </svg>

                    {/* Extra Winner Badge (Center Left) */}
                    <svg className="absolute top-[45%] left-[2%] w-16 h-16 text-current opacity-15 animate-float-slow" style={{ animationDelay: '0.3s', transform: 'rotate(-10deg)' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3 5h5l-4 4l1 5l-5-3l-5 3l1-5l-4-4h5z" />
                        <path d="M12 22l-4-4h8z" opacity="0.5"/>
                    </svg>

                    {/* Extra Small Cups */}
                    <svg className="absolute top-[5%] right-[55%] w-10 h-10 text-current opacity-30 animate-float-fast" style={{ animationDelay: '2.2s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V2zm6 12v6m-4 0h8" stroke="currentColor" strokeWidth="2" /></svg>
                    <svg className="absolute bottom-[50%] right-[5%] w-12 h-12 text-current opacity-25 animate-float-fast" style={{ animationDelay: '0.7s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V2zm6 12v6m-4 0h8" stroke="currentColor" strokeWidth="2" /></svg>
                    <svg className="absolute bottom-[5%] left-[40%] w-11 h-11 text-current opacity-30 animate-float-fast" style={{ animationDelay: '3.1s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V2zm6 12v6m-4 0h8" stroke="currentColor" strokeWidth="2" /></svg>

                    {/* Extra Small Medals */}
                    <svg className="absolute top-[35%] left-[65%] w-9 h-9 text-current opacity-35 animate-float-medium" style={{ animationDelay: '1.4s' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7l-5-5h10l-5 5z" opacity="0.5"/>
                        <circle cx="12" cy="15" r="5" />
                        <path d="M12 12l1 2h2l-1.5 1.5l0.5 2l-2-1.5l-2 1.5l0.5-2l-1.5-1.5h2z" fill="var(--background)" opacity="0.5"/>
                    </svg>
                    <svg className="absolute top-[8%] right-[15%] w-10 h-10 text-current opacity-30 animate-float-medium" style={{ animationDelay: '2.8s' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7l-5-5h10l-5 5z" opacity="0.5"/>
                        <circle cx="12" cy="15" r="5" />
                        <path d="M12 12l1 2h2l-1.5 1.5l0.5 2l-2-1.5l-2 1.5l0.5-2l-1.5-1.5h2z" fill="var(--background)" opacity="0.5"/>
                    </svg>
                    <svg className="absolute bottom-[15%] right-[50%] w-8 h-8 text-current opacity-40 animate-float-medium" style={{ animationDelay: '0.6s' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7l-5-5h10l-5 5z" opacity="0.5"/>
                        <circle cx="12" cy="15" r="5" />
                        <path d="M12 12l1 2h2l-1.5 1.5l0.5 2l-2-1.5l-2 1.5l0.5-2l-1.5-1.5h2z" fill="var(--background)" opacity="0.5"/>
                    </svg>

                    {/* Extra Stars / Sparkles */}
                    <svg className="absolute top-[60%] left-[10%] w-5 h-5 text-yellow-500 opacity-60 animate-pulse" style={{ animationDelay: '1.9s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>
                    <svg className="absolute bottom-[30%] right-[5%] w-7 h-7 text-yellow-400 opacity-50 animate-pulse" style={{ animationDelay: '2.3s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>
                    <svg className="absolute top-[20%] right-[50%] w-4 h-4 text-yellow-600 opacity-70 animate-pulse" style={{ animationDelay: '0.4s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>
                    <svg className="absolute bottom-[10%] left-[80%] w-6 h-6 text-yellow-300 opacity-50 animate-pulse" style={{ animationDelay: '3.5s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>
                    <svg className="absolute top-[90%] left-[50%] w-5 h-5 text-yellow-500 opacity-60 animate-pulse" style={{ animationDelay: '1.6s' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5 4l2 7-7-5-7 5 2-7-5-4h7z" /></svg>
                  </div>
              </div>
          ) : (
              // Standard Grid Pattern
              <div className="absolute inset-0 opacity-[0.03]" 
                  style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
              />
          )}
      </div>

      {/* Left Column: Text Content */}
      <div className="relative z-10 flex flex-col justify-center p-6 lg:p-16 xl:p-24 order-2 lg:order-1">
          <div className="max-w-xl mx-auto lg:mx-0 w-full space-y-6 lg:space-y-8 animate-fade-in-up">
              {/* Logo */}
              <div className="flex justify-center lg:justify-start">
                  <IsotypeLogo 
                      className="w-24 h-10 md:w-32 md:h-12" 
                      primaryColor={primaryColor}
                  />
              </div>

              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-muted/50 backdrop-blur-md border border-border/50 text-sm font-medium shadow-sm w-fit mx-auto lg:mx-0">
                  <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                  {isEditable && onChangeField ? (
                    <input
                      className="bg-transparent border-none outline-none font-bold text-center lg:text-left"
                      style={{ color: primaryColor }}
                      value={heroSection?.subtitle || config.name}
                      onChange={e => onChangeField('subtitle', e.target.value)}
                    />
                  ) : (
                    <span
                      className="font-bold"
                      style={{ color: primaryColor }}
                    >
                      {heroSection?.subtitle || config.name}
                    </span>
                  )}
              </div>
              
              {isEditable && onChangeField ? (
                <input
                  className="w-full text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[1.1] text-foreground text-center lg:text-left bg-transparent border-b border-dashed border-muted focus:outline-none focus:border-primary"
                  value={heroSection?.title || config.name}
                  onChange={e => onChangeField('title', e.target.value)}
                />
              ) : (
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[1.1] text-foreground text-center lg:text-left">
                  {heroSection?.title || config.name}
                </h1>
              )}
              
              {isEditable && onChangeField ? (
                <textarea
                  className="w-full text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed text-center lg:text-left bg-transparent border border-dashed border-muted rounded-md p-2 focus:outline-none focus:border-primary"
                  value={heroSection?.content || config.metaDescription}
                  onChange={e => onChangeField('content', e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed text-center lg:text-left">
                  {heroSection?.content || config.metaDescription}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Button 
                      size="lg" 
                      className="h-12 px-8 text-base font-bold tracking-wide rounded-full shadow-lg transition-all hover:scale-105 text-white hover:opacity-90 w-full sm:w-auto"
                      style={{ backgroundColor: primaryColor }}
                      asChild
                  >
                      <Link href="#coleccion">
                          Explorar Servicio
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
                  {!(config.slug === 'modelado-3d-personalizado' || config.id === 'organic-modeling') && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-8 text-base rounded-full w-full sm:w-auto"
                      asChild
                    >
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                          Solicitar Presupuesto
                      </a>
                    </Button>
                  )}
              </div>
          </div>
      </div>

      {/* Right Column: Hero Image / Slider (Full Bleed) */}
      <div className="relative h-[50vh] lg:h-full w-full order-2 lg:order-2 group">
          {config.id === 'trophies' ? (
                // 🏆 CUSTOM PODIUM SCENE FOR TROPHIES LANDING
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                    
                    {/* Podium Illustration */}
                  <div className="relative w-full max-w-2xl px-4 animate-fade-in-up">
                      <svg viewBox="0 -150 600 600" className="w-full h-auto drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                              <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#FCD34D" />
                                  <stop offset="100%" stopColor="#F59E0B" />
                              </linearGradient>
                              <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#E2E8F0" />
                                  <stop offset="100%" stopColor="#94A3B8" />
                              </linearGradient>
                              <linearGradient id="bronze-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#FDBA74" />
                                  <stop offset="100%" stopColor="#C2410C" />
                              </linearGradient>
                              <filter id="glow">
                                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                  <feMerge>
                                      <feMergeNode in="coloredBlur"/>
                                      <feMergeNode in="SourceGraphic"/>
                                  </feMerge>
                              </filter>
                          </defs>

                          {/* --- 2nd Place (Left) --- */}
                          <g transform="translate(50, 150)">
                              {/* Base */}
                              <path d="M0 40 L140 40 L140 200 L0 200 Z" fill="url(#silver-grad)" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                              <path d="M0 40 L40 0 L180 0 L140 40 Z" fill="#F8FAFC" opacity="0.8" />
                              <path d="M140 40 L180 0 L180 160 L140 200 Z" fill="#64748B" opacity="0.4" />
                              <text x="70" y="140" fontSize="80" fontWeight="bold" fill="white" textAnchor="middle" opacity="0.9" style={{ fontFamily: 'var(--font-sans)' }}>2</text>
                              
                              {/* Image Viewer Floating Above */}
                              <g transform="translate(25, -160)">
                                  <g className="animate-float-medium cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(148,163,184,0.9)]" style={{ animationDelay: '0.5s' }}>
                                      <defs>
                                          <clipPath id="clip-silver">
                                              <rect x="0" y="0" width="130" height="130" rx="10" />
                                          </clipPath>
                                      </defs>
                                      <rect x="-4" y="-4" width="138" height="138" rx="14" fill="#94A3B8" opacity="0.5" />
                                      <image href="https://placehold.co/260x260/e2e8f0/475569.png?text=Trofeo+2" x="0" y="0" width="130" height="130" clipPath="url(#clip-silver)" preserveAspectRatio="xMidYMid slice" />
                                      <rect x="0" y="0" width="130" height="130" rx="10" fill="none" stroke="white" strokeWidth="2" />
                                  </g>
                              </g>
                          </g>

                          {/* --- 3rd Place (Right) --- */}
                          <g transform="translate(410, 180)">
                              {/* Base */}
                              <path d="M0 40 L140 40 L140 170 L0 170 Z" fill="url(#bronze-grad)" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                              <path d="M0 40 L40 0 L180 0 L140 40 Z" fill="#FFF7ED" opacity="0.8" />
                              <path d="M140 40 L180 0 L180 130 L140 170 Z" fill="#7C2D12" opacity="0.4" />
                              <text x="70" y="125" fontSize="80" fontWeight="bold" fill="white" textAnchor="middle" opacity="0.9" style={{ fontFamily: 'var(--font-sans)' }}>3</text>
                              
                              {/* Image Viewer Floating Above */}
                              <g transform="translate(25, -150)">
                                  <g className="animate-float-medium cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(194,65,12,0.9)]" style={{ animationDelay: '1s' }}>
                                      <defs>
                                          <clipPath id="clip-bronze">
                                              <rect x="0" y="0" width="130" height="130" rx="10" />
                                          </clipPath>
                                      </defs>
                                      <rect x="-4" y="-4" width="138" height="138" rx="14" fill="#C2410C" opacity="0.5" />
                                      <image href="https://placehold.co/260x260/ffedd5/c2410c.png?text=Trofeo+3" x="0" y="0" width="130" height="130" clipPath="url(#clip-bronze)" preserveAspectRatio="xMidYMid slice" />
                                      <rect x="0" y="0" width="130" height="130" rx="10" fill="none" stroke="white" strokeWidth="2" />
                                  </g>
                              </g>
                          </g>

                          {/* --- 1st Place (Center - Front) --- */}
                          <g transform="translate(210, 80)">
                              {/* Base */}
                              <path d="M0 40 L180 40 L180 270 L0 270 Z" fill="url(#gold-grad)" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                              <path d="M0 40 L40 0 L220 0 L180 40 Z" fill="#FFFBEB" opacity="0.9" />
                              <path d="M180 40 L220 0 L220 230 L180 270 Z" fill="#B45309" opacity="0.4" />
                              <text x="90" y="180" fontSize="120" fontWeight="900" fill="white" textAnchor="middle" filter="url(#glow)" style={{ fontFamily: 'var(--font-sans)' }}>1</text>
                              
                              {/* Image Viewer Floating Above (Larger) */}
                              <g transform="translate(30, -200)">
                                  <g className="animate-float-slow cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_25px_rgba(245,158,11,1)]">
                                      <defs>
                                          <clipPath id="clip-gold">
                                              <rect x="0" y="0" width="160" height="160" rx="12" />
                                          </clipPath>
                                      </defs>
                                  {/* Glow Effect behind 1st place image */}
                                  <circle cx="80" cy="80" r="100" fill="url(#gold-grad)" opacity="0.3" filter="blur(20px)" />
                                  
                                  <rect x="-5" y="-5" width="170" height="170" rx="16" fill="#F59E0B" opacity="0.6" />
                                  <image href="https://placehold.co/320x320/fef3c7/d97706.png?text=Trofeo+1" x="0" y="0" width="160" height="160" clipPath="url(#clip-gold)" preserveAspectRatio="xMidYMid slice" />
                                  <rect x="0" y="0" width="160" height="160" rx="12" fill="none" stroke="white" strokeWidth="3" />
                                  
                                  {/* Shine effect */}
                                  <path d="M0 160 L160 0" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
                              </g>
                          </g>
                          </g>
                      </svg>
                      
                      {/* Reflection/Shadow on floor */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/20 blur-xl rounded-[100%]" />
                  </div>
              </div>
          ) : config.heroImageComparison ? (
              <ImageComparison 
                beforeImage={config.heroImage || "https://placehold.co/800x800/e2e8f0/475569.png?text=Escultura+Real"}
                afterImage={config.heroImageComparison}
                beforeLabel="Escultura Real"
                afterLabel="Modelo 3D"
                primaryColor={primaryColor}
                className="h-full w-full"
              />
          ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 lg:hidden" />
                <Image 
                    src={config.heroImage || "https://placehold.co/800x800/e2e8f0/475569.png?text=Escultura+Real"} 
                    alt={config.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </>
          )}
          
          {/* Overlay gradient for text readability on mobile if needed, or aesthetic */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-background/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-background lg:via-transparent lg:to-transparent opacity-50" />
      </div>
    </section>
  );
}
