import Link from "next/link";
import type { FactoryConfig } from "@/lib/factory";

export default function FooterMinimal({ config }: { config: FactoryConfig }) {
  const { branding, footer } = config;

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-text-muted">
        <Link href="/" className="font-semibold text-primary hover:opacity-80 transition-opacity">
          {branding.logo_text}
        </Link>
        <span>&copy; {new Date().getFullYear()} {footer.company}</span>
      </div>
    </footer>
  );
}
