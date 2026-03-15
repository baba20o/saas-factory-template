import type { ComponentType } from "react";
import type { FactoryConfig } from "./factory";

export interface SectionProps {
  config: FactoryConfig;
}

// Each loader returns a module with a default export component.
// Using `any` for props since legacy components have their own interfaces
// and new variants use SectionProps. The bridge in page.tsx handles mapping.
type SectionModule = { default: ComponentType<any> };
type SectionLoader = () => Promise<SectionModule>;

// Registry maps type → { variant → dynamic import loader }
const registry: Record<string, Record<string, SectionLoader>> = {
  nav: {
    default: () => import("@/components/Nav"),
  },
  hero: {
    "3d-orbs": () => import("@/components/Hero"),
    "gradient-mesh": () => import("@/components/heroes/HeroGradientMesh"),
    particles: () => import("@/components/heroes/HeroParticles"),
    minimal: () => import("@/components/heroes/HeroMinimal"),
    default: () => import("@/components/Hero"),
  },
  features: {
    cards: () => import("@/components/Features"),
    default: () => import("@/components/Features"),
  },
  "how-it-works": {
    steps: () => import("@/components/HowItWorks"),
    default: () => import("@/components/HowItWorks"),
  },
  "project-graph": {
    "force-directed": () => import("@/components/ProjectGraph"),
    default: () => import("@/components/ProjectGraph"),
  },
  "live-metrics": {
    sparklines: () => import("@/components/LiveMetrics"),
    default: () => import("@/components/LiveMetrics"),
  },
  pricing: {
    cards: () => import("@/components/Pricing"),
    default: () => import("@/components/Pricing"),
  },
  testimonials: {
    carousel: () => import("@/components/Testimonials"),
    default: () => import("@/components/Testimonials"),
  },
  faq: {
    accordion: () => import("@/components/FAQ"),
    default: () => import("@/components/FAQ"),
  },
  footer: {
    full: () => import("@/components/Footer"),
    simple: () => import("@/components/footers/FooterSimple"),
    minimal: () => import("@/components/footers/FooterMinimal"),
    default: () => import("@/components/Footer"),
  },
};

/**
 * Load a section component by type and optional variant.
 * Returns the component (default export) or null if not found.
 */
export async function loadSectionComponent(
  type: string,
  variant?: string
): Promise<ComponentType<any> | null> {
  const variants = registry[type];
  if (!variants) return null;

  const loader =
    (variant && variants[variant]) ?? variants.default ?? Object.values(variants)[0];
  if (!loader) return null;

  const mod = await loader();
  return mod.default;
}

/**
 * Register a new section variant at runtime.
 */
export function registerSection(type: string, variant: string, loader: SectionLoader) {
  if (!registry[type]) registry[type] = {};
  registry[type][variant] = loader;
}

/** Default sections when no `landing.sections` is configured in factory.yaml */
export const DEFAULT_SECTIONS: Array<{ type: string; variant?: string }> = [
  { type: "nav" },
  { type: "hero", variant: "3d-orbs" },
  { type: "features", variant: "cards" },
  { type: "how-it-works", variant: "steps" },
  { type: "project-graph", variant: "force-directed" },
  { type: "live-metrics", variant: "sparklines" },
  { type: "testimonials", variant: "carousel" },
  { type: "pricing", variant: "cards" },
  { type: "faq", variant: "accordion" },
  { type: "footer", variant: "full" },
];
