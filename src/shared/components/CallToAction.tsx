import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ButtonRedirectWhatsapp from '@/shared/components/ButtonRedirectWhatsapp';
import { cn } from '@/lib/utils';

interface CallToActionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  showWhatsapp?: boolean;
  whatsappText?: string;
  className?: string;
}

export default function CallToAction({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  showWhatsapp = true,
  whatsappText,
  className,
}: CallToActionProps) {
  return (
    <section className={cn("py-20", className)} aria-labelledby="cta-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-[length:200%_auto] transition-all duration-500 ease-in-out bg-left hover:bg-right",
            "rounded-xl shadow-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden"
          )}
        >
          <div
            className={cn("absolute inset-0 backdrop-blur-sm", "bg-gradient-to-r from-primary-500/20 to-secondary-500/20")}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h2
              id="cta-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg"
            >
              {title}
            </h2>
            <p className="text-sm sm:text-base text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed opacity-95">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                variant="default"
                size="lg"
                className="gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link
                  href={primaryButtonLink}
                  aria-label={primaryButtonText}
                  className="flex items-center gap-2"
                >
                  <span className="sm:hidden">{primaryButtonText}</span>
                  <span className="hidden sm:inline">{primaryButtonText}</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </Button>
              {showWhatsapp && <ButtonRedirectWhatsapp text={whatsappText} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
