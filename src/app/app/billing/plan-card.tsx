"use client";

import { useState } from "react";

export default function PlanCard({
  name,
  price,
  interval,
  features,
  isCurrent,
  isPro,
  priceId,
  primaryColor,
}: {
  name: string;
  price: number;
  interval: string;
  features: string[];
  isCurrent: boolean;
  isPro: boolean;
  priceId: string;
  primaryColor: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (!priceId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border p-6 transition-all ${
        isCurrent
          ? "border-primary/50 bg-primary-light"
          : "border-glass-border bg-glass-surface"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
        {isCurrent && (
          <span className="text-xs font-medium text-primary bg-primary-light px-2 py-0.5 rounded-full">
            Current
          </span>
        )}
      </div>

      <div className="mb-6">
        {price === 0 ? (
          <span className="text-3xl font-bold text-text-primary">Free</span>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-text-primary">${price}</span>
            <span className="text-sm text-text-muted">/{interval}</span>
          </div>
        )}
      </div>

      <ul className="space-y-2.5 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: 'var(--color-primary)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {!isCurrent && price > 0 && !isPro && (
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-glow))',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--color-primary) 19%, transparent)',
          }}
        >
          {loading ? "Redirecting..." : "Upgrade to Pro"}
        </button>
      )}
    </div>
  );
}
