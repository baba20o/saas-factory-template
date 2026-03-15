import Link from "next/link";
import type { FactoryConfig } from "@/lib/factory";

export default function FooterSimple({ config }: { config: FactoryConfig }) {
  const { branding, footer } = config;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold text-primary">
            {branding.logo_text}
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-6">
            {footer.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {footer.company}
          </p>
        </div>
      </div>
    </footer>
  );
}
