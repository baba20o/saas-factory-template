import { getFactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Co-founder",
    bio: "Former engineering lead at Atlassian. Passionate about removing friction from project planning.",
  },
  {
    name: "Sara Mitchell",
    role: "CTO & Co-founder",
    bio: "ML researcher turned builder. Previously led AI/ML teams at a Series C dev-tools startup.",
  },
  {
    name: "Jordan Park",
    role: "Head of Product",
    bio: "Product veteran with a decade of experience shipping B2B SaaS tools used by thousands of teams.",
  },
];

export default function AboutPage() {
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
          About PlanForge
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          We believe project planning should take minutes, not days. Our mission
          is to give every team an AI co-pilot that turns rough ideas into
          execution-ready roadmaps.
        </p>
      </section>

      {/* Our Story */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-10">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: branding.primary_color }}
          >
            Our Story
          </h2>
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              PlanForge started in 2025 when two engineers grew tired of spending
              entire sprint ceremonies debating task breakdowns and dependency
              chains. They had seen AI transform code generation — why not project
              planning?
            </p>
            <p>
              The first prototype could take a single sentence like
              &ldquo;migrate our monolith to microservices&rdquo; and output a
              sequenced, dependency-aware plan in seconds. Early beta testers
              reported cutting planning overhead by 80%, and PlanForge was born.
            </p>
            <p>
              Today, PlanForge powers thousands of teams — from two-person
              startups to enterprise engineering orgs — helping them ship faster
              by spending less time planning and more time building.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-semibold text-white mb-8 text-center">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 text-center hover:border-white/20 transition-colors duration-300"
            >
              {/* Abstract avatar */}
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${branding.primary_color}80, ${branding.primary_color}30)`,
                }}
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {member.name}
              </h3>
              <p
                className="text-sm font-medium mb-3"
                style={{ color: branding.primary_color }}
              >
                {member.role}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer
        logoText={branding.logo_text}
        company={footer.company}
        primaryColor={branding.primary_color}
      />
    </div>
  );
}
