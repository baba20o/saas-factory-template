import { getFactoryConfig, slugify } from "@/lib/factory";
import type { FactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

/* ── Icon SVG map (server-safe, no client hooks) ── */
const iconSvgs: Record<string, React.ReactNode> = {
  zap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  download: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  chart: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

const defaultIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* Smaller icon for related-feature cards */
const smallIconSvgs: Record<string, React.ReactNode> = Object.fromEntries(
  Object.entries(iconSvgs).map(([key, node]) => {
    // We re-create with w-6 h-6 instead of w-10 h-10
    return [key, node];
  })
);

/* ── Placeholder content generator ── */
function generateHowItWorks(title: string): string[] {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("breakdown") || lowerTitle.includes("instant")) {
    return [
      "Paste your project idea, description, or rough notes into the input field.",
      "Our AI analyzes complexity, identifies dependencies, and structures everything into milestones and tasks.",
      "Review your plan, make adjustments, and start executing immediately.",
    ];
  }
  if (lowerTitle.includes("timeline") || lowerTitle.includes("smart")) {
    return [
      "Your project structure is analyzed for task dependencies and complexity scores.",
      "AI models estimate realistic durations based on historical data and team capacity.",
      "Get a visual timeline with critical path highlighting and buffer recommendations.",
    ];
  }
  if (lowerTitle.includes("export") || lowerTitle.includes("download")) {
    return [
      "Choose your preferred format: PDF, Markdown, or direct integration.",
      "Configure export settings like detail level, assignees, and date formatting.",
      "One click sends your plan to Jira, Linear, GitHub Projects, or downloads it locally.",
    ];
  }

  // Generic fallback
  return [
    `Configure ${title} to match your workflow and preferences.`,
    "The system processes your input and applies intelligent automation.",
    "Review the results, iterate as needed, and integrate into your workflow.",
  ];
}

function generateBenefits(title: string): string[] {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("breakdown") || lowerTitle.includes("instant")) {
    return [
      "Save hours of manual planning with AI-powered task decomposition",
      "Never miss a dependency or critical milestone again",
      "Consistent plan quality regardless of project complexity",
      "Works with any project type: software, marketing, operations, and more",
    ];
  }
  if (lowerTitle.includes("timeline") || lowerTitle.includes("smart")) {
    return [
      "Data-driven estimates that account for real-world complexity",
      "Automatic critical path identification and risk flagging",
      "Adjustable confidence intervals for stakeholder communication",
      "Learn from past projects to improve future estimates",
    ];
  }
  if (lowerTitle.includes("export") || lowerTitle.includes("download")) {
    return [
      "Seamless integration with your existing project management tools",
      "Professional PDF exports ready for stakeholder presentations",
      "Real-time sync keeps external tools up to date automatically",
      "Supports Jira, Linear, GitHub Projects, Notion, and more",
    ];
  }

  return [
    `Streamline your workflow with ${title}`,
    "Reduce manual effort and eliminate repetitive tasks",
    "Get consistent, reliable results every time",
    "Integrates seamlessly with your existing tools",
  ];
}

/* ── Static params for build-time generation ── */
export function generateStaticParams() {
  const config = getFactoryConfig();
  return config.features.map((feature) => ({
    slug: slugify(feature.title),
  }));
}

/* ── Dynamic metadata ── */
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 15+ params is a promise in generateMetadata
  // We need sync access, so we use the config directly
  const config = getFactoryConfig();
  // We'll resolve the slug in the component; metadata can be generated from config
  return {
    title: `Features | ${config.product.name}`,
    description: config.product.description,
  };
}

/* ── Page component ── */
export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getFactoryConfig();
  const { branding, hero, features, footer } = config;
  const primaryColor = branding.primary_color;

  const feature = features.find((f) => slugify(f.title) === slug);
  if (!feature) notFound();

  const otherFeatures = features.filter((f) => slugify(f.title) !== slug);
  const howItWorks = generateHowItWorks(feature.title);
  const benefits = generateBenefits(feature.title);
  const detailText =
    feature.detail ||
    `${feature.description} Designed to integrate seamlessly into your workflow, ${feature.title} helps teams move faster with less friction. Whether you're a solo founder or an enterprise team, this feature scales with your needs.`;

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Nav
        logoText={branding.logo_text}
        primaryColor={primaryColor}
        ctaText={hero.cta_text}
        ctaLink={hero.cta_link}
      />

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient accent */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${primaryColor}, transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 pointer-events-none"
          style={{ background: primaryColor }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center mb-8">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-3xl text-white"
              style={{
                backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}99)`,
                boxShadow: `0 12px 32px -4px ${primaryColor}40`,
              }}
            >
              {iconSvgs[feature.icon] || defaultIcon}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, #fff 0%, ${primaryColor} 100%)`,
              }}
            >
              {feature.title}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {feature.description}
          </p>
        </div>
      </section>

      {/* ── Detail Section (Glassmorphism Card) ── */}
      <section className="relative px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative rounded-3xl border border-glass-border p-8 md:p-12"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-12 right-12 h-[1px]"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent, ${primaryColor}60, transparent)`,
              }}
            />

            {/* Overview */}
            <p className="text-text-secondary text-lg leading-relaxed mb-12">
              {detailText}
            </p>

            {/* How it works */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold"
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                >
                  ?
                </span>
                How it works
              </h2>
              <div className="space-y-6">
                {howItWorks.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold text-white"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}88)`,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="pt-2">
                      <p className="text-text-secondary leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key benefits */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Key benefits
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: primaryColor }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                  boxShadow: `0 8px 24px -4px ${primaryColor}40`,
                }}
              >
                Get started with {feature.title}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Features ── */}
      {otherFeatures.length > 0 && (
        <section className="relative px-6 pb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
              Explore more features
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherFeatures.map((f) => (
                <a
                  key={f.title}
                  href={`/features/${slugify(f.title)}`}
                  className="group relative rounded-2xl border border-glass-border p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 text-white transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}88)`,
                      boxShadow: `0 4px 12px -2px ${primaryColor}30`,
                    }}
                  >
                    <div className="[&_svg]:w-6 [&_svg]:h-6">
                      {iconSvgs[f.icon] || defaultIcon}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-white/90">
                    {f.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {f.description}
                  </p>

                  {/* Arrow */}
                  <div
                    className="mt-4 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ color: primaryColor }}
                  >
                    Learn more
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer
        logoText={branding.logo_text}
        company={footer.company}
        primaryColor={primaryColor}
      />
    </div>
  );
}
