"use client";

import { useEffect, useRef, useState } from "react";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesProps {
  features: Feature[];
  primaryColor: string;
}

const iconMap: Record<string, React.ReactNode> = {
  zap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  download: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  chart: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

const defaultIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Accent gradient pairs for each card position
const accentGradients = [
  { from: "#6366f1", to: "#8b5cf6" }, // indigo -> violet
  { from: "#06b6d4", to: "#3b82f6" }, // cyan -> blue
  { from: "#f59e0b", to: "#ef4444" }, // amber -> red
];

function getGradientForIndex(index: number) {
  if (index === 0) return { from: 'var(--color-primary)', to: accentGradients[0].to };
  return accentGradients[index % accentGradients.length];
}

export default function Features({ features, primaryColor }: FeaturesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 100%)" }}
    >
      {/* Subtle background decoration */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03] blur-3xl pointer-events-none"
        style={{ background: 'var(--color-primary)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div
          className="text-center mb-20 transition-all duration-1000 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            style={{
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-light)',
              border: '1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            </span>
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-5">
            Everything you need to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--color-primary), ${accentGradients[0].to})`,
              }}
            >
              plan smarter
            </span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            Powerful tools designed to transform the way you plan, execute, and deliver projects.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const gradient = getGradientForIndex(index);
            const delay = index * 150;

            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl bg-surface-elevated p-8 transition-all duration-500 ease-out cursor-default"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateY(0) perspective(1000px) rotateX(0deg)"
                    : "translateY(40px) perspective(1000px) rotateX(2deg)",
                  transitionDelay: `${delay}ms`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform =
                    "translateY(-8px) perspective(1000px) rotateX(2deg) scale(1.02)";
                  el.style.boxShadow = `0 25px 50px -12px ${gradient.from}20, 0 12px 24px -8px rgba(0,0,0,0.08)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform =
                    "translateY(0) perspective(1000px) rotateX(0deg) scale(1)";
                  el.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)";
                }}
              >
                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}10)`,
                  }}
                />

                {/* Top accent line */}
                <div
                  className="absolute top-0 left-8 right-8 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:left-6 group-hover:right-6"
                  style={{
                    backgroundImage: `linear-gradient(90deg, transparent, ${gradient.from}, ${gradient.to}, transparent)`,
                  }}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      boxShadow: `0 8px 16px -4px ${gradient.from}40`,
                    }}
                  >
                    {iconMap[feature.icon] || defaultIcon}
                  </div>
                  {/* Soft glow behind icon */}
                  <div
                    className="absolute top-1/2 left-7 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundColor: gradient.from }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-text-primary mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed text-[15px]">
                    {feature.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div
                  className="relative z-10 mt-6 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
                  style={{ color: gradient.from }}
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
