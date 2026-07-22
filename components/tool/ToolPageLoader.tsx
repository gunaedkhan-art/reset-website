import type { RelatedTool, ToolMetadata } from "@/types/tool";
import { getConfigBySlug } from "@/lib/tool-engine/compiler/manifest";
import { isConfigTool, loadToolComponent } from "@/lib/tools/registry";
import { ToolEngineRenderer } from "./ToolEngineRenderer";
import { ToolPageSkeleton } from "./ToolPageSkeleton";

interface ToolPageLoaderProps {
  slug: string;
  metadata: ToolMetadata;
  relatedTools: RelatedTool[];
  categoryName?: string;
}

export async function ToolPageLoader({
  slug,
  metadata,
  relatedTools,
  categoryName,
}: ToolPageLoaderProps) {
  if (isConfigTool(slug)) {
    const config = getConfigBySlug(slug);
    if (!config) {
      return <ToolPageSkeleton title={metadata.title} />;
    }

    return (
      <ToolEngineRenderer
        config={config}
        relatedTools={relatedTools}
        categoryName={categoryName}
      />
    );
  }

  const ToolComponent = await loadToolComponent(slug);

  if (!ToolComponent) {
    return <ToolPageSkeleton title={metadata.title} />;
  }

  return (
    <ToolComponent
      metadata={metadata}
      relatedTools={relatedTools}
      categoryName={categoryName}
    />
  );
}
