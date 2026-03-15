import { getFactoryConfig } from "./factory";

export interface ResolvedTheme {
  mode: "dark" | "light";
  vars: Record<string, string>;
}

const DARK_DEFAULTS = {
  background: "#050510",
  surface: "#0a0a1a",
  surface_elevated: "#111128",
  border: "rgba(255,255,255,0.1)",
  text_primary: "#ffffff",
  text_secondary: "#94a3b8",
  text_muted: "#64748b",
};

const LIGHT_DEFAULTS = {
  background: "#ffffff",
  surface: "#f8fafc",
  surface_elevated: "#ffffff",
  border: "#e2e8f0",
  text_primary: "#0f172a",
  text_secondary: "#64748b",
  text_muted: "#94a3b8",
};

const RADIUS_MAP: Record<string, string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
};

/**
 * Lighten a hex color by a percentage (0-100).
 */
function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(2.55 * amount));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(2.55 * amount));
  const b = Math.min(255, (num & 0xff) + Math.round(2.55 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

let cached: ResolvedTheme | null = null;

export function resolveTheme(): ResolvedTheme {
  if (cached) return cached;

  const config = getFactoryConfig();
  const t = config.theme ?? {};
  const mode: "dark" | "light" = t.mode === "light" ? "light" : "dark";
  const colors = t.colors ?? {};
  const defaults = mode === "light" ? LIGHT_DEFAULTS : DARK_DEFAULTS;

  const primary = colors.primary ?? config.branding?.primary_color ?? "#6366f1";
  const accent = colors.accent ?? config.branding?.accent_color ?? "#f59e0b";
  const background = colors.background ?? defaults.background;
  const surface = colors.surface ?? defaults.surface;
  const surfaceElevated = colors.surface_elevated ?? defaults.surface_elevated;
  const border = colors.border ?? defaults.border;
  const textPrimary = colors.text_primary ?? defaults.text_primary;
  const textSecondary = colors.text_secondary ?? defaults.text_secondary;
  const textMuted = colors.text_muted ?? defaults.text_muted;

  const derived = t.derived ?? {};
  const glass = t.glassmorphism !== false;
  const radius = RADIUS_MAP[t.radius ?? "xl"] ?? "16px";

  const vars: Record<string, string> = {
    "--color-primary": primary,
    "--color-accent": accent,
    "--color-background": background,
    "--color-surface": surface,
    "--color-surface-elevated": surfaceElevated,
    "--color-border": border,
    "--color-text-primary": textPrimary,
    "--color-text-secondary": textSecondary,
    "--color-text-muted": textMuted,
    "--color-primary-light": derived.primary_light ?? `${primary}18`,
    "--color-primary-glow": derived.primary_glow ?? `${primary}40`,
    "--color-gradient-from": derived.gradient_from ?? primary,
    "--color-gradient-to": derived.gradient_to ?? lighten(primary, 20),
    "--radius-base": radius,
    "--glass-blur": glass ? "20px" : "0px",
    "--glass-surface": glass
      ? mode === "dark"
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.02)"
      : surfaceElevated,
    "--glass-border": glass
      ? mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.06)"
      : border,
  };

  cached = { mode, vars };
  return cached;
}
