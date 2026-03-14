import { getFactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const posts = [
  {
    date: "March 10, 2026",
    title: "Introducing AI-Powered Sprint Planning",
    excerpt:
      "Let PlanForge analyze your backlog, team velocity, and upcoming deadlines to automatically suggest optimal sprint compositions — saving hours of manual grooming every week.",
    slug: "#",
  },
  {
    date: "February 22, 2026",
    title: "How We Reduced Roadmap Creation Time by 80%",
    excerpt:
      "A deep dive into the machine-learning pipeline behind PlanForge's roadmap generator: how we turn a one-paragraph idea into a fully sequenced, dependency-aware project plan.",
    slug: "#",
  },
  {
    date: "January 15, 2026",
    title: "5 Common Project Planning Mistakes (and How to Avoid Them)",
    excerpt:
      "From scope creep to unrealistic timelines, we break down the pitfalls that derail projects and show how structured AI assistance keeps teams on track.",
    slug: "#",
  },
];

export default function BlogPage() {
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
          Blog
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Insights, updates, and tips from the PlanForge team.
        </p>
      </section>

      {/* Posts Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 flex flex-col hover:border-white/20 transition-colors duration-300"
          >
            <time className="text-xs text-gray-500 mb-3">{post.date}</time>
            <h2 className="text-lg font-semibold text-white mb-3 leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed flex-1">
              {post.excerpt}
            </p>
            <a
              href={post.slug}
              className="mt-6 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all duration-200"
              style={{ color: branding.primary_color }}
            >
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </article>
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
