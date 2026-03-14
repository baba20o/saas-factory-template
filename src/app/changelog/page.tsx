import { getFactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const releases = [
  {
    version: "v1.2.0",
    date: "March 5, 2026",
    changes: [
      "AI sprint planner now supports custom velocity inputs",
      "Added Gantt chart export to PDF and PNG",
      "New Slack integration for real-time milestone notifications",
      "Improved dependency detection accuracy by 35%",
    ],
  },
  {
    version: "v1.1.0",
    date: "February 10, 2026",
    changes: [
      "Launched team workspaces with role-based access control",
      "Roadmap templates for common project types (SaaS launch, migration, redesign)",
      "Dark mode support across all dashboard views",
      "Bug fix: duplicate tasks no longer generated for circular dependencies",
    ],
  },
  {
    version: "v1.0.1",
    date: "January 20, 2026",
    changes: [
      "Fixed edge case where large projects exceeded generation timeout",
      "Improved onboarding flow with interactive walkthrough",
      "Updated API rate limits documentation",
    ],
  },
  {
    version: "v1.0.0",
    date: "January 2, 2026",
    changes: [
      "Initial public release of PlanForge",
      "AI-powered roadmap generation from natural language descriptions",
      "Task breakdown with dependency mapping",
      "Stripe-powered subscription billing (Pro plan)",
      "GitHub integration for issue sync",
    ],
  },
];

export default function ChangelogPage() {
  const config = getFactoryConfig();
  const { branding, hero, footer } = config;

  return (
    <div className="min-h-screen bg-[#050510] text-gray-100">
      <Nav
        logoText={branding.logo_text}
        primaryColor={branding.primary_color}
        ctaText={hero.cta_text}
        ctaLink={hero.cta_link}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Changelog
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A history of everything we&apos;ve shipped. Follow along as PlanForge
          gets better every week.
        </p>
      </section>

      {/* Releases */}
      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-8">
        {releases.map((release) => (
          <div
            key={release.version}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 hover:border-white/20 transition-colors duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <span
                className="text-sm font-mono font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${branding.primary_color}20`,
                  color: branding.primary_color,
                }}
              >
                {release.version}
              </span>
              <time className="text-sm text-gray-500">{release.date}</time>
            </div>
            <ul className="space-y-2">
              {release.changes.map((change, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-400 flex items-start gap-2"
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: branding.primary_color }}
                  />
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <Footer
        logoText={branding.logo_text}
        company={footer.company}
        primaryColor={branding.primary_color}
      />
    </div>
  );
}
