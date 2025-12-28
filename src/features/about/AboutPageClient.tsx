'use client';
import AboutHero from './components/AboutHero';
import AboutStadistics from './components/AboutStadistics';
import AboutHistory from './components/AboutHistory';
import AboutValues from './components/AboutValues';
import AboutMisionVision from './components/AboutMisionVision';
import AboutCTA from './components/AboutCTA';

export default function AboutPageClient() {
  return (
    <main className="min-h-screen bg-background">
      <AboutHero />

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
    </main>
  );
}
