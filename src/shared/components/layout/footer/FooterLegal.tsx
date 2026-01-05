import Link from 'next/link';

export function FooterLegal() {
  return (
    <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs sm:text-sm">
      <Link
        href="/terms"
        className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
      >
        Términos de Servicio
      </Link>
      <span className="text-white/40 hidden sm:inline">•</span>
      <Link
        href="/privacy"
        className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
      >
        Política de Privacidad
      </Link>
      <span className="text-white/40 hidden sm:inline">•</span>
      <Link
        href="/complaints"
        className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
      >
        Libro de Reclamaciones
      </Link>
    </div>
  );
}
