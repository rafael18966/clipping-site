import Link from "next/link";
import { legalLinks, navLinks, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted">{site.description}</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="hover:text-white">
            Connexion
          </Link>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 {site.name}. Tous droits réservés.</p>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
