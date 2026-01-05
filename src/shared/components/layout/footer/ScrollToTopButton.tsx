'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { ChevronUp } from 'lucide-react';

export function ScrollToTopButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (window.scrollY / totalHeight) * 100;
      setShowScrollTop(scrollPercentage > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!showScrollTop) return null;

  return (
    <Button
      onClick={scrollToTop}
      variant="ghost"
      size="icon"
      className="fixed bottom-6 right-6 z-40 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 border border-white/10 hover:-translate-y-1 shadow-lg text-white"
      aria-label="Volver arriba"
    >
      <ChevronUp className="w-5 h-5" />
    </Button>
  );
}
