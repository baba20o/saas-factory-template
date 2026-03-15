# SaaS Factory Template — Agent Instructions

## First Steps

1. Read `README.md` for full architecture, config reference, and project structure
2. Read `factory.yaml` to understand what product you're building
3. Run `npm run build` before and after changes to verify nothing breaks

## Stack

- **Next.js 16** (App Router) + **Tailwind CSS v4** + **Supabase Auth** + **Stripe**
- **Three.js** (React Three Fiber) for 3D hero scenes
- **D3.js** for data visualizations
- Config-driven via `factory.yaml`

## Hard Rules

- **Never commit secrets** (`.env*`, API keys, Supabase service role keys, Stripe secret keys)
- **Never hardcode colors** — use theme tokens (`bg-background`, `text-primary`, `border-glass-border`, etc.). The theme system resolves colors from `factory.yaml` → CSS variables → Tailwind tokens.
- **Never break the build** — run `npm run build` after changes
- **Template consistency** — every user-facing surface (auth pages, dashboard, emails, error pages) must use theme tokens to match the site's visual identity
- **Config-first** — if something can be driven by `factory.yaml`, it should be. Don't hardcode product names, colors, or content.

## Theme System

All colors flow through CSS variables. Never use raw hex colors in components.

```
factory.yaml → resolveTheme() (src/lib/theme.ts) → CSS vars on :root → Tailwind @theme inline → components
```

**Use these classes**, not hex values:
- Backgrounds: `bg-background`, `bg-surface`, `bg-surface-elevated`, `bg-glass-surface`
- Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`
- Borders: `border-border`, `border-glass-border`
- Accent: `text-primary`, `bg-primary`, `from-primary`
- For inline styles: `var(--color-primary)`, `var(--color-gradient-to)`, etc.

## Section Registry

The landing page (`src/app/page.tsx`) is composed from sections defined in `factory.yaml`. To add a new section variant:

1. Create component in `src/components/heroes/`, `src/components/footers/`, or similar
2. Register it in `src/lib/section-registry.ts`
3. Add the variant option to `factory.yaml`

## Key Files

| File | Purpose |
|------|---------|
| `factory.yaml` | All product config (branding, theme, sections, pricing, etc.) |
| `src/lib/factory.ts` | Reads and types the config |
| `src/lib/theme.ts` | Resolves theme → CSS variables |
| `src/lib/section-registry.ts` | Maps section type+variant → component |
| `src/app/layout.tsx` | Root layout, injects CSS vars |
| `src/app/page.tsx` | Landing page (registry-driven) |
| `src/components/AuthShell.tsx` | Shared auth page wrapper |
| `src/lib/supabase/middleware.ts` | Auth middleware + redirects |
| `src/lib/stripe.ts` | Stripe helpers |

## Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build — run this to verify
npm run lint         # ESLint
```

## Auth Flow

- `/login`, `/signup` — email + Google OAuth via Supabase
- `/forgot-password` → recovery email → `/reset-password`
- `/app/*` — protected by middleware, redirects to `/login` if unauthenticated
- `/`, `/login`, `/signup` — redirect to `/app` if already authenticated

## Supabase Email Templates

When building or updating a site, update all Supabase email templates via management API to match the site's theme. Never ship default Supabase emails.

## Evidence Gate

Every "done" or "complete" claim must include proof:
- Build output, test result, screenshot, or file path confirming the change works
- If no proof exists, say "implemented but unverified"
