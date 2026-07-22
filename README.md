# Reset — SEO Tools Platform

Production-ready foundation for a scalable, SEO-focused tools website built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, and the **App Router**.

Designed to scale from a handful of tools to **1000+** utilities without architectural rewrites.

---

## Tech stack

- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS 4
- ESLint
- Server Components by default

---

## Project structure

```
app/                    # App Router pages & layouts
  layout.tsx            # Root layout (Header, Footer, global SEO)
  page.tsx              # Home
  tools/                # Tools index
  blog/                 # Blog index + [slug] dynamic route
  about/ contact/ privacy/ terms/ app/
  not-found.tsx         # 404 page
  robots.ts             # robots.txt
  sitemap.ts            # sitemap.xml
  globals.css           # Global styles

components/
  layout/               # Header, Navigation, Footer
  ui/                   # Design system (Button, Card, Input, …)
  tool/                 # ToolContainer, ToolTemplate
  seo/                  # JsonLd component

lib/
  site.ts               # Site config & navigation
  utils.ts              # cn(), absoluteUrl(), slugify()
  seo/                  # Metadata + JSON-LD helpers
  blog/                 # Blog registry & markdown utilities
  tools/                # Tool registry (central catalog)

types/                  # Shared TypeScript types
hooks/                  # Client hooks (useMediaQuery)
styles/                 # CSS variables & design tokens
content/blog/           # Future markdown articles
public/                 # Static assets
```

---

## Getting started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd reset-website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

Edit `.env.local` and set your production URL:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Commands

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Lint

```bash
npm run lint
```

### Production build

```bash
npm run build
```

### Start production server

```bash
npm run start
```

---

## Deploy to Vercel

### Option A — Git integration (recommended)

1. Push this repo to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Set environment variable: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
5. Deploy.

Vercel auto-detects Next.js — no extra config required.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow prompts. For production:

```bash
vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` in the Vercel project dashboard under **Settings → Environment Variables**.

---

## Adding a new tool

See `tools/README.md` for full instructions. Summary:

1. **Create component** at `tools/your-slug/YourTool.tsx` (copy from `tools/_template/`)

2. **Register** in `lib/tools/registry.ts`:

```ts
{
  slug: "pomodoro-timer",
  title: "Pomodoro Timer",
  description: "Focus in 25-minute intervals.",
  category: "focus",
  keywords: ["pomodoro", "timer", "focus"],
  featured: true,
  load: () => import("@/tools/pomodoro-timer/PomodoroTool"),
},
```

3. **Done** — available at `/tools/pomodoro-timer`, listed on `/tools`, included in sitemap. No route file changes needed.

```tsx
"use client";

import { ToolTemplate } from "@/components/tool";
import type { ToolPageProps } from "@/types/tool";

export default function PomodoroTool({ metadata, relatedTools, categoryName }: ToolPageProps) {
  return (
    <ToolTemplate
      path={`/tools/${metadata.slug}`}
      title={metadata.title}
      description={metadata.description}
      category={categoryName}
      relatedTools={relatedTools}
      inputArea={/* your inputs */}
      resultsEmpty
    />
  );
}
```

---

## SEO utilities

| Utility | Location | Purpose |
|---------|----------|---------|
| `createMetadata()` | `lib/seo/metadata.ts` | Page metadata, OG, Twitter, canonical |
| `organizationSchema()` | `lib/seo/json-ld.ts` | Organization JSON-LD |
| `faqSchema()` | `lib/seo/json-ld.ts` | FAQPage schema |
| `breadcrumbSchema()` | `lib/seo/json-ld.ts` | BreadcrumbList schema |
| `webApplicationSchema()` | `lib/seo/json-ld.ts` | Tool pages |
| `JsonLd` | `components/seo/JsonLd.tsx` | Renders JSON-LD scripts |
| `robots.ts` | `app/robots.ts` | robots.txt |
| `sitemap.ts` | `app/sitemap.ts` | Dynamic sitemap |

---

## Blog (future markdown)

- Registry: `lib/blog/posts.ts`
- Markdown helpers: `lib/blog/markdown.ts`
- Content directory: `content/blog/`
- Dynamic route: `app/blog/[slug]/page.tsx`

Install `gray-matter` when ready and wire the markdown loader in `lib/blog/markdown.ts`.

---

## Design system

Reusable UI components in `components/ui/`:

- `Button`, `Card`, `Input`, `Textarea`, `Select`, `Checkbox`
- `Section`, `PageHeading`, `Callout`
- `ResultCard`, `InfoCard`, `CTACard`

Use `cn()` from `lib/utils.ts` for conditional Tailwind classes.

---

## Performance notes

- Server Components used for pages and layout
- Client components only where needed (Header mobile menu, hooks)
- `next/image` for optimized images
- `optimizePackageImports` for UI barrel imports
- Minimal JavaScript on content pages

---

## License

Private — update as needed for your project.
