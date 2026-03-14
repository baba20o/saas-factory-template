"use client";

import { useEffect, useRef, useState } from "react";

interface HowItWorksProps {
  primaryColor: string;
}

const steps = [
  {
    number: 1,
    title: "Describe Your Idea",
    description:
      "Tell us about your project in plain language. Paste a brief, a brainstorm, or even a single sentence.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "AI Generates Plan",
    description:
      "Our engine breaks down your idea into milestones, tasks, dependencies, and realistic time estimates.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
        <path d="M8.25 9.93A4.001 4.001 0 0 1 12 2" />
        <path d="M12 18v4" />
        <path d="M8 22h8" />
        <circle cx="12" cy="14" r="4" />
        <path d="M12 10v1" />
        <path d="M9.17 12.83l.71.71" />
        <path d="M14.12 12.83l-.71.71" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Export & Execute",
    description:
      "Download your plan as PDF or Markdown, or push directly to Jira, Linear, or GitHub Projects.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

/* Gradient helper per step */
const stepGradients = [
  { from: "#6366f1", to: "#818cf8" },
  { from: "#8b5cf6", to: "#a78bfa" },
  { from: "#06b6d4", to: "#22d3ee" },
];

export default function HowItWorks({ primaryColor }: HowItWorksProps) {
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

  // Override first gradient with primaryColor
  const gradients = stepGradients.map((g, i) =>
    i === 0 ? { from: primaryColor, to: stepGradients[0].to } : g
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden bg-white"
    >
      {/* Subtle radial background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full opacity-[0.03] blur-3xl pointer-events-none"
        style={{ backgroundColor: primaryColor }}
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
              color: primaryColor,
              backgroundColor: `${primaryColor}10`,
              border: `1px solid ${primaryColor}20`,
            }}
          >
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-5">
            Three steps to your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
              }}
            >
              perfect plan
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Go from rough idea to structured project plan in under a minute.
          </p>
        </div>

        {/* Steps row */}
        <div className="relative">
          {/* Connecting dashed lines (desktop only) */}
          <div className="hidden md:block absolute top-[72px] left-0 right-0 pointer-events-none">
            {/* Line between step 1 and step 2 */}
            <svg
              className="absolute"
              style={{
                left: "calc(16.67% + 48px)",
                width: "calc(33.33% - 96px)",
                top: 0,
                height: 4,
                overflow: "visible",
              }}
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke={`${primaryColor}40`}
                strokeWidth="2"
                strokeDasharray="8 6"
                style={{
                  strokeDashoffset: isVisible ? 0 : 200,
                  transition: "stroke-dashoffset 1.5s ease 0.5s",
                }}
              />
              {/* Animated dot traveling along line */}
              {isVisible && (
                <circle r="4" fill={primaryColor} opacity="0.6">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M0,2 L9999,2">
                    <mpath href="#" />
                  </animateMotion>
                </circle>
              )}
            </svg>

            {/* Line between step 2 and step 3 */}
            <svg
              className="absolute"
              style={{
                left: "calc(50% + 48px)",
                width: "calc(33.33% - 96px)",
                top: 0,
                height: 4,
                overflow: "visible",
              }}
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke={`${primaryColor}40`}
                strokeWidth="2"
                strokeDasharray="8 6"
                style={{
                  strokeDashoffset: isVisible ? 0 : 200,
                  transition: "stroke-dashoffset 1.5s ease 0.9s",
                }}
              />
            </svg>

            {/* Arrow tips */}
            <svg
              className="absolute"
              style={{
                left: "calc(50% - 56px)",
                top: -5,
                width: 14,
                height: 14,
              }}
              viewBox="0 0 14 14"
            >
              <path
                d="M4 2 L10 7 L4 12"
                fill="none"
                stroke={`${primaryColor}60`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: "opacity 0.5s ease 1.2s",
                }}
              />
            </svg>
            <svg
              className="absolute"
              style={{
                left: "calc(83.33% - 56px)",
                top: -5,
                width: 14,
                height: 14,
              }}
              viewBox="0 0 14 14"
            >
              <path
                d="M4 2 L10 7 L4 12"
                fill="none"
                stroke={`${primaryColor}60`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: "opacity 0.5s ease 1.6s",
                }}
              />
            </svg>
          </div>

          {/* Steps grid */}
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => {
              const grad = gradients[index];
              const delay = index * 300;

              return (
                <div
                  key={step.number}
                  className="group relative text-center transition-all duration-700 ease-out"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(50px)",
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {/* Icon container */}
                  <div className="relative mx-auto mb-8 w-[88px] h-[88px]">
                    {/* Outer ring */}
                    <div
                      className="absolute inset-0 rounded-3xl transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${grad.from}15, ${grad.to}10)`,
                        border: `1.5px solid ${grad.from}20`,
                      }}
                    />
                    {/* Inner icon box */}
                    <div
                      className="absolute inset-2 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover:shadow-lg"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                        boxShadow: `0 8px 20px -4px ${grad.from}40`,
                      }}
                    >
                      {step.icon}
                    </div>
                    {/* Number badge */}
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white z-10 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                        boxShadow: `0 4px 8px ${grad.from}40`,
                      }}
                    >
                      {step.number}
                    </div>
                    {/* Glow */}
                    <div
                      className="absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ backgroundColor: grad.from }}
                    />
                  </div>

                  {/* Text content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile connecting lines (vertical) */}
          <div className="md:hidden absolute left-1/2 top-[120px] bottom-[120px] w-px pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(to bottom, ${primaryColor}30 0px, ${primaryColor}30 8px, transparent 8px, transparent 16px)`,
                opacity: isVisible ? 1 : 0,
                transition: "opacity 1s ease 0.5s",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
