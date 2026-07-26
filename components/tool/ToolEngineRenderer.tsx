"use client";

import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import type { RelatedTool } from "@/types/tool";
import { CalculatorEngine } from "./engine/CalculatorEngine";
import { DecisionTreeEngine } from "./engine/DecisionTreeEngine";
import { ProjectionCalculatorEngine } from "./engine/ProjectionCalculatorEngine";

interface ToolEngineRendererProps {
  config: ToolConfig;
  relatedTools: RelatedTool[];
  categoryName?: string;
}

export function ToolEngineRenderer({
  config,
  relatedTools,
  categoryName,
}: ToolEngineRendererProps) {
  if (config.mode === "calculator" && config.flow.type === "calculator") {
    if (config.flow.engine === "projection") {
      return (
        <ProjectionCalculatorEngine
          config={config}
          relatedTools={relatedTools}
          categoryName={categoryName}
        />
      );
    }

    return (
      <CalculatorEngine
        config={config}
        relatedTools={relatedTools}
        categoryName={categoryName}
      />
    );
  }

  if (config.mode === "decision-tree" && config.flow.type === "decision-tree") {
    return (
      <DecisionTreeEngine
        config={config}
        relatedTools={relatedTools}
        categoryName={categoryName}
      />
    );
  }

  return null;
}
