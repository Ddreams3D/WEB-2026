'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from '@/lib/icons';
import Link from 'next/link';
import { heroImages } from '../../config/images';
import Image from 'next/image';
import { useIntersectionAnimation, useStaggeredItemsAnimation, getAnimationClasses } from '../hooks/useIntersectionAnimation';
import { 
  getButtonClasses, 
  getTransitionClasses, 
  getIconClasses
} from '../styles';

const slides = [
  {
    id: 1,
    title: "Innovación en Impresión 3D",
    description: "Transformamos tus ideas en realidad con la última tecnología en impresión 3D",
    image: heroImages.innovation
  },
  {
    id: 2,
    title: "Precisión y Calidad",
    description: "Cada proyecto es ejecutado con la máxima atención al detalle",
    image: heroImages.precision
  },
  {
    id: 3,
    title: "Soluciones Personalizadas",
    description: "Adaptamos nuestros servicios a tus necesidades específicas",
    image: heroImages.solutions
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  // Animation hooks
  const { ref: heroRef, isVisible } = useIntersectionAnimation();
  const { visibleItems } = useStaggeredItemsAnimation(slides.length, 200);

  useEffect(() => {
    // Verificar que estamos en el cliente antes de usar window
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches) {
        setIsPlaying(false);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isPlaying || isReducedMotion) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, isReducedMotion]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextSlide();
        break;
      case ' ':
        e.preventDefault();
        togglePlayPause();
        break;
    }
  }, [nextSlide, prevSlide, togglePlayPause]);

  return (
    <section 
      ref={heroRef}
      className={`relative h-screen w-full overflow-hidden pt-20 ${getAnimationClasses(isVisible)}`}
      role="banner"
      aria-label="Carrusel principal de Ddreams 3D"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-live="polite"
      aria-atomic="false"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${index + 1} de ${slides.length}`}
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover w-full h-full"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div 
              className={`text-center text-white max-w-5xl px-4 sm:px-6 lg:px-8 ${getAnimationClasses(visibleItems?.[index] || false, index)}`}
            >
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight ${getAnimationClasses(visibleItems?.[index] || false, index)}`}>
                {slide.title}
              </h1>
              <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-7 md:mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed ${getAnimationClasses(visibleItems?.[index] || false, index)}`}>
                {slide.description}
              </p>
              <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center ${getAnimationClasses(visibleItems?.[index] || false, index)}`}>
                <Link 
                  href="/contact"
                  className={`${getButtonClasses('primary', 'lg')} w-full sm:w-auto sm:min-w-[200px] justify-center group`}
                  aria-label="Comenzar un nuevo proyecto de impresión 3D"
                >
                  Comenzar Proyecto
                  <svg className={`ml-2 ${getIconClasses('md')} group-hover:translate-x-1 ${getTransitionClasses('transform')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  href="/marketplace"
                  className={`${getButtonClasses('secondary', 'lg')} w-full sm:w-auto sm:min-w-[200px] justify-center group`}
                  aria-label="Explorar productos disponibles en el marketplace"
                >
                  Ver Productos
                  <svg className={`ml-2 ${getIconClasses('md')} group-hover:translate-x-1 ${getTransitionClasses('transform')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-sm rounded-full px-6 py-3">
          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full ${getTransitionClasses()} ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Play/Pause Button */}
          {!isReducedMotion && (
            <button
              onClick={togglePlayPause}
              className={`p-2 text-white hover:text-gray-200 ${getTransitionClasses('colors')}`}
              aria-label={isPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
            >
              {isPlaying ? (
                <Pause className={getIconClasses('sm')} />
              ) : (
                <Play className={getIconClasses('sm')} />
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white ${getTransitionClasses()} hover:scale-105`}
        aria-label="Slide anterior"
      >
        <ChevronLeft className={getIconClasses('lg')} />
      </button>
      
      <button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white ${getTransitionClasses()} hover:scale-105`}
        aria-label="Slide siguiente"
      >
        <ChevronRight className={getIconClasses('lg')} />
      </button>
    </section>
  );
}