"use client";

import Link from "next/link";
import type { FactoryConfig } from "@/lib/factory";

export default function HeroGradientMesh({ config }: { config: FactoryConfig }) {
  const { hero, product } = config;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 bg-background overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary blob */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-[100px]"
          style={{
            background: "var(--color-primary)",
            top: "10%",
            left: "15%",
            animation: "blob-1 20s ease-in-out infinite",
          }}
        />
        {/* Accent blob */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "var(--color-accent)",
            top: "40%",
            right: "10%",
            animation: "blob-2 25s ease-in-out infinite",
          }}
        />
        {/* Gradient-to blob */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-[100px]"
          style={{
            background: "var(--color-gradient-to)",
            bottom: "10%",
            left: "40%",
            animation: "blob-3 18s ease-in-out infinite",
          }}
        />
        {/* Mesh overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, var(--color-text-primary) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--color-text-primary) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-glass-surface border border-glass-border backdrop-blur-xl mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-text-secondary">Introducing {product.name}</span>
        </div>

        {/* Headline with gradient text */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8">
          <span className="text-text-primary">{hero.headline.split(" ").slice(0, -2).join(" ")} </span>
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            }}
          >
            {hero.headline.split(" ").slice(-2).join(" ")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
          {hero.subheadline}
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={hero.cta_link}
            className="group px-10 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-gradient-to))",
              boxShadow: "0 12px 40px var(--color-primary-glow)",
            }}
          >
            {hero.cta_text}
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
          <Link
            href="#features"
            className="px-10 py-4 rounded-2xl text-base font-semibold text-text-secondary border border-border hover:bg-glass-surface backdrop-blur-sm transition-all"
          >
            See how it works
          </Link>
        </div>
      </div>

      {/* Blob animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, -60px) scale(1.1); }
          66% { transform: translate(-40px, 40px) scale(0.95); }
        }
        @keyframes blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, 50px) scale(1.05); }
          66% { transform: translate(50px, -30px) scale(0.9); }
        }
        @keyframes blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 60px) scale(1.15); }
          66% { transform: translate(-80px, -20px) scale(0.95); }
        }
      `}} />
    </section>
  );
}
