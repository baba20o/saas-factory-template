"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { FactoryConfig } from "@/lib/factory";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const num = parseInt(hex.replace("#", ""), 16);
  return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff };
}

export default function HeroParticles({ config }: { config: FactoryConfig }) {
  const { hero, product } = config;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim();
    const rgb = hexToRgb(primaryColor || "#6366f1");

    function resize() {
      canvas!.width = canvas!.offsetWidth * window.devicePixelRatio;
      canvas!.height = canvas!.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function init() {
      resize();
      particles.length = 0;
      const count = Math.min(80, Math.floor((canvas!.offsetWidth * canvas!.offsetHeight) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas!.offsetWidth,
          y: Math.random() * canvas!.offsetHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${p.opacity})`;
        ctx!.fill();
      }

      // Draw connections
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.08 * (1 - dist / maxDist)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 bg-background overflow-hidden">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />

      {/* Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-15 blur-[120px] pointer-events-none"
        style={{ background: "var(--color-primary)" }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-glass-surface border border-glass-border backdrop-blur-sm mb-8">
          <span className="text-xs font-medium text-primary">{product.name}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6">
          {hero.headline}
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          {hero.subheadline}
        </p>

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
