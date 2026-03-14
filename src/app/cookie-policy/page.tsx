import { getFactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function CookiePolicyPage() {
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

      <article className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Cookie Policy
        </h1>
        <p className="text-gray-500 text-center mb-16 text-sm">
          Last updated: March 1, 2026
        </p>

        <div className="space-y-10 text-gray-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              What Are Cookies
            </h2>
            <p>
              Cookies are small text files that are stored on your computer or
              mobile device when you visit a website. They are widely used to
              make websites work more efficiently, provide a better user
              experience, and supply reporting information to site owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              How We Use Cookies
            </h2>
            <p>PlanForge uses cookies for the following purposes:</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-500">
              <li>
                <strong className="text-gray-300">Essential cookies:</strong>{" "}
                Required for user authentication, session management, and
                security. The Service cannot function properly without these.
              </li>
              <li>
                <strong className="text-gray-300">Preference cookies:</strong>{" "}
                Remember your settings such as theme preference, language, and
                workspace layout.
              </li>
              <li>
                <strong className="text-gray-300">Analytics cookies:</strong>{" "}
                Help us understand how visitors interact with PlanForge so we
                can improve the product. These collect anonymous, aggregated
                data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Third-Party Cookies
            </h2>
            <p>
              In some cases, we use cookies provided by trusted third parties.
              These include analytics services (such as privacy-focused
              alternatives to traditional trackers) and payment processors
              (Stripe). These third parties have their own privacy and cookie
              policies which we encourage you to review.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Managing Cookies
            </h2>
            <p>
              Most web browsers allow you to control cookies through their
              settings. You can set your browser to refuse cookies or to alert
              you when cookies are being sent. Please note that disabling
              essential cookies may prevent you from using certain features of
              PlanForge, including signing in to your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Cookie Retention
            </h2>
            <p>
              Session cookies are deleted when you close your browser.
              Persistent cookies (such as preference and analytics cookies)
              remain on your device for a set period or until you delete them
              manually. We retain persistent cookies for no longer than 12
              months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in technology, regulation, or our business practices. Any
              updates will be posted on this page with a revised &ldquo;Last
              updated&rdquo; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              Contact Us
            </h2>
            <p>
              If you have questions about our use of cookies, please contact us
              at{" "}
              <a
                href="mailto:support@planforge.dev"
                className="underline hover:text-white transition-colors"
                style={{ color: branding.primary_color }}
              >
                support@planforge.dev
              </a>
              .
            </p>
          </section>
        </div>
      </article>

      <Footer
        logoText={branding.logo_text}
        company={footer.company}
        primaryColor={branding.primary_color}
      />
    </div>
  );
}
