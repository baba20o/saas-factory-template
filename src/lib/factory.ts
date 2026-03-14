import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface FactoryConfig {
  product: {
    name: string;
    tagline: string;
    description: string;
    domain: string;
  };
  branding: {
    primary_color: string;
    accent_color: string;
    logo_text: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    cta_text: string;
    cta_link: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  pricing: Array<{
    name: string;
    price: number;
    interval: string;
    stripe_price_id: string;
    features: string[];
    cta: string;
    highlighted: boolean;
  }>;
  footer: {
    company: string;
    links: Array<{ label: string; href: string }>;
  };
}

let cached: FactoryConfig | null = null;

export function getFactoryConfig(): FactoryConfig {
  if (cached) return cached;
  const configPath = path.join(process.cwd(), "factory.yaml");
  const raw = fs.readFileSync(configPath, "utf-8");
  cached = yaml.load(raw) as FactoryConfig;
  return cached;
}
