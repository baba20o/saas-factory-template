import { getFactoryConfig } from "@/lib/factory";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  const config = getFactoryConfig();
  const { branding, hero, features, pricing, footer } = config;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav
        logoText={branding.logo_text}
        primaryColor={branding.primary_color}
        ctaText={hero.cta_text}
        ctaLink={hero.cta_link}
      />
      <Hero
        primaryColor={branding.primary_color}
        ctaText={hero.cta_text}
        ctaLink={hero.cta_link}
      />
      <Features
        features={features}
        primaryColor={branding.primary_color}
      />
      <HowItWorks primaryColor={branding.primary_color} />
      <Testimonials primaryColor={branding.primary_color} />
      <Pricing
        pricing={pricing}
        primaryColor={branding.primary_color}
        ctaLink={hero.cta_link}
      />
      <FAQ primaryColor={branding.primary_color} />
      <Footer
        logoText={branding.logo_text}
        company={footer.company}
        primaryColor={branding.primary_color}
      />
    </div>
  );
}
