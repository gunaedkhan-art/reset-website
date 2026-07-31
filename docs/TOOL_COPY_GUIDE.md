# Tool copy guide

Use this when adding or updating tool page copy in `tools/config/*.config.ts`.

## Goals

- **SEO:** Unique, intent-matched copy on every indexable tool; authoritative outbound links with `rel="noopener noreferrer"`.
- **UX:** Short intro above the fold; longer PAS/AIDA prose **collapsed by default** so users can jump straight to the tool.
- **Consistency:** Copy lives in config — not markdown files or React components.

## Config fields

| Field | Purpose |
| --- | --- |
| `content.h1` | Page title (matches visible H1) |
| `content.intro` | 1–2 sentences above the tool — problem + promise |
| `content.icon` | Icon id from `ToolIcon` (`target`, `phone`, `path`, etc.) |
| `content.proseTitle` | Collapsible section label (default: "About this tool") |
| `content.proseCollapsedDefault` | `true` (default) = collapsed on load |
| `content.sections[]` | Rich prose blocks (see below) |
| `content.explainer` | Optional legacy paragraph (prefer `sections`) |
| `guidance[]` | How-to callouts inside the collapsible prose |
| `faq[]` | Visible FAQ; must match JSON-LD (≥3 items for indexable tools) |

## Section structure (PAS / AIDA)

Each section in `content.sections`:

```ts
{
  id: "problem",           // unique, kebab-case
  heading: "Short H2",
  framework: "pas",        // pas | aida | concept | outcome
  body: "Paragraph with [Author Name](https://official-url) links.",
  list: ["Optional bullet with [link](url)"],
}
```

Recommended order:

1. **Problem** (`pas`) — name the pain without shaming the reader.
2. **Concept or agitation** — cite the principle or research (Keller, Newport, UC Irvine, etc.).
3. **Outcome** (`aida` / `outcome`) — what the tool delivers in concrete terms.

## Links in copy

Use markdown-style links in strings; `RichText` renders them as external links:

```ts
body: "[Gary Keller](https://www.the1thing.com/) built The ONE Thing around a single question."
```

Prefer official sources. Reusable URLs live in `lib/content/authoritative-sources.ts`.

## Icons and themes

- Set `content.icon` when the cluster default is wrong.
- Visual theme comes from `taxonomy.cluster` via `lib/tools/cluster-themes.ts`.
- Cluster hub pages: `/tools/deep-work`, `/tools/procrastination`, `/tools/phone-and-focus`, `/tools/one-thing`, `/tools/money`.

## Checklist before publish

- [ ] `intro` is scannable; no wall of text above the tool
- [ ] `sections` or `guidance` populated; collapsible prose not empty
- [ ] FAQ answers match visible content; ≥3 items
- [ ] `appCta.title` / `description` are **tool-specific**
- [ ] `npm run validate:tools` passes
