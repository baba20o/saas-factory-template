import { getFactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  const config = getFactoryConfig();
  const { branding, hero, footer } = config;

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Nav
        logoText={branding.logo_text}
        primaryColor={branding.primary_color}
        ctaText={hero.cta_text}
        ctaLink={hero.cta_link}
      />

      <article className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 text-center">
          Privacy Policy
        </h1>
        <p className="text-text-muted text-center mb-16 text-sm">
          Last updated: March 1, 2026
        </p>

        <div className="space-y-10 text-text-secondary text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly when you create an
              account, set up a workspace, or contact support. This includes your
              name, email address, company name, and project data you choose to
              store in PlanForge. We also collect usage data automatically,
              including browser type, device information, IP address, and
              interaction patterns within the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-text-muted">
              <li>Provide, maintain, and improve PlanForge</li>
              <li>Generate AI-powered project plans and recommendations</li>
              <li>Send transactional emails and service updates</li>
              <li>Respond to support requests and inquiries</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>
                Analyze usage trends to improve user experience and product
                features
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Data Protection
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              data, including encryption in transit (TLS 1.3) and at rest
              (AES-256). Access to personal data is restricted to authorized
              personnel on a need-to-know basis. We conduct regular security
              audits and penetration testing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">Cookies</h2>
            <p>
              PlanForge uses cookies and similar tracking technologies to
              maintain your session, remember your preferences, and understand
              how you interact with our Service. You can instruct your browser to
              refuse all cookies or to indicate when a cookie is being sent. See
              our{" "}
              <a
                href="/cookie-policy"
                className="underline hover:text-white transition-colors"
                style={{ color: branding.primary_color }}
              >
                Cookie Policy
              </a>{" "}
              for full details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Third-Party Services
            </h2>
            <p>
              We may share limited data with third-party services that help us
              operate PlanForge, including payment processors (Stripe), hosting
              providers (Vercel, Supabase), analytics tools, and email delivery
              services. These providers are contractually obligated to protect
              your data and may only use it to perform services on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Your Consent
            </h2>
            <p>
              By using PlanForge, you consent to our Privacy Policy. You may
              withdraw consent at any time by deleting your account. Upon account
              deletion, we will remove your personal data within 30 days, except
              where retention is required by law or for legitimate business
              purposes (such as fraud prevention).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of any material changes by posting the new policy on this page
              and updating the &ldquo;Last updated&rdquo; date. We encourage you
              to review this policy periodically for any changes.
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
