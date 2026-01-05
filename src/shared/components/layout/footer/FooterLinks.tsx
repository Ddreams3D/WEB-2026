import Link from 'next/link';

export function FooterLinks() {
  return (
    <div className="flex flex-wrap justify-start gap-4 text-sm sm:text-base">
      <Link
        href="/services"
        className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
      >
        Servicios
      </Link>
      <span className="text-white/40 hidden sm:inline">•</span>
      <Link
        href="/catalogo-impresion-3d"
        className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
      >
        Catálogo
      </Link>
      <span className="text-white/40 hidden sm:inline">•</span>
      <Link
        href="/process"
        className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
      >
        Proceso
      </Link>
      <span className="text-white/40 hidden sm:inline">•</span>
      <Link
        href="/about"
        className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
      >
        Nosotros
      </Link>
      <span className="text-white/40 hidden sm:inline">•</span>
      <Link
        href="/contact"
        className="text-white/60 hover:text-primary transition-colors duration-200 font-medium"
      >
        Contacto
      </Link>
    </div>
  );
}
