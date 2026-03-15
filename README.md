# SaaS Factory Template

A config-driven SaaS template that spins up fully themed, production-ready sites from a single `factory.yaml` file. Built for AI agents to customize and deploy autonomously.

**Live demo:** [0011011011.com](https://0011011011.com)

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 + CSS variables |
| 3D | Three.js via React Three Fiber + Drei |
| Data Viz | D3.js (force graphs, sparklines, counters) |
| Auth | Supabase Auth (SSR, email + Google OAuth) |
| Payments | Stripe Checkout + Customer Portal |
| Hosting | Vercel (auto-deploy from GitHub) |
| Config | `factory.yaml` (single file drives everything) |

## Quick Start

```bash
# 1. Clone the template
git clone https://github.com/baba20o/saas-factory-template.git my-saas
cd my-saas

# 2. Install dependencies
npm install

# 3. Copy env vars
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, STRIPE_SECRET_KEY, etc.

# 4. Edit factory.yaml with your product info

# 5. Run dev server
npm run dev
```

## Configuration

Everything is driven by `factory.yaml`. Edit this file to create a completely different product.

### Product & Branding

```yaml
product:
  name: "YourProduct"
  tagline: "Your tagline here"
  domain: "yourdomain.com"

branding:
  primary_color: "#6366f1"
  accent_color: "#f59e0b"
  logo_text: "YourProduct"
```

### Theme System

The theme system controls the entire visual identity through CSS variables. All ~40 components read from theme tokens — no hardcoded colors anywhere.

```yaml
theme:
  mode: "dark"              # "dark" | "light" — auto-resolves surface/text colors
  colors:
    primary: "#6366f1"      # Buttons, links, accents
    accent: "#f59e0b"       # Secondary accent
    # Override any default if needed:
    # background: "#050510"
    # surface: "#0a0a1a"
    # text_primary: "#ffffff"
  radius: "xl"              # Border radius scale
  glassmorphism: true       # Backdrop-blur glass effects on/off
```

**How it works:**
1. `factory.yaml` → `resolveTheme()` in `src/lib/theme.ts`
2. Theme resolves null values from dark/light defaults
3. CSS variables injected on `:root` via `layout.tsx`
4. Tailwind `@theme inline` registers vars as design tokens
5. Components use semantic classes: `bg-background`, `text-primary`, `border-glass-border`, etc.

### Modular Landing Page

The landing page is composed of **sections** defined in `factory.yaml`. Add, remove, reorder, or swap variants:

```yaml
landing:
  sections:
    - type: "nav"
    - type: "hero"
      variant: "3d-orbs"       # "3d-orbs" | "gradient-mesh" | "particles" | "minimal"
    - type: "features"
      variant: "cards"
    - type: "how-it-works"
    - type: "project-graph"
    - type: "live-metrics"
    - type: "testimonials"
    - type: "pricing"
    - type: "faq"
    - type: "footer"
      variant: "full"          # "full" | "simple" | "minimal"
```

**Available hero variants:**
| Variant | Description |
|---------|-------------|
| `3d-orbs` | Three.js 3D orbs, torus, particles (default) |
| `gradient-mesh` | Animated CSS gradient blobs, no WebGL |
| `particles` | Canvas-based particle network |
| `minimal` | Pure CSS with gradient orb, lightest weight |

**Available footer variants:**
| Variant | Description |
|---------|-------------|
| `full` | Multi-column mega footer with blog posts (default) |
| `simple` | Single-row compact footer |
| `minimal` | Just logo and copyright |

### Content Configuration

```yaml
hero:
  headline: "Your Headline"
  subheadline: "Your subheadline"
  cta_text: "Get Started"
  cta_link: "/app"

features:
  - title: "Feature Name"
    description: "Short description"
    icon: "zap"                # zap | clock | download | users
    detail: "Long description for feature detail page"

pricing:
  - name: "Free"
    price: 0
    stripe_price_id: ""
    features: ["Feature 1", "Feature 2"]
  - name: "Pro"
    price: 10
    stripe_price_id: "price_xxx"
    features: ["Everything in Free", "Plus more"]
    highlighted: true

dashboard:
  nav_items:
    - label: "Dashboard"
      icon: "layout-dashboard"
      href: "/app"

footer:
  company: "Your Company"
  links:
    - label: "Privacy"
      href: "/privacy"
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (registry-driven from config)
│   ├── layout.tsx            # Root layout (injects CSS theme vars)
│   ├── globals.css           # Tailwind + @theme inline tokens
│   ├── login/                # Auth pages (use shared AuthShell)
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── app/                  # Protected dashboard
│   │   ├── page.tsx          # Main dashboard
│   │   ├── settings/         # User settings
│   │   ├── billing/          # Subscription management
│   │   ├── keys/             # API key management
│   │   └── admin/            # Admin panel (role-gated)
│   ├── features/[slug]/      # Dynamic feature detail pages
│   ├── customers/            # Social proof page
│   ├── contact/              # Contact form
│   ├── terms/                # Terms of Service
│   ├── privacy/              # Privacy Policy
│   └── not-found.tsx         # Branded 404 page
├── components/
│   ├── Nav.tsx               # Sticky glassmorphism nav
│   ├── Hero.tsx              # Default Three.js hero
│   ├── heroes/               # Hero variants (gradient-mesh, particles, minimal)
│   ├── Features.tsx          # Feature cards with 3D tilt
│   ├── Footer.tsx            # Full mega footer
│   ├── footers/              # Footer variants (simple, minimal)
│   ├── AuthShell.tsx         # Shared auth page wrapper
│   ├── toast.tsx             # Toast notification system
│   └── ...                   # Other landing/dashboard components
├── lib/
│   ├── factory.ts            # Reads factory.yaml, typed config
│   ├── theme.ts              # resolveTheme() — CSS variable pipeline
│   ├── section-registry.ts   # Dynamic section loading + variants
│   └── supabase/             # Supabase client/server/middleware
```

## Key Architecture Decisions

- **CSS Variable Pipeline** — Theme tokens flow: `factory.yaml` → `resolveTheme()` → `:root` CSS vars → Tailwind `@theme inline` → semantic classes. No hardcoded colors in components.
- **Section Registry** — Landing page sections are dynamically loaded via `src/lib/section-registry.ts`. Map `{ type, variant }` to lazy-imported components.
- **Server Components** — Landing page and layout are server components. Auth pages and interactive dashboard components are client components.
- **Auth Middleware** — Supabase middleware protects `/app/*` routes. Logged-in users are redirected from `/`, `/login`, `/signup` to `/app`.
- **Stripe Customer Portal** — Pro subscribers can manage/cancel subscriptions via Stripe's hosted portal.
- **Toast System** — React Context-based notifications with auto-dismiss, used across settings/billing/admin.

## Pages Included

| Route | Purpose |
|-------|---------|
| `/` | Config-driven landing page |
| `/login` | Email + Google OAuth login |
| `/signup` | Email + Google OAuth signup |
| `/forgot-password` | Password recovery flow |
| `/reset-password` | Set new password |
| `/app` | Protected dashboard |
| `/app/settings` | Profile settings |
| `/app/billing` | Subscription management |
| `/app/keys` | API key management |
| `/app/admin` | Admin panel (role-gated) |
| `/features/[slug]` | Feature detail pages |
| `/customers` | Social proof |
| `/contact` | Contact form |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/checkout/success` | Post-payment confirmation |
| `404` | Branded not-found page |

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Deployment

Push to GitHub → Vercel auto-deploys. Set environment variables in Vercel project settings.

For custom domains, configure DNS (A record to Vercel IP) and add the domain in Vercel project settings.

## Creating a New Site

1. Fork or clone this template
2. Edit `factory.yaml` with your product info, theme, and section layout
3. Create a new Supabase project
4. Create Stripe products/prices
5. Set env vars
6. Push to GitHub → Vercel deploys automatically
7. Update Supabase email templates via management API to match your theme
