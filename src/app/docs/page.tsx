import { getFactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const docSections = [
  {
    title: "Getting Started",
    description:
      "Set up your first project in under five minutes. Learn how to create workspaces, invite collaborators, and configure your planning preferences.",
    items: [
      "Create your account and workspace",
      "Import existing projects or start fresh",
      "Configure team roles and permissions",
      "Set up your first AI-powered roadmap",
    ],
  },
  {
    title: "API Reference",
    description:
      "Integrate PlanForge into your existing workflow with our RESTful API. Manage projects, tasks, and milestones programmatically.",
    items: [
      "Authentication and API keys",
      "Projects and workspaces endpoints",
      "Tasks, milestones, and dependencies",
      "Webhooks and real-time events",
    ],
  },
  {
    title: "Integrations",
    description:
      "Connect PlanForge with the tools your team already uses. Sync data bi-directionally and automate repetitive workflows.",
    items: [
      "GitHub and GitLab integration",
      "Slack and Microsoft Teams notifications",
      "Jira and Linear import/export",
      "Zapier and custom webhooks",
    ],
  },
  {
    title: "FAQ",
    description:
      "Answers to the most common questions about PlanForge features, billing, data security, and team management.",
    items: [
      "How does AI roadmap generation work?",
      "Can I export my data at any time?",
      "What security certifications do you hold?",
      "How is pricing calculated for large teams?",
    ],
  },
];

export default function DocsPage() {
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
          Documentation
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Everything you need to get the most out of PlanForge — from quick-start
          guides to full API references.
        </p>
      </section>

      {/* Doc Sections */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {docSections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 hover:border-white/20 transition-colors duration-300"
          >
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: branding.primary_color }}
            >
              {section.title}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {section.description}
            </p>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="text-sm text-gray-500 flex items-start gap-2"
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: branding.primary_color }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-gray-600 italic">
              Coming soon — full content in progress.
            </p>
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
