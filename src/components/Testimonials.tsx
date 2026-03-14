"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  stars: number;
}

interface TestimonialsProps {
  primaryColor: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "PlanForge turned my vague startup idea into a 6-month roadmap in seconds. Game changer.",
    author: "Sarah Chen",
    role: "CTO",
    company: "NexaFlow",
    stars: 5,
  },
  {
    quote:
      "We replaced 3 planning tools with PlanForge. The AI actually understands dependencies.",
    author: "Marcus Rivera",
    role: "PM Lead",
    company: "Datalink",
    stars: 5,
  },
  {
    quote:
      "I used to spend days on project plans. Now it takes 60 seconds. Not exaggerating.",
    author: "Emily Nakamura",
    role: "Freelance Developer",
    company: "",
    stars: 5,
  },
  {
    quote:
      "The export to Jira feature alone is worth the subscription. Seamless.",
    author: "James Okafor",
    role: "Engineering Director",
    company: "CloudScale",
    stars: 4,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

function StarRating({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill={i < count ? color : "#d1d5db"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ primaryColor }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const scrollPositionRef = useRef(0);

  const animate = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isPaused) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    scrollPositionRef.current += 0.5;

    // Reset when we've scrolled halfway (the duplicated set)
    const halfScroll = container.scrollWidth / 2;
    if (scrollPositionRef.current >= halfScroll) {
      scrollPositionRef.current = 0;
    }

    container.scrollLeft = scrollPositionRef.current;
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  // Duplicate testimonials for seamless infinite scroll
  const displayTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: primaryColor }}
          >
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Loved by teams everywhere
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            See what builders, PMs, and engineering leaders say about PlanForge.
          </p>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (scrollRef.current) {
              scrollPositionRef.current = scrollRef.current.scrollLeft;
            }
            setIsPaused(false);
          }}
          className="flex gap-6 overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {displayTestimonials.map((t, i) => (
            <div
              key={`${t.author}-${i}`}
              className="flex-shrink-0 w-[340px] md:w-[380px] rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              style={{
                scrollSnapAlign: "start",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <StarRating count={t.stars} color={primaryColor} />

              <blockquote className="text-gray-700 leading-relaxed mb-6 text-[15px]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 mt-auto">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shadow-md`}
                >
                  {getInitials(t.author)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {t.author}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.role}
                    {t.company ? `, ${t.company}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
