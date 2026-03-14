"use client";

import { useEffect, useState, lazy, Suspense } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

interface HeroProps {
  logoText?: string;
  primaryColor?: string;
  ctaText?: string;
  ctaLink?: string;
}

const DEMO_LINES = [
  { label: "Project scope", width: "w-[85%]", delay: "0.8s" },
  { label: "Sprint breakdown", width: "w-[72%]", delay: "1.6s" },
  { label: "Resource allocation", width: "w-[90%]", delay: "2.4s" },
  { label: "Risk analysis", width: "w-[65%]", delay: "3.2s" },
  { label: "Timeline & milestones", width: "w-[78%]", delay: "4.0s" },
];

export default function Hero({
  primaryColor = "#6366f1",
  ctaText = "Start Planning Free",
  ctaLink = "/signup",
}: HeroProps) {
  const [subheadlineVisible, setSubheadlineVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSubheadlineVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050510]">
      {/* ── Three.js 3D background ── */}
      <Suspense fallback={
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#1a0533] via-[#0a1628] to-[#050510]" />
      }>
        <HeroScene primaryColor={primaryColor} />
      </Suspense>

      {/* ── Subtle grid overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-36 pb-24 text-center lg:pt-44">
        {/* Badge */}
        <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
          </span>
          Now in public beta
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="block text-white">Ship projects</span>
          <span
            className="animate-shimmer bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(105deg, #a855f7 0%, #6366f1 25%, #3b82f6 50%, #6366f1 75%, #a855f7 100%)",
              backgroundSize: "250% 100%",
            }}
          >
            10x faster with AI
          </span>
        </h1>

        {/* Subheadline — fade-in */}
        <p
          className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 transition-all duration-1000 sm:text-xl ${
            subheadlineVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          PlanForge turns a single sentence into a full project plan — sprints,
          milestones, risk analysis, and resource allocation — in seconds, not
          weeks.
        </p>

        {/* CTA */}
        <div
          className="animate-fade-in-up mt-10 flex flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.5s" }}
        >
          <a
            href={ctaLink}
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:brightness-110 active:scale-[0.98]"
          >
            {/* Glow ring */}
            <span className="absolute -inset-[3px] -z-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-60" />
            {ctaText}
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>

          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch demo
          </a>
        </div>

        {/* ── Demo preview mockup ── */}
        <div
          id="demo"
          className="animate-fade-in-up mx-auto mt-20 w-full max-w-3xl"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 shadow-2xl shadow-purple-500/10 backdrop-blur-md">
            {/* Title bar */}
            <div className="flex items-center gap-2 rounded-t-xl bg-white/[0.04] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-3 flex-1 rounded-md bg-white/5 px-4 py-1 text-xs text-slate-500">
                app.planforge.dev/project/new
              </span>
            </div>

            {/* Browser body */}
            <div className="rounded-b-xl bg-[#0c0c1d] px-6 py-6">
              {/* Prompt area */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                  <svg
                    className="h-4 w-4 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </div>
                <div className="text-sm text-slate-300">
                  &quot;Build a marketplace app with payments and reviews&quot;
                </div>
                <span className="ml-auto animate-pulse rounded-md bg-purple-500/20 px-2 py-0.5 text-[11px] font-medium text-purple-400">
                  Generating...
                </span>
              </div>

              {/* Animated lines */}
              <div className="space-y-3">
                {DEMO_LINES.map((line, i) => (
                  <div
                    key={i}
                    className="animate-demo-line flex items-center gap-3 opacity-0"
                    style={{ animationDelay: line.delay }}
                  >
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-green-500/20 text-[10px] text-green-400">
                      ✓
                    </span>
                    <span className="text-xs text-slate-400">{line.label}</span>
                    <div className="flex-1">
                      <div
                        className={`${line.width} h-1.5 rounded-full bg-gradient-to-r from-purple-500/40 to-blue-500/40`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Social proof / stats bar ── */}
        <div
          className="animate-fade-in-up mx-auto mt-16 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4"
          style={{ animationDelay: "0.9s" }}
        >
          {[
            { value: "10,000+", label: "Plans created" },
            { value: "4.9★", label: "Avg. rating" },
            { value: "50+", label: "Integrations" },
            { value: "< 30s", label: "Avg. plan time" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-5 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Keyframe styles ── */}
      <style jsx>{`
        @keyframes hero-gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-hero-gradient {
          animation: hero-gradient 15s ease infinite;
        }

        @keyframes blob-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(60px, 40px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 70px) scale(0.95);
          }
        }
        .animate-blob-1 {
          animation: blob-1 20s ease-in-out infinite;
        }

        @keyframes blob-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-50px, 30px) scale(1.08);
          }
          66% {
            transform: translate(40px, -50px) scale(0.92);
          }
        }
        .animate-blob-2 {
          animation: blob-2 24s ease-in-out infinite;
        }

        @keyframes blob-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(70px, -40px) scale(1.05);
          }
          66% {
            transform: translate(-60px, -20px) scale(0.97);
          }
        }
        .animate-blob-3 {
          animation: blob-3 22s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: -100% 50%;
          }
        }
        .animate-shimmer {
          animation: shimmer 4s linear infinite;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        @keyframes demo-line {
          0% {
            opacity: 0;
            transform: translateX(-12px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-demo-line {
          animation: demo-line 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
