"use client";

import { useEffect, useState } from "react";

interface NavProps {
  logoText?: string;
  primaryColor?: string;
  ctaText?: string;
  ctaLink?: string;
}

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];

export default function Nav({
  logoText = "PlanForge",
  ctaText = "Get Started",
  ctaLink = "/signup",
}: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-glass-border bg-background/80 shadow-lg shadow-black/20 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 shadow-md shadow-purple-500/20">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-text-primary">{logoText}</span>
          </a>

          {/* Center links — desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-200 hover:bg-white/5 hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side — desktop */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
            >
              Log in
            </a>
            <a
              href={ctaLink}
              className="group relative inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/35 hover:brightness-110 active:scale-[0.97]"
            >
              <span className="absolute -inset-[2px] -z-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-50" />
              {ctaText}
              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
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
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary md:hidden"
            aria-label="Toggle menu"
          >
            <div className="flex w-5 flex-col items-center gap-[5px]">
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/90 backdrop-blur-xl"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-glass-border bg-surface/95 px-8 pt-24 pb-8 backdrop-blur-2xl transition-transform duration-500 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-lg font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="my-6 h-px bg-glass-border" />

          <a
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl px-4 py-3 text-lg font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Log in
          </a>

          <a
            href={ctaLink}
            onClick={() => setMobileOpen(false)}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:brightness-110"
          >
            {ctaText}
            <svg
              className="h-4 w-4"
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

          {/* Bottom decoration */}
          <div className="mt-auto text-center text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {logoText}. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
