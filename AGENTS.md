# SaaS Factory Template — Codex Agent Instructions

You are working in a **config-driven SaaS template**. Everything is customizable through `factory.yaml` and the theme system. Read these files before making any changes.

## Required Reading (in order)

1. **`CLAUDE.md`** — Hard rules, theme system, key files, commands
2. **`README.md`** — Full architecture, config reference, project structure
3. **`factory.yaml`** — The product configuration you're building

## Quick Reference

### Stack
Next.js 16 (App Router) · Tailwind CSS v4 · Supabase Auth (SSR) · Stripe · Three.js · D3.js

### Build & Verify
```bash
npm install              # Install dependencies
npm run build            # MUST pass before and after changes
npm run dev              # Dev server at localhost:3000
```

### Config-Driven Architecture

**Everything flows from `factory.yaml`:**
- Product name, tagline, domain → `product` + `branding`
- Visual identity (colors, dark/light mode, glassmorphism) → `theme`
- Landing page layout (sections, variants) → `landing.sections`
- Features, pricing tiers, dashboard nav → `features`, `pricing`, `dashboard`
- Footer content → `footer`

**Theme pipeline:** `factory.yaml` → `src/lib/theme.ts` → CSS variables on `:root` → Tailwind `@theme inline` tokens → components use semantic classes

### Do NOT

- Hardcode hex colors — use theme tokens (`bg-background`, `text-primary`, `var(--color-primary)`)
- Hardcode product names — read from `getFactoryConfig()`
- Commit `.env*` files or secrets
- Skip `npm run build` verification
- Ship default Supabase email templates — brand them to match the site theme

### Key Files

| What | Where |
|------|-------|
| Product config | `factory.yaml` |
| Config reader + types | `src/lib/factory.ts` |
| Theme resolver | `src/lib/theme.ts` |
| Section registry | `src/lib/section-registry.ts` |
| Landing page | `src/app/page.tsx` (registry-driven) |
| Root layout (CSS injection) | `src/app/layout.tsx` |
| Auth shared wrapper | `src/components/AuthShell.tsx` |
| Auth middleware | `src/lib/supabase/middleware.ts` |
| Dashboard shell | `src/app/app/components/dashboard-shell.tsx` |
| Stripe helpers | `src/lib/stripe.ts` |

### Adding a New Section Variant

1. Create component in `src/components/heroes/`, `src/components/footers/`, or new directory
2. Accept `config: FactoryConfig` prop (or legacy individual props — the bridge in `page.tsx` handles both)
3. Use theme tokens for all colors
4. Register in `src/lib/section-registry.ts`
5. Add variant to `factory.yaml` under `landing.sections`
6. Run `npm run build` to verify

### Adding a New Page

1. Create `src/app/your-page/page.tsx`
2. Use theme tokens for styling
3. Add link in Nav and/or Footer components
4. Verify no broken links (every link must have a real page)

### Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### Protected Routes

- `/app/*` — requires authentication (middleware-enforced)
- `/app/admin/*` — requires `role: 'admin'` in user metadata
- `/`, `/login`, `/signup` — redirect to `/app` if already authenticated
