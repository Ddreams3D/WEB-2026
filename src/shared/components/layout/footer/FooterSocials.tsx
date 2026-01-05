import { Button } from '@/components/ui';
import { Facebook, Instagram, Music2 } from 'lucide-react';

export function FooterSocials() {
  return (
    <div className="text-center">
      <p className="text-white/60 text-sm sm:text-base mb-3">
        Síguenos en nuestras redes sociales
      </p>
      <div className="flex justify-center space-x-4">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full hover:scale-110 bg-white/10 hover:bg-white/20 text-white"
        >
          <a
            href="https://www.facebook.com/ddreams3d"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Síguenos en Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full hover:scale-110 bg-white/10 hover:bg-white/20 text-white"
        >
          <a
            href="https://www.instagram.com/ddreams3d/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Síguenos en Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full hover:scale-110 bg-white/10 hover:bg-white/20 text-white"
        >
          <a
            href="https://www.tiktok.com/@ddreams3d"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Síguenos en TikTok"
          >
            <Music2 className="w-5 h-5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
