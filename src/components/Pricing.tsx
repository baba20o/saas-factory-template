"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PricingTier {
  name: string;
  price: number;
  interval: string;
  stripe_price_id: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

interface PricingProps {
  pricing: PricingTier[];
  primaryColor: string;
  ctaLink: string;
}

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                             */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (target === 0) {
      setValue(0);
      return;
    }

    let startTime: number | null = null;
    let raf: number;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  Ripple effect hook                                                */
/* ------------------------------------------------------------------ */
function useRipple() {
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([]);

  const addRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    },
    []
  );

  return { ripples, addRipple };
}

/* ------------------------------------------------------------------ */
/*  Animated checkmark SVG                                            */
/* ------------------------------------------------------------------ */
function AnimatedCheck({
  delay,
  color,
  visible,
}: {
  delay: number;
  color: string;
  visible: boolean;
}) {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity 0.3s ease ${delay}ms`,
      }}
    >
      <circle cx="12" cy="12" r="11" fill={`${color}15`} />
      <path
        d="M7.5 12.5L10.5 15.5L16.5 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 20,
          strokeDashoffset: visible ? 0 : 20,
          transition: `stroke-dashoffset 0.5s ease ${delay + 200}ms`,
        }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Button with ripple                                            */
/* ------------------------------------------------------------------ */
function CTAButton({
  label,
  highlighted,
  primaryColor,
  priceId,
  ctaLink,
  loading,
  onClick,
}: {
  label: string;
  highlighted: boolean;
  primaryColor: string;
  priceId: string;
  ctaLink: string;
  loading: boolean;
  onClick: () => void;
}) {
  const { ripples, addRipple } = useRipple();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    addRipple(e);
    onClick();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="relative block w-full text-center rounded-2xl py-3.5 font-semibold text-[15px] transition-all duration-300 overflow-hidden disabled:opacity-50 cursor-pointer"
      style={
        highlighted
          ? {
              color: "#fff",
              backgroundImage: `linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 87%, transparent))`,
              boxShadow: `0 8px 24px -4px color-mix(in srgb, var(--color-primary) 31%, transparent)`,
            }
          : {
              color: 'var(--color-primary)',
              backgroundColor: 'color-mix(in srgb, var(--color-primary) 3%, transparent)',
              border: `1.5px solid color-mix(in srgb, var(--color-primary) 19%, transparent)`,
            }
      }
      onMouseEnter={(e) => {
        if (highlighted) {
          e.currentTarget.style.boxShadow = `0 12px 32px -4px color-mix(in srgb, var(--color-primary) 44%, transparent)`;
          e.currentTarget.style.transform = "translateY(-1px)";
        } else {
          e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--color-primary) 8%, transparent)`;
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (highlighted) {
          e.currentTarget.style.boxShadow = `0 8px 24px -4px color-mix(in srgb, var(--color-primary) 31%, transparent)`;
          e.currentTarget.style.transform = "translateY(0)";
        } else {
          e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--color-primary) 3%, transparent)`;
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none pricing-ripple"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            backgroundColor: highlighted ? "rgba(255,255,255,0.4)" : `color-mix(in srgb, var(--color-primary) 19%, transparent)`,
          }}
        />
      ))}
      <span className="relative z-10">
        {loading ? "Loading..." : label}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Pricing component                                            */
/* ------------------------------------------------------------------ */
export default function Pricing({ pricing, primaryColor, ctaLink }: PricingProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

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
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function handleCheckout(tier: PricingTier) {
    if (!tier.stripe_price_id) {
      window.location.href = ctaLink;
      return;
    }

    setLoadingId(tier.name);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: tier.stripe_price_id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        window.location.href = "/signup";
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden bg-surface-elevated"
    >
      {/* Background orbs */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ backgroundColor: 'var(--color-primary)' }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-3xl pointer-events-none"
        style={{ backgroundColor: 'var(--color-primary)' }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
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
            Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-5">
            Simple, transparent{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--color-primary), #8b5cf6)`,
              }}
            >
              pricing
            </span>
          </h2>
          <p className="text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto items-start">
          {pricing.map((tier, index) => {
            const delay = index * 200;

            return (
              <PricingCard
                key={tier.name}
                tier={tier}
                primaryColor={primaryColor}
                ctaLink={ctaLink}
                isVisible={isVisible}
                delay={delay}
                loading={loadingId === tier.name}
                onCheckout={() => handleCheckout(tier)}
              />
            );
          })}
        </div>
      </div>

      {/* Global keyframes for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes ripple-expand {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(20); opacity: 0; }
        }
        .pricing-ripple {
          animation: ripple-expand 0.6s ease-out forwards;
        }
      `}} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Individual pricing card                                           */
/* ------------------------------------------------------------------ */
function PricingCard({
  tier,
  primaryColor,
  ctaLink,
  isVisible,
  delay,
  loading,
  onCheckout,
}: {
  tier: PricingTier;
  primaryColor: string;
  ctaLink: string;
  isVisible: boolean;
  delay: number;
  loading: boolean;
  onCheckout: () => void;
}) {
  const animatedPrice = useCountUp(tier.price, 1200, isVisible);

  return (
    <div
      className="relative rounded-3xl p-[1px] transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? tier.highlighted
            ? "translateY(-12px)"
            : "translateY(0)"
          : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Gradient border for highlighted card */}
      {tier.highlighted && (
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, var(--color-primary), #8b5cf6, var(--color-primary))`,
            backgroundSize: "200% 200%",
            animation: "gradient-shift 3s ease infinite",
          }}
        />
      )}

      <div
        className={`relative rounded-3xl p-8 md:p-10 h-full ${
          tier.highlighted ? "bg-surface-elevated" : "bg-surface-elevated border border-border/80"
        }`}
        style={
          tier.highlighted
            ? {
                boxShadow: `0 25px 60px -12px color-mix(in srgb, var(--color-primary) 15%, transparent), 0 0 0 1px color-mix(in srgb, var(--color-primary) 6%, transparent)`,
              }
            : undefined
        }
      >
        {/* Popular badge */}
        {tier.highlighted && (
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full text-xs font-bold tracking-widest text-white uppercase"
            style={{
              backgroundImage: `linear-gradient(135deg, var(--color-primary), #8b5cf6)`,
              boxShadow: `0 4px 12px color-mix(in srgb, var(--color-primary) 25%, transparent)`,
            }}
          >
            Popular
          </div>
        )}

        {/* Plan name */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            {tier.name}
          </h3>
          <p className="text-sm text-text-secondary">
            {tier.highlighted
              ? "For teams and power users"
              : "Perfect for getting started"}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8 flex items-baseline gap-1">
          {tier.price === 0 ? (
            <span className="text-5xl font-extrabold tracking-tight text-text-primary">
              Free
            </span>
          ) : (
            <>
              <span className="text-2xl font-bold text-text-secondary">$</span>
              <span
                className="text-6xl font-extrabold tracking-tight"
                style={{ color: tier.highlighted ? 'var(--color-primary)' : 'var(--color-text-primary)' }}
              >
                {animatedPrice}
              </span>
            </>
          )}
          {tier.price > 0 && (
            <span className="text-text-secondary text-sm font-medium ml-1">
              /{tier.interval}
            </span>
          )}
        </div>

        {/* Divider */}
        <div
          className="h-px mb-8"
          style={{
            backgroundImage: tier.highlighted
              ? `linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-primary) 19%, transparent), transparent)`
              : "linear-gradient(90deg, transparent, var(--color-border), transparent)",
          }}
        />

        {/* Features list */}
        <ul className="space-y-4 mb-10">
          {tier.features.map((feat, i) => (
            <li key={feat} className="flex items-start gap-3 text-sm text-text-muted">
              <AnimatedCheck
                delay={i * 100}
                color={tier.highlighted ? 'var(--color-primary)' : "#10b981"}
                visible={isVisible}
              />
              <span className="leading-relaxed">{feat}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <CTAButton
          label={tier.cta}
          highlighted={tier.highlighted}
          primaryColor={primaryColor}
          priceId={tier.stripe_price_id}
          ctaLink={ctaLink}
          loading={loading}
          onClick={onCheckout}
        />
      </div>

      {/* Gradient border uses CSS animation defined in global styles below */}
    </div>
  );
}
