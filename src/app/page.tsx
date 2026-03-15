import { getFactoryConfig } from "@/lib/factory";
import { loadSectionComponent, DEFAULT_SECTIONS } from "@/lib/section-registry";
import type { FactoryConfig } from "@/lib/factory";

/**
 * Maps section type → props extracted from FactoryConfig.
 * Legacy components have their own prop interfaces; new variants accept { config }.
 * This bridge ensures both work.
 */
function getSectionProps(type: string, config: FactoryConfig): Record<string, any> {
  const { branding, hero, features, pricing, footer } = config;

  const propsMap: Record<string, Record<string, any>> = {
    nav: {
      logoText: branding.logo_text,
      primaryColor: branding.primary_color,
      ctaText: hero.cta_text,
      ctaLink: hero.cta_link,
    },
    hero: {
      config,
      primaryColor: branding.primary_color,
      ctaText: hero.cta_text,
      ctaLink: hero.cta_link,
    },
    features: {
      config,
      features,
      primaryColor: branding.primary_color,
    },
    "how-it-works": {
      config,
      primaryColor: branding.primary_color,
    },
    "project-graph": {
      config,
      primaryColor: branding.primary_color,
    },
    "live-metrics": {
      config,
      primaryColor: branding.primary_color,
    },
    pricing: {
      config,
      pricing,
      primaryColor: branding.primary_color,
      ctaLink: hero.cta_link,
    },
    testimonials: {
      config,
      primaryColor: branding.primary_color,
    },
    faq: {
      config,
      primaryColor: branding.primary_color,
    },
    footer: {
      config,
      logoText: branding.logo_text,
      company: footer.company,
      primaryColor: branding.primary_color,
    },
  };

  return propsMap[type] ?? { config };
}

export default async function Home() {
  const config = getFactoryConfig();
  const sections = config.landing?.sections ?? DEFAULT_SECTIONS;

  // Load all section components in parallel
  const loaded = await Promise.all(
    sections.map(async (section) => {
      const Component = await loadSectionComponent(section.type, section.variant);
      return Component ? { Component, type: section.type } : null;
    })
  );

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {loaded.map((entry, i) => {
        if (!entry) return null;
        const { Component, type } = entry;
        const props = getSectionProps(type, config);
        return <Component key={`${type}-${i}`} {...props} />;
      })}
    </div>
  );
}
