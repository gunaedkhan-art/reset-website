"use client";

import { useState, useSyncExternalStore } from "react";
import { ToolTemplate } from "@/components/tool";
import { Input } from "@/components/ui/Input";
import { Callout } from "@/components/ui/Callout";
import { ResultCard } from "@/components/ui/ResultCard";
import { trackEvent } from "@/lib/analytics/track-client";
import { parsePrefillFromSearchParams } from "@/lib/one-thing-weekly/prefill";
import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import { runCalculatorFlow } from "@/lib/tool-engine/modes/calculator";
import {
  evaluateComparisonRules,
  renderTemplate,
} from "@/lib/tool-engine/template/render";
import type { RelatedTool } from "@/types/tool";
import { cn } from "@/lib/utils";

interface CalculatorEngineProps {
  config: ToolConfig;
  relatedTools: RelatedTool[];
  categoryName?: string;
}

function readFocusOneThing(slug: string): string | null {
  if (typeof window === "undefined" || slug !== "protect-your-one-thing-time-block") {
    return null;
  }

  return parsePrefillFromSearchParams(new URLSearchParams(window.location.search)).oneThing ?? null;
}

export function CalculatorEngine({
  config,
  relatedTools,
  categoryName,
}: CalculatorEngineProps) {
  const flow = config.flow;

  const [values, setValues] = useState<Record<string, string>>(() =>
    flow.type === "calculator"
      ? Object.fromEntries(flow.inputs.map((f) => [f.id, ""]))
      : {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof runCalculatorFlow> | null>(
    null,
  );

  const focusOneThing = useSyncExternalStore(
    () => () => {},
    () => readFocusOneThing(config.slug),
    () => null,
  );

  if (flow.type !== "calculator") return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    try {
      const run = runCalculatorFlow(flow, values);
      setResult(run);
      trackEvent({
        name: "tool_calculate",
        tool_slug: config.slug,
        mode: "calculator",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid input";
      setErrors({ _form: message });
      setResult(null);
    }
  };

  const template = result
    ? config.results.templates.find((t) => t.id === result.resultTemplateId)
    : null;

  const templateContext = result
    ? {
        ...result.context,
        answers: {},
      }
    : null;

  const comparisons =
    template && templateContext
      ? evaluateComparisonRules(
          template.comparisonRules ?? [],
          templateContext,
          template.fallbackComparison,
        )
      : [];

  return (
    <ToolTemplate
      path={config.seo.canonicalPath}
      toolSlug={config.slug}
      title={config.content.h1}
      description={config.content.intro}
      category={categoryName ?? config.content.eyebrow}
      relatedTools={relatedTools}
      config={config}
      onSubmit={handleSubmit}
      inputArea={
        <div className="space-y-6">
          {focusOneThing && (
            <Callout variant="info" title="Block time for this ONE Thing">
              <p className="text-sm leading-relaxed">
                You&apos;re scheduling protected time for:{" "}
                <span className="font-medium text-neutral-900">{focusOneThing}</span>
              </p>
            </Callout>
          )}
          {flow.inputs.map((field) => (
            <Input
              key={field.id}
              label={field.label}
              name={field.id}
              type={field.type === "text" ? "text" : "number"}
              inputMode={field.integer ? "numeric" : "decimal"}
              min={field.min}
              max={field.max}
              step={field.step ?? (field.integer ? 1 : 0.25)}
              placeholder={field.placeholder}
              hint={field.hint}
              value={values[field.id] ?? ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
              }
              error={
                errors[field.id] ??
                (errors._form && !result ? errors._form : undefined)
              }
              required={field.required}
              autoComplete="off"
            />
          ))}
        </div>
      }
      calculate={{ label: "Calculate" }}
      resultsEmpty={!result}
      resultsEmptyMessage={config.results.emptyMessage}
      resultsArea={
        result &&
        template &&
        templateContext && (
          <div className="space-y-6">
            {template.cards && (
              <div
                className={cn(
                  "grid gap-4",
                  template.cardColumns === 3
                    ? "sm:grid-cols-3"
                    : template.cards.length > 1
                      ? "sm:grid-cols-2"
                      : "",
                )}
              >
                {template.cards.map((card) => (
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
              </div>
            )}

            {template.summaryTemplates?.map((line) => (
              <p key={line} className="text-sm text-neutral-600">
                {renderTemplate(line, templateContext)}
              </p>
            ))}

            {comparisons.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-sm font-semibold text-amber-900">
                  {template.comparisonTitle ?? "What this means"}
                </h3>
                <ul className="mt-3 space-y-2">
                  {comparisons.map((comparison) => (
                    <li
                      key={comparison}
                      className="flex gap-2 text-sm leading-relaxed text-amber-900/90"
                    >
                      <span aria-hidden="true" className="mt-0.5 shrink-0">
                        •
                      </span>
                      <span>{comparison}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      }
      appCta={config.ctas.app}
      faq={config.faq}
      newsletterTitle={config.ctas.newsletter?.title}
      newsletterDescription={config.ctas.newsletter?.description}
    />
  );
}
