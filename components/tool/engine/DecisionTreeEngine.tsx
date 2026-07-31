"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ToolTemplate } from "@/components/tool";
import { Button } from "@/components/ui/Button";
import { ResultCard } from "@/components/ui/ResultCard";
import { trackEvent } from "@/lib/analytics/track-client";
import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import {
  answerQuestion,
  createDecisionTreeState,
  getCurrentQuestion,
  resolveResultTemplate,
} from "@/lib/tool-engine/modes/decision-tree";
import { getDecisionTreeProgress } from "@/lib/tool-engine/modes/decision-tree-progress";
import {
  evaluateRecommendationRules,
  renderTemplate,
} from "@/lib/tool-engine/template/render";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { RelatedTool } from "@/types/tool";
import { cn } from "@/lib/utils";

interface DecisionTreeEngineProps {
  config: ToolConfig;
  relatedTools: RelatedTool[];
  categoryName?: string;
}

export function DecisionTreeEngine({
  config,
  relatedTools,
  categoryName,
}: DecisionTreeEngineProps) {
  const flow = config.flow;

  const [state, setState] = useState(() =>
    flow.type === "decision-tree"
      ? createDecisionTreeState(flow)
      : createDecisionTreeState({
          type: "decision-tree",
          entry: "_",
          nodes: {},
        }),
  );
  const [error, setError] = useState<string | undefined>();

  const templateContext = useMemo(
    () => ({
      inputs: Object.fromEntries(
        Object.entries(state.answers).map(([k, v]) => [k, v]),
      ),
      scores: state.scores,
      calcs: state.calcs,
      constants: {},
      answers: state.answers,
    }),
    [state],
  );

  const trackedComplete = useRef(false);
  useEffect(() => {
    if (state.complete && state.resultTemplateId && !trackedComplete.current) {
      trackedComplete.current = true;
      trackEvent({
        name: "tool_complete",
        tool_slug: config.slug,
        mode: "decision-tree",
        result_id: state.resultTemplateId,
      });
    }
  }, [state.complete, state.resultTemplateId, config.slug]);

  if (flow.type !== "decision-tree") return null;

  const currentQuestion = getCurrentQuestion(flow, state);

  const progress = getDecisionTreeProgress(flow, state);

  const resultTemplate = state.resultTemplateId
    ? resolveResultTemplate(config.results.templates, state.resultTemplateId)
    : null;

  const recommendation = state.complete
    ? evaluateRecommendationRules(config.recommendations, templateContext)
    : null;

  const handleOption = (optionId: string) => {
    setError(undefined);
    try {
      setState(answerQuestion(flow, state, optionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleReset = () => {
    setState(createDecisionTreeState(flow));
    setError(undefined);
    trackedComplete.current = false;
  };

  return (
    <ToolTemplate
      path={config.seo.canonicalPath}
      toolSlug={config.slug}
      title={config.content.h1}
      description={config.content.intro}
      category={categoryName ?? config.content.eyebrow}
      relatedTools={relatedTools}
      showCalculate={false}
      config={config}
      inputArea={
        <div className="space-y-6">
          {!state.complete && currentQuestion && progress.total > 1 && (
            <ProgressBar current={progress.current} total={progress.total} />
          )}

          {!state.complete && currentQuestion && (
            <fieldset>
              <legend className="text-base font-semibold text-neutral-900">
                {currentQuestion.prompt}
              </legend>
              <div className="mt-4 space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOption(option.id)}
                    className={cn(
                      "flex w-full items-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left text-sm",
                      "transition-colors hover:border-neutral-300 hover:bg-neutral-50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </fieldset>
          )}

          {state.complete && (
            <div className="flex justify-start">
              <Button type="button" variant="secondary" onClick={handleReset}>
                Start over
              </Button>
            </div>
          )}
        </div>
      }
      resultsEmpty={!state.complete}
      resultsEmptyMessage={config.results.emptyMessage}
      resultsArea={
        state.complete &&
        resultTemplate && (
          <div className="space-y-6">
            {resultTemplate.cards?.map((card) => (
              <ResultCard
                key={card.title}
                title={card.title}
                value={renderTemplate(card.valueTemplate, templateContext)}
                description={
                  card.descriptionTemplate
                    ? renderTemplate(card.descriptionTemplate, templateContext)
                    : undefined
                }
              />
            ))}

            {resultTemplate.summaryTemplates?.map((line) => (
              <p key={line} className="text-sm text-neutral-600">
                {renderTemplate(line, templateContext)}
              </p>
            ))}

            {recommendation && recommendation.steps.length > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-sm font-semibold text-emerald-900">
                  {recommendation.title ?? "Your action plan"}
                </h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-emerald-900/90">
                  {recommendation.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )
      }
      appCta={config.ctas.app}
      faq={config.faq}
    />
  );
}
