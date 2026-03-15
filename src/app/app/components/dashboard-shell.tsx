"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DashIcon } from "./icons";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/lib/subscription";

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

interface DashboardShellProps {
  user: { email: string; id: string; isAdmin?: boolean };
  plan: Plan;
  config: {
    productName: string;
    logoText: string;
    primaryColor: string;
    navItems?: NavItem[];
  };
  children: React.ReactNode;
}

const DEFAULT_NAV: NavItem[] = [
  { label: "Dashboard", icon: "layout-dashboard", href: "/app" },
  { label: "Settings", icon: "settings", href: "/app/settings" },
  { label: "Billing", icon: "credit-card", href: "/app/billing" },
];

export function DashboardShell({ user, plan, config, children }: DashboardShellProps) {
  const pathname = usePathname();
  const baseNav = config.navItems ?? DEFAULT_NAV;
  const navItems = user.isAdmin
    ? [...baseNav, { label: "Admin", icon: "shield", href: "/app/admin" }]
    : baseNav;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-glass-border">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-glow))' }}
        >
          {config.logoText[0]}
        </div>
        {!collapsed && (
          <span className="text-text-primary font-semibold text-sm truncate">{config.logoText}</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-white/10 text-text-primary"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              }`}
              style={active ? { borderLeft: '2px solid var(--color-primary)' } : undefined}
            >
              <DashIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Plan badge + sign out */}
      <div className="px-3 pb-4 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                plan === "pro"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-white/10 text-text-secondary"
              }`}
            >
              {plan === "pro" ? "Pro" : "Free"}
            </span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200 w-full"
        >
          <DashIcon name="log-out" className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-glass-border bg-surface transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {sidebarContent}
        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex items-center justify-center h-10 border-t border-glass-border text-text-muted hover:text-white transition-colors"
        >
          <DashIcon name={collapsed ? "chevron-right" : "chevron-left"} className="w-4 h-4" />
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-surface flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <DashIcon name="x" className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-glass-border bg-surface/50 backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-text-secondary hover:text-white"
          >
            <DashIcon name="menu" className="w-5 h-5" />
          </button>

          <div className="hidden md:block" />

          <div className="flex items-center gap-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                plan === "pro"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-white/10 text-text-secondary"
              }`}
            >
              {plan === "pro" ? "Pro" : "Free plan"}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-glow))' }}
              >
                {user.email[0].toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm text-text-secondary truncate max-w-[200px]">
                {user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
