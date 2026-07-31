# Reset — Engineering Playbook

**Version:** 1.0  
**Status:** Mandatory for all engineering work  
**Audience:** Engineers, Cursor agents, contributors  

This document is the **single source of truth** for how code is written in this repository. When in doubt, follow this playbook. When the playbook conflicts with a one-off preference, **the playbook wins**.

Cursor agents: read this document at the start of every session before writing code.

---

## 1. Mission & constraints

### What we are building

An SEO-driven library of interactive productivity tools. Users arrive from search, complete a tool in under 60 seconds, receive a deterministic result, and convert to app download + email signup.

### Strategic direction

We are migrating from **bespoke tool components** → **config-driven Tool Engine**. Until the engine ships (see roadmap in Tool Engine TDD), new calculators may use the current registry pattern. **Do not add new patterns.**

### Non-negotiables

| Rule | Rationale |
|------|-----------|
| No AI in tool logic (v1) | Deterministic, fast, trustworthy |
| No Material UI / Bootstrap | Tailwind + internal design system only |
| No tool-specific layout forks | All tools use `ToolTemplate` |
| No secrets in git | `.env*` gitignored; use `.env.example` |
| No `any` in TypeScript | Strict types always |
| Build must pass before PR | `npm run build && npm run lint` |

---

## 2. Repository structure

```
reset-website/
├── app/                      # Next.js App Router — pages & routes only
│   ├── [slug]/               # (future) intent-first tool URLs
│   ├── tools/                # Tools hub + dynamic [slug]
│   ├── layout.tsx            # Root layout (Header, Footer, global SEO)
│   ├── robots.ts
│   ├── sitemap.ts
│   └── globals.css
├── components/
│   ├── layout/               # Header, Footer, Navigation
│   ├── ui/                   # Design system primitives
│   ├── tool/                 # Tool shell, CTAs, engine renderer (future)
│   └── seo/                  # JsonLd, SEO components
├── content/                  # Human-written content (blog, future tool prose)
│   └── blog/
├── docs/                     # Architecture & this playbook
├── hooks/                    # Client hooks only
├── lib/
│   ├── blog/
│   ├── seo/                  # createMetadata, JSON-LD helpers
│   ├── tools/                # Registry, catalog, calculation libs
│   ├── tool-engine/          # (future) compiler, flow runner, evaluator
│   ├── env.ts
│   ├── site.ts
│   ├── tool-theme.ts
│   └── utils.ts
├── public/                   # Static assets
├── styles/                   # CSS variables / design tokens
├── tools/                    # Tool UI implementations (interim) OR configs (future)
│   ├── _template/            # Copy-only starter — never register
│   └── [slug]/               # One folder per tool (interim pattern)
├── types/                    # Shared TypeScript types
└── .cursor/rules/            # Cursor agent rules (alwaysApply)
```

### Folder rules

- **Pages** live in `app/` only — never create routable pages elsewhere.
- **Reusable UI** lives in `components/` — never in `app/`.
- **Pure logic** (calculations, validation, config parsing) lives in `lib/` — never in components.
- **Tool-specific calculation** lives in `lib/tools/[tool-name]/` — not inline in TSX.
- **Do not create empty folders** — every folder must contain at least one file.
- **Do not add new top-level folders** without updating this playbook.

---

## 3. Naming conventions

### Files & folders

| Item | Convention | Example |
|------|------------|---------|
| React components | PascalCase.tsx | `ToolTemplate.tsx` |
| Utilities / lib | kebab-case.ts | `calculate.ts`, `json-ld.ts` |
| Tool folders | kebab-case | `instagram-time-calculator/` |
| Tool component | PascalCase + Tool suffix | `InstagramTimeCalculatorTool.tsx` |
| Types | kebab-case.ts in `types/` | `tool.ts`, `seo.ts` |
| Tests (future) | `*.test.ts` colocated or `__tests__/` | `calculate.test.ts` |
| Config (future) | kebab-case.yaml | `how-to-stop-procrastinating.yaml` |

### Code identifiers

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ToolNewsletterSignup` |
| Functions | camelCase | `calculateScreenTimeCost` |
| Constants | SCREAMING_SNAKE or camelCase object | `LIFE_EXPECTANCY_YEARS`, `toolTheme` |
| Types / interfaces | PascalCase | `ToolPageProps`, `ToolRegistration` |
| Enum values | kebab-case strings | `category: "focus"` |
| CSS variables | kebab-case | `--tool-theme` |
| Slugs | kebab-case, intent-first | `procrastination-cost-calculator` |
| Event names (future) | snake_case | `tool_calculate_click` |

### Tool slugs

- Derive from **search intent**, not internal codenames.
- Use keywords users search for: `notification-cost-calculator`, not `notif-calc-v2`.
- Max ~60 characters; no dates or versions in slugs.
- One slug = one canonical URL forever. Use redirects if renaming.

---

## 4. Tool authoring

### 4.1 Current pattern (dual mode)

Tools ship in one of two ways:

#### A. Config-driven (preferred for new tools)

1. **Config file** — `tools/config/[slug].config.ts`
2. **Registry entry** — add slug to `configSlugs` in `lib/tools/registry.ts`

No React component required. The engine renders via `ToolEngineRenderer`.

Run `npm run validate:tools` after adding configs.

#### B. Component-driven (legacy — migrate to config)

1. **Calculation lib** — `lib/tools/[name]/calculate.ts`
2. **UI component** — `tools/[slug]/[Name]Tool.tsx` (`"use client"`)
3. **Registry entry** — `componentRegistrations` in `lib/tools/registry.ts`

**Never** create `app/tools/[slug]/page.tsx` per tool — the dynamic route handles it.

#### Registry entry template

```ts
{
  slug: "your-tool-slug",
  title: "Human-Facing Tool Title",
  description: "Meta description length ~150 chars. Outcome-focused.",
  category: "focus" | "productivity" | "planning" | "calculators",
  keywords: ["primary keyword", "secondary keyword"],
  featured: true,
  load: () => import("@/tools/your-tool-slug/YourToolTool"),
},
```

#### Tool component requirements

Every tool **must** use `ToolTemplate` with:

| Prop | Required | Notes |
|------|----------|-------|
| `path` | ✅ | `` `/tools/${metadata.slug}` `` |
| `title`, `description` | ✅ | From `metadata` |
| `category` | ✅ | From `categoryName` |
| `inputArea` | ✅ | Form fields + guidance callouts |
| `onSubmit` | ✅ | Client-side validation + calculation |
| `calculate` | ✅ | `{ label: "Calculate" }` minimum |
| `resultsArea` | ✅ | Shown when `resultsEmpty={false}` |
| `appCta` | ✅ | **Tool-specific** title + description |
| `relatedTools` | ✅ | Pass through from props |
| `faq` | Recommended | 3+ items for pillar tools |

#### Global layout order (do not change)

```
Title → Description → Input → Calculate → Results
→ App download CTA (thematic #209EBB, button #023047 white caps)
→ Newsletter signup (centered)
→ Related tools
→ FAQ
```

#### Calculation lib rules

- Export a single primary function: `calculate[Thing](inputs): Result`
- Export format helpers: `formatMoney`, `formatHours`, etc.
- Document constants (e.g., `LIFE_EXPECTANCY_YEARS = 80`) at top of file
- **No React** in calculation libs — pure functions only
- **No side effects** — deterministic output for same input

#### Guidance callouts

Every tool with non-obvious inputs **must** include a `<Callout>` explaining how to estimate the input (phone settings, self-assessment method, etc.).

---

### 4.2 Config-driven tool schema

See `lib/tool-engine/schema/tool-config.ts` for the full Zod schema.

Supported modes today:
- `calculator` — numeric inputs + expressions + result templates
- `decision-tree` — branching questions + scored recommendations

### 4.3 Legacy component pattern

---

## 5. Component standards

### 5.1 Server vs client

| Use | When |
|-----|------|
| Server Component (default) | Pages, layouts, static content, metadata, data loading |
| Client Component (`"use client"`) | Forms, state, interactivity, browser APIs |

**Rules:**

- Add `"use client"` only when necessary — never on pages that only compose server children.
- Tool UI components are client components.
- `ToolTemplate` is a server component; it accepts client children via `inputArea` / `resultsArea`.
- Never import server-only modules (`fs`, undisclosed env) into client components.

### 5.2 Design system

Use components from `components/ui/` — never raw HTML buttons/inputs unless extending the system.

| Need | Component |
|------|-----------|
| Button | `Button` |
| Text input | `Input` |
| Multi-line | `Textarea` |
| Dropdown | `Select` |
| Checkbox | `Checkbox` |
| Card | `Card` |
| Page section | `Section` |
| Info block | `Callout` |
| Result display | `ResultCard` |
| Tool link card | `InfoCard` |

**Styling:**

- Tailwind only — no CSS modules, no styled-components.
- Use `cn()` from `@/lib/utils` for conditional classes.
- Colors: neutral palette for UI; `toolTheme` for tool CTAs.
- Border radius: `rounded-xl` / `rounded-2xl` for cards (match existing).
- No flashy gradients.

### 5.3 Component file structure

```tsx
// 1. Imports (external → internal → types)
// 2. Types/interfaces (if not in types/)
// 3. Component
// 4. Named export (no default except tool pages + tool tools)
```

**Rules:**

- One component per file (except tightly coupled subcomponents).
- Export types from `types/` when shared; colocate when private.
- No `displayName` unless debugging requires it (Button/Input already set).

### 5.4 Tool shell components

Only modify `components/tool/*` when changing **global tool behavior** affecting all tools. Tool-specific UI belongs in `tools/[slug]/` or config.

---

## 6. SEO requirements

Every published page **must** have:

| Requirement | Implementation |
|-------------|----------------|
| Title tag | `createMetadata()` — unique, ≤60 chars where possible |
| Meta description | Unique, 140–160 chars, outcome + time promise |
| Canonical URL | Via `createMetadata({ path })` |
| OpenGraph + Twitter | Automatic via `createMetadata` |
| `metadataBase` | From `siteConfig.url` / `getSiteUrl()` |
| JSON-LD | `WebApplication` for tools; `FAQPage` when FAQ present |
| Breadcrumbs | Visual + `breadcrumbSchema` |
| Sitemap | Auto via `app/sitemap.ts` + registry slugs |
| robots.txt | `app/robots.ts` |

### Tool SEO checklist

- [ ] `title` is human-facing, not keyword-stuffed
- [ ] `description` matches search intent
- [ ] `keywords` array includes primary + 3–5 secondary terms
- [ ] `path` matches registry slug: `/tools/[slug]` (until intent URLs migrate)
- [ ] FAQ has ≥3 items for indexable tools
- [ ] No duplicate titles across tools
- [ ] `noIndex: true` only for drafts/errors

### URL policy (target state)

Intent-first slugs at root: `/how-to-stop-procrastinating`. Until migration, use `/tools/[slug]` consistently. **Never** publish the same tool at two URLs without a 301.

### Content

- **H1** = tool title (one per page)
- Do not skip heading levels (H1 → H2 → H3)
- FAQ answers must match visible FAQ content (schema parity)

---

## 7. Accessibility requirements (WCAG 2.1 AA target)

### Mandatory on every tool

- [ ] All inputs have `<label>` or `aria-label`
- [ ] Error messages use `role="alert"` and `aria-invalid`
- [ ] Calculate button is keyboard accessible (`type="submit"` in form)
- [ ] Focus states visible (`focus-visible:ring-*` — already in design system)
- [ ] Results region has `aria-live="polite"` (via `ToolResultsSection`)
- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text
- [ ] Interactive elements ≥ 44×44px touch target where possible
- [ ] Images have `alt` text; decorative icons have `aria-hidden="true"`
- [ ] Page has logical tab order
- [ ] Mobile menu has `aria-expanded` / `aria-controls`

### Do not

- Use color alone to convey meaning
- Remove focus outlines without replacement
- Trap keyboard focus in modals without escape handling (future)

---

## 8. Performance requirements

- Prefer Server Components; minimize client JS bundle.
- No heavy libraries without approval.
- Images: `next/image` with width/height; AVIF/WebP via config.
- No blocking third-party scripts on tool pages (v1).
- Target: LCP < 2.5s on 4G (tool pages should be lightweight).
- Dynamic import tool components via registry `load()` — already enforced.

---

## 9. Testing requirements

### Current (mandatory before merge)

```bash
npm run lint    # zero errors
npm run build   # zero errors
```

### Per-tool (mandatory for new tools)

Manual test checklist:

- [ ] Empty submit shows validation errors
- [ ] Valid input produces correct output (verify 2–3 fixture values by hand)
- [ ] Results empty state shows before calculation
- [ ] Mobile layout (375px) usable
- [ ] App CTA + newsletter render
- [ ] FAQ renders; schema present in page source

### Future (when test infra lands — Phase 14)

- Unit tests for every `lib/tools/*/calculate.ts`
- Fixture tests: input → expected output JSON
- Minimum 3 fixtures per tool (low, typical, edge)
- CI blocks merge on fixture failure

#### Fixture example (future)

```ts
// lib/tools/notification-cost/__fixtures__/default.json
{ "input": { "notificationsPerDay": 65 }, "output": { "hoursLostPerYear": 1977 } }
```

---

## 10. Code quality rules

### TypeScript

- `strict: true` — never disable
- No `@ts-ignore` without comment explaining why + ticket reference
- No `eslint-disable` without comment
- Prefer `interface` for object shapes; `type` for unions/aliases
- Use `@/` import alias — no relative imports crossing top-level folders (`../../../`)

### Imports order

1. React / Next
2. External packages
3. `@/components/*`
4. `@/lib/*`
5. `@/types/*`
6. Relative (same folder only)

### Functions

- Max ~80 lines per function — extract helpers
- Calculation logic never in event handlers — call lib functions
- Early returns for validation

### Error handling

- Validate all user input client-side before calculation
- Show user-friendly error strings — never raw exceptions
- Never `console.log` in committed code (use proper logging when added)

### Git / PR

- One tool per PR preferred (easier review)
- PR title: `feat(tools): add notification cost calculator`
- PR must include: registry entry, calculation tests (when available), manual test confirmation
- Do not commit `.env.local`, `.vercel`, `node_modules`
- Do not run `git push --force` to main

---

## 11. Environment & deployment

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URLs, sitemap, OG |
| `VERCEL_URL` | Auto on Vercel | Fallback via `getSiteUrl()` |

Document new variables in `.env.example` immediately.

---

## 12. Categories & taxonomy

Use only registered categories from `lib/tools/catalog.ts`:

| Slug | Use for |
|------|---------|
| `focus` | Attention, phone, notifications, doomscrolling |
| `productivity` | Work output, procrastination cost, time management |
| `planning` | Goals, schedules, roadmaps |
| `calculators` | Pure numeric calculators without behavioral framing |

Request new categories via playbook update — do not invent inline.

---

## 13. Conversion copy rules

### App CTA (`appCta`)

- **Required** on every tool
- Title + description must reference **this tool's specific problem**
- Never use generic “Download our app” without context
- Example pattern: “[Verb] the [problem you just surfaced]”

### Newsletter

- Default copy acceptable globally
- Override `newsletterTitle` / `newsletterDescription` only when tool-specific angle is strong

### Theme

- Default accent: `toolTheme.primary` (`#209EBB`)
- Download button: `toolTheme.downloadButton` (`#023047`), white uppercase text
- Override `themeColor` on `ToolTemplate` only with design approval

---

## 14. Anti-patterns (never do this)

| ❌ Anti-pattern | ✅ Instead |
|----------------|-----------|
| New tool page in `app/tools/foo/page.tsx` | Registry + dynamic `[slug]` |
| 500-line tool TSX with inline math | Extract to `lib/tools/*/calculate.ts` |
| Duplicate `ToolTemplate` layout | Pass props to existing template |
| Hardcode site URL | Use `getSiteUrl()` / `absoluteUrl()` |
| Skip FAQ on indexable tools | Minimum 3 FAQs |
| Generic app CTA | Tool-specific `appCta` |
| `toolsRegistry.push()` at runtime | Static array in `registry.ts` |
| Material UI / Bootstrap | Tailwind + `components/ui` |
| AI/LLM calls in tool flow | Deterministic rules |
| Multiple URLs for same tool | One canonical slug |

---

## 15. Session checklist for Cursor agents

Before writing code:

1. Read this playbook
2. Identify: new tool, engine work, or infra?
3. Confirm pattern: registry (current) vs config (future)
4. Plan files to create/modify — minimal diff

After writing code:

1. `npm run lint` — fix all errors
2. `npm run build` — fix all errors
3. Verify tool layout order unchanged
4. Verify `appCta` is tool-specific (if new tool)
5. Do not commit unless user asks

---

## 17. Future: authenticated user dashboard (planned)

When user accounts ship, repeat-use tools should sync to a **user dashboard**:

| Tool | Dashboard widget |
|------|------------------|
| Savings Path Tracker | Current balance vs target path, last check-in, on-track signal |
| ONE Thing Weekly Check-In | Active week's ONE Thing, week score strip, pending today check-in |
| (future trackers) | Same pattern — summary on homepage when logged in, full detail in profile |

**Homepage (logged in):** compact cards with live data from the user's active trackers — not generic marketing copy.

**Profile / dashboard:** full charts, history, edit flows — replaces localStorage as source of truth once accounts exist.

Until then, trackers remain **local-first** (`localStorage`) with no signup required.

---

## 18. Version history

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-21 | Initial playbook — registry pattern, ToolTemplate standards |
| 1.1 | 2026-07-26 | §17 user dashboard plan for repeat-use trackers |

---

*When this playbook conflicts with a chat instruction, escalate to the user. When the Tool Engine ships, update §4 and bump version to 2.0.*
