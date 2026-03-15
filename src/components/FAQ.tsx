"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  primaryColor: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does the AI generate project plans?",
    answer:
      "PlanForge uses advanced AI models to analyze your project description, identify milestones and tasks, estimate timelines based on complexity, and map dependencies between work items. The more detail you provide, the more accurate the plan.",
  },
  {
    question: "Can I edit the generated plans?",
    answer:
      "Absolutely. Every plan is fully editable. Add, remove, or modify tasks, adjust timelines, and reorganize milestones. PlanForge gives you a strong starting point that you customize to perfection.",
  },
  {
    question: "What integrations are supported?",
    answer:
      "Pro users can export to Jira, Linear, GitHub Projects, Notion, and Asana. You can also download plans as PDF, Markdown, or CSV for use anywhere.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes! Start with our free tier (3 plans/month) and upgrade to Pro anytime. Your first 14 days of Pro are free, no credit card required.",
  },
  {
    question: "How secure is my data?",
    answer:
      "All data is encrypted at rest and in transit. We use Supabase for authentication and database, with row-level security. We never share your project data with third parties.",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
  primaryColor,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  primaryColor: string;
}) {
  return (
    <div
      className="border-b border-border last:border-b-0 transition-colors duration-200"
      style={
        isOpen
          ? { borderColor: 'color-mix(in srgb, var(--color-primary) 19%, transparent)' }
          : undefined
      }
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-1 text-left group cursor-pointer"
      >
        <span
          className="text-[15px] md:text-base font-medium text-text-primary pr-4 transition-colors duration-200"
          style={isOpen ? { color: 'var(--color-primary)' } : undefined}
        >
          {item.question}
        </span>
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-md"
          style={{
            backgroundColor: isOpen ? 'var(--color-primary)' : '#f3f4f6',
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg
            className="w-4 h-4 transition-colors duration-200"
            fill="none"
            stroke={isOpen ? "white" : "#6b7280"}
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m7-7H5"
            />
          </svg>
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? "200px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="text-text-muted text-sm leading-relaxed pb-5 px-1 pr-12">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ({ primaryColor }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-6 bg-surface/70">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3 text-primary"
          >
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4">
            Frequently asked questions
          </h2>
          <p className="text-text-muted">
            Everything you need to know about PlanForge.
          </p>
        </div>

        <div
          className="bg-surface-elevated rounded-2xl shadow-sm border border-border px-6 md:px-8"
          style={{
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          }}
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              primaryColor={primaryColor}
            />
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-text-muted">
          Still have questions?{" "}
          <a
            href="mailto:support@planforge.dev"
            className="font-medium underline underline-offset-2 transition-colors duration-200 hover:opacity-80 text-primary"
          >
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
}
