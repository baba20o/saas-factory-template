"use client";

import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--color-gradient-to) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-gradient-to))" }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary">PlanForge</span>
          </a>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl p-8 shadow-2xl">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 text-center text-sm text-text-muted">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
