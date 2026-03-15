import { getFactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-text-muted text-center mb-16 text-sm">
          Last updated: March 1, 2026
        </p>

        <div className="space-y-10 text-text-secondary text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">1. Terms</h2>
            <p>
              By accessing PlanForge (&ldquo;the Service&rdquo;), you agree to be
              bound by these Terms of Service and all applicable laws and
              regulations. If you do not agree with any of these terms, you are
              prohibited from using or accessing the Service. The materials
              contained in the Service are protected by applicable copyright and
              trademark law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              2. Use License
            </h2>
            <p>
              Permission is granted to temporarily access and use PlanForge for
              personal or commercial project-planning purposes. This is the grant
              of a license, not a transfer of title, and under this license you
              may not:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-text-muted">
              <li>Modify or copy the materials except as enabled by the Service</li>
              <li>
                Use the materials for any purpose that violates applicable law
              </li>
              <li>
                Attempt to reverse-engineer any software contained in PlanForge
              </li>
              <li>
                Remove any copyright or proprietary notations from the materials
              </li>
              <li>
                Transfer the materials to another person or mirror the materials
                on any other server
              </li>
            </ul>
            <p className="mt-3">
              This license shall automatically terminate if you violate any of
              these restrictions and may be terminated by PlanForge at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              3. Disclaimer
            </h2>
            <p>
              The materials within PlanForge are provided on an &ldquo;as
              is&rdquo; basis. PlanForge makes no warranties, expressed or
              implied, and hereby disclaims and negates all other warranties
              including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              4. Limitations
            </h2>
            <p>
              In no event shall PlanForge or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data or
              profit, or due to business interruption) arising out of the use or
              inability to use PlanForge, even if PlanForge or an authorized
              representative has been notified orally or in writing of the
              possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              5. Accuracy of Materials
            </h2>
            <p>
              The materials appearing in PlanForge could include technical,
              typographical, or photographic errors. PlanForge does not warrant
              that any of the materials are accurate, complete, or current.
              PlanForge may make changes to the materials at any time without
              notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">6. Links</h2>
            <p>
              PlanForge has not reviewed all of the sites linked to its Service
              and is not responsible for the contents of any such linked site.
              The inclusion of any link does not imply endorsement by PlanForge.
              Use of any linked website is at the user&rsquo;s own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              7. Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in
              accordance with the laws of the State of Vermont, United States,
              and you irrevocably submit to the exclusive jurisdiction of the
              courts in that location.
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
