import { getFactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const testimonials = [
  {
    quote:
      "We cut our sprint planning time by 80%. The AI breakdown is shockingly good — it catches dependencies we used to miss.",
    author: "Maria Santos",
    title: "Engineering Manager",
    company: "Vercel",
  },
  {
    quote:
      "Went from rough idea to a fully sequenced project plan in under a minute. Game changer for our remote team.",
    author: "James Liu",
    title: "CTO",
    company: "NovaTech",
  },
  {
    quote:
      "The Jira export alone saved us hours a week. Now our PMs spend time building, not formatting tickets.",
    author: "Priya Patel",
    title: "VP of Product",
    company: "Stackline",
  },
  {
    quote:
      "We evaluated every planning tool on the market. PlanForge is the only one that actually understands software projects.",
    author: "David Kim",
    title: "Head of Engineering",
    company: "Lattice",
  },
  {
    quote:
      "Our onboarding for new PMs dropped from 2 weeks to 2 days. They just describe the project and PlanForge handles the rest.",
    author: "Alex Rivera",
    title: "Director of Operations",
    company: "Figma",
  },
  {
    quote:
      "The smart timelines are eerily accurate. Our estimates improved by 3x since switching.",
    author: "Rachel Green",
    title: "Senior PM",
    company: "Linear",
  },
];

const stats = [
  { value: "2,500+", label: "Teams using PlanForge" },
  { value: "80%", label: "Average time saved on planning" },
  { value: "150K+", label: "Plans generated" },
  { value: "4.9/5", label: "Average customer rating" },
];

export default function CustomersPage() {
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
          Trusted by teams that ship
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          From startups to enterprise engineering orgs, thousands of teams rely
          on PlanForge to plan faster and build smarter.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 text-center"
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: branding.primary_color }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 hover:border-white/20 transition-colors duration-300"
            >
              <p className="text-sm text-gray-300 leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="text-sm font-semibold text-white">
                  {t.author}
                </div>
                <div className="text-xs text-gray-500">
                  {t.title}, {t.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 pb-24">
        <h2 className="text-2xl font-bold text-white mb-4">
          Join thousands of teams shipping faster
        </h2>
        <a
          href={hero.cta_link}
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.primary_color}dd)`,
            boxShadow: `0 4px 20px ${branding.primary_color}40`,
          }}
        >
          {hero.cta_text}
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </section>

      <Footer
        logoText={branding.logo_text}
        company={footer.company}
        primaryColor={branding.primary_color}
      />
    </div>
  );
}
