import { getFactoryConfig } from "@/lib/factory";

const iconMap: Record<string, string> = {
  zap: "⚡",
  clock: "⏱️",
  download: "📥",
  shield: "🛡️",
  chart: "📊",
  users: "👥",
};

export default function Home() {
  const config = getFactoryConfig();
  const { product, branding, hero, features, pricing, footer } = config;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold" style={{ color: branding.primary_color }}>
          {branding.logo_text}
        </span>
        <div className="flex items-center gap-6 text-sm">
          <a href="#features" className="hover:text-gray-600">Features</a>
          <a href="#pricing" className="hover:text-gray-600">Pricing</a>
          <a
            href={hero.cta_link}
            className="rounded-full px-4 py-2 text-white text-sm font-medium"
            style={{ backgroundColor: branding.primary_color }}
          >
            {hero.cta_text}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
          {hero.headline}
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          {hero.subheadline}
        </p>
        <a
          href={hero.cta_link}
          className="inline-block rounded-full px-8 py-3 text-white text-lg font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: branding.primary_color }}
        >
          {hero.cta_text}
        </a>
        <p className="mt-4 text-sm text-gray-400">No credit card required</p>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-4">{iconMap[f.icon] || "✨"}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-8 ${
                  tier.highlighted
                    ? "ring-2 shadow-lg"
                    : "border border-gray-200"
                }`}
                style={
                  tier.highlighted
                    ? { borderColor: branding.primary_color, boxShadow: `0 0 0 2px ${branding.primary_color}` }
                    : undefined
                }
              >
                <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {tier.price === 0 ? "Free" : `$${tier.price}`}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-gray-500">/{tier.interval}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href={hero.cta_link}
                  className={`block text-center rounded-full py-2.5 font-medium text-sm transition-opacity hover:opacity-90 ${
                    tier.highlighted
                      ? "text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    tier.highlighted
                      ? { backgroundColor: branding.primary_color }
                      : undefined
                  }
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <span>© {new Date().getFullYear()} {footer.company}</span>
          <div className="flex gap-4">
            {footer.links.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-gray-700">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
