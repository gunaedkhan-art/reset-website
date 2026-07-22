import { Section } from "@/components/ui/Section";
import { ToolContainer } from "./ToolContainer";

interface ToolPageSkeletonProps {
  title?: string;
}

export function ToolPageSkeleton({ title = "Loading tool" }: ToolPageSkeletonProps) {
  return (
    <Section spacing="md" aria-busy="true" aria-label={`Loading ${title}`}>
      <ToolContainer maxWidth="md">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-24 rounded bg-neutral-200" />
          <div className="h-10 w-3/4 rounded bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-5/6 rounded bg-neutral-200" />
          </div>
          <div className="h-48 rounded-2xl bg-neutral-200" />
          <div className="h-12 w-40 rounded-xl bg-neutral-200" />
          <div className="h-32 rounded-2xl bg-neutral-200" />
        </div>
      </ToolContainer>
    </Section>
  );
}
