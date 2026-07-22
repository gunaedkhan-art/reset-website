# Adding a tool

Every tool lives in `tools/[slug]/` and is registered in `lib/tools/registry.ts`.

## Steps

### 1. Create the tool component

Copy `tools/_template/StarterTool.tsx` to `tools/your-slug/YourTool.tsx`:

```tsx
"use client";

import { ToolTemplate } from "@/components/tool";
import { Input } from "@/components/ui/Input";
import type { ToolPageProps } from "@/lib/tools";

export default function YourTool({
  metadata,
  relatedTools,
  categoryName,
}: ToolPageProps) {
  return (
    <ToolTemplate
      path={`/tools/${metadata.slug}`}
      title={metadata.title}
      description={metadata.description}
      category={categoryName}
      inputArea={<Input label="Example" name="example" />}
      resultsEmpty
      appCta={{
        title: "Tool-specific headline for the Reset app",
        description: "Explain how Reset helps with this specific tool's problem.",
      }}
    />
  );
}
```

### 2. Register in the catalog

Add to `toolRegistrations` in `lib/tools/registry.ts`:

```ts
{
  slug: "your-slug",
  title: "Your Tool",
  description: "What it does.",
  category: "productivity",
  keywords: ["keyword"],
  featured: true,
  load: () => import("@/tools/your-slug/YourTool"),
},
```

### 3. Done

The tool is automatically available at `/tools/your-slug`, included in the sitemap, and listed on `/tools`.

No changes needed to `app/tools/[slug]/page.tsx`.
