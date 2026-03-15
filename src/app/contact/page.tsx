"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Get in touch
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Have a question, feature request, or just want to say hi? We&apos;d
          love to hear from you.
        </p>
      </section>

      {/* Contact form + info */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form */}
          <div className="md:col-span-3 rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-md p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">&#10003;</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Message sent!
                </h3>
                <p className="text-sm text-text-secondary">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-border text-sm text-text-primary placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-border text-sm text-text-primary placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Subject
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all">
                    <option>General inquiry</option>
                    <option>Bug report</option>
                    <option>Feature request</option>
                    <option>Enterprise sales</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800/60 border border-border text-sm text-text-primary placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:opacity-90 hover:shadow-lg bg-gradient-to-r from-primary to-primary/90 cursor-pointer"
                >
                  Send message
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-md p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Email</h3>
              <p className="text-sm text-text-secondary">support@planforge.app</p>
            </div>
            <div className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-md p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Response time
              </h3>
              <p className="text-sm text-text-secondary">
                We typically respond within 24 hours on business days.
              </p>
            </div>
            <div className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-md p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Enterprise
              </h3>
              <p className="text-sm text-text-secondary">
                Need custom integrations, SLA, or dedicated support? Select
                &ldquo;Enterprise sales&rdquo; above and we&apos;ll set up a
                call.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer
        logoText="PlanForge"
        company="GMC Corp"
        primaryColor="#6366f1"
      />
    </div>
  );
}
