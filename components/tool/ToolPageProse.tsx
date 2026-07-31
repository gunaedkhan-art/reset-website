import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import { Callout } from "@/components/ui/Callout";
import { RichText } from "@/lib/content/rich-text";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";

interface ToolPageProseProps {
  config: ToolConfig;
}

function hasProseContent(config: ToolConfig): boolean {
  return (
    (config.content.sections?.length ?? 0) > 0 ||
    Boolean(config.content.explainer) ||
    config.guidance.length > 0
  );
}

export function ToolPageProse({ config }: ToolPageProseProps) {
  if (!hasProseContent(config)) return null;

  const title = config.content.proseTitle ?? "About this tool";
  const collapsedByDefault = config.content.proseCollapsedDefault ?? true;

  return (
    <CollapsibleSection title={title} defaultOpen={!collapsedByDefault} className="mb-8">
      <div className="space-y-6">
        {config.content.sections?.map((section) => (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <h2
              id={`section-${section.id}`}
              className="text-base font-semibold text-neutral-900"
            >
              {section.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              <RichText text={section.body} />
            </p>
            {section.list && (
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-neutral-600">
                {section.list.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {config.content.explainer && (
          <p className="text-sm leading-relaxed text-neutral-600">
            <RichText text={config.content.explainer} />
          </p>
        )}

        {config.guidance.map((block) => (
          <Callout key={block.title} title={block.title}>
            <p className="text-neutral-700">
              <RichText text={block.body} />
            </p>
            {block.list && (
              <ul className="mt-2 list-inside list-disc space-y-1.5 text-neutral-700">
                {block.list.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            )}
          </Callout>
        ))}
      </div>
    </CollapsibleSection>
  );
}

export { hasProseContent };
