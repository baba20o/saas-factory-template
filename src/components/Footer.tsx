"use client";

import { useState } from "react";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logoText: string;
  company: string;
  primaryColor: string;
  description?: string;
  links?: FooterLinkGroup[];
}

const defaultLinks: FooterLinkGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations", href: "#features" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "#", external: true },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Instant Breakdown", href: "/features/instant-breakdown" },
      { label: "Smart Timelines", href: "/features/smart-timelines" },
      { label: "Export Anywhere", href: "/features/export-anywhere" },
      { label: "Team Sharing", href: "/features/team-sharing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/docs#api" },
      { label: "Quickstart", href: "/docs#quickstart" },
      { label: "Examples", href: "/docs#examples" },
      { label: "GitHub", href: "#", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Customers", href: "/customers" },
      { label: "Guides", href: "/blog" },
      { label: "Support", href: "/contact" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Brand", href: "/about" },
      { label: "Partners", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

const blogPosts = [
  {
    title: "Introducing AI-Powered Project Breakdown",
    date: "Mar 10, 2026",
    href: "/blog",
  },
  {
    title: "How Teams Ship 2x Faster with Smart Timelines",
    date: "Feb 28, 2026",
    href: "/blog",
  },
  {
    title: "The Complete Guide to Milestone Planning",
    date: "Feb 15, 2026",
    href: "/blog",
  },
];

function SocialIcon({
  platform,
  primaryColor,
}: {
  platform: string;
  primaryColor: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  };
  return (
    <a
      href="#"
      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 transition-all duration-200 hover:text-white hover:scale-110"
      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = primaryColor;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          "rgba(255,255,255,0.06)";
      }}
    >
      {icons[platform]}
    </a>
  );
}

export default function Footer({
  logoText,
  company,
  primaryColor,
  description,
  links,
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const linkGroups = links ?? defaultLinks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Gradient top border */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor}60 20%, ${primaryColor} 50%, ${primaryColor}60 80%, transparent 100%)`,
        }}
      />

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}08 0%, transparent 40%, ${primaryColor}05 100%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main grid: Brand (col-span-2) + 6 link columns + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-10 mb-14">
          {/* Brand column — col-span-2 on large */}
          <div className="lg:col-span-2">
            <span
              className="text-xl font-bold block mb-3"
              style={{ color: primaryColor }}
            >
              {logoText}
            </span>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {description ||
                "AI-powered project planning that turns your ideas into actionable roadmaps in seconds."}
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              <SocialIcon platform="twitter" primaryColor={primaryColor} />
              <SocialIcon platform="github" primaryColor={primaryColor} />
              <SocialIcon platform="linkedin" primaryColor={primaryColor} />
              <SocialIcon platform="youtube" primaryColor={primaryColor} />
            </div>
          </div>

          {/* Link columns — 6 groups across the middle */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
              {linkGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                    {group.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          {...(link.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                        >
                          {link.label}
                          {link.external && (
                            <svg
                              className="w-3 h-3 opacity-40"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Stay updated
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Get product updates and tips delivered to your inbox. No spam,
              unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-gray-700/60 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-transparent backdrop-blur-sm"
                style={{
                  boxShadow: "none",
                }}
                onFocus={(e) => {
                  (e.target as HTMLElement).style.boxShadow = `0 0 0 2px ${primaryColor}60`;
                }}
                onBlur={(e) => {
                  (e.target as HTMLElement).style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                className="w-full px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:opacity-90 hover:shadow-lg cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                }}
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
            <p className="text-xs text-gray-600 mt-3">
              By subscribing you agree to our{" "}
              <a href="/privacy" className="underline hover:text-gray-400">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Recent blog posts section */}
        <div className="border-t border-gray-800/60 pt-8 mb-8">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-5">
            From the blog
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {blogPosts.map((post) => (
              <a
                key={post.title}
                href={post.href}
                className="group rounded-lg p-4 transition-all duration-200 hover:bg-white/[0.03] border border-transparent hover:border-gray-800"
              >
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200 mb-1.5 line-clamp-2">
                  {post.title}
                </p>
                <span className="text-xs text-gray-600">{post.date}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>
            &copy; {new Date().getFullYear()} {company}. All rights reserved.
          </span>
          <span>
            Built with{" "}
            <span className="text-red-400" aria-label="love">
              &#9829;
            </span>{" "}
            by {company}
          </span>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Back to top
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
