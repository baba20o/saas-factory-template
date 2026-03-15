import Link from "next/link";
import type { FactoryConfig } from "@/lib/factory";

export default function HeroMinimal({ config }: { config: FactoryConfig }) {
  const { hero, product } = config;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 bg-background overflow-hidden">
      {/* Subtle gradient orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: "var(--color-primary)" }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light border border-primary/20 mb-8">
          <span className="text-xs font-medium text-primary">{product.name}</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6">
          {hero.headline}
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          {hero.subheadline}
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href={hero.cta_link}
            className="px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:brightness-110 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-gradient-to))",
              boxShadow: "0 8px 32px var(--color-primary-glow)",
            }}
          >
            {hero.cta_text}
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 rounded-2xl text-base font-semibold text-text-secondary border border-border hover:bg-glass-surface transition-all"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
