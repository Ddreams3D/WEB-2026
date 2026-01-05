import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollManager } from '@/hooks/useScrollRestoration';
import { trackEvent, AnalyticsEvents, AnalyticsLocations } from '@/lib/analytics';

interface NavLink {
  href: string;
  label: string;
  ariaLabel: string;
}

interface NavbarDesktopLinksProps {
  links: NavLink[];
  pathname: string;
  isNavbarSolid: boolean;
  darkMode: boolean;
}

export const NavbarDesktopLinks = ({ links, pathname, isNavbarSolid, darkMode }: NavbarDesktopLinksProps) => {
  return (
    <div className="hidden lg:flex items-center space-x-1">
      {links.map((link) => (
        <Button
          key={link.href}
          asChild
          variant="ghost"
          className={cn(
            "text-sm font-medium transition-all duration-300",
            pathname === link.href
              ? cn(
                  "shadow-sm hover:shadow-md",
                  isNavbarSolid && !darkMode
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "bg-white/20 text-white hover:bg-white/30"
                )
              : cn(
                  !isNavbarSolid 
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : darkMode 
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                )
          )}
        >
          <Link
            href={link.href}
            aria-label={link.ariaLabel}
            onClick={() => {
              if (link.href === '/catalogo-impresion-3d') {
                trackEvent(AnalyticsEvents.VIEW_CATALOG_CLICK, { location: AnalyticsLocations.NAVBAR });
              }
              
              if (typeof window !== 'undefined') {
                ScrollManager.clear(link.href);
              }
            }}
          >
            {link.label}
          </Link>
        </Button>
      ))}
    </div>
  );
};
