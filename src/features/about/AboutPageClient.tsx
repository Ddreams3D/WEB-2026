'use client';
import AboutHero from './components/AboutHero';
import AboutStadistics from './components/AboutStadistics';
import AboutHistory from './components/AboutHistory';
import AboutValues from './components/AboutValues';
import AboutMisionVision from './components/AboutMisionVision';
import AboutCTA from './components/AboutCTA';

export default function AboutPageClient() {
  return (
    <div className="bg-background min-h-screen">
      <AboutHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section con Estadísticas */}
        <AboutStadistics />
        {/* Historia y Trayectoria */}
        <AboutHistory />

        {/* Misión y Visión Mejoradas */}
        <AboutMisionVision />

        {/* Valores Mejorados */}
        <AboutValues />
        
        {/* CTA */}
        <AboutCTA />
      </div>
    </div>
  );
}
