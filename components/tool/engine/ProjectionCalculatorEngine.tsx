"use client";

import { useState } from "react";
import { ToolTemplate } from "@/components/tool";
import { Callout } from "@/components/ui/Callout";
import { DataTable } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { ProjectionChart } from "@/components/ui/ProjectionChart";
import { ResultCard } from "@/components/ui/ResultCard";
import { Select } from "@/components/ui/Select";
import { trackEvent } from "@/lib/analytics/track-client";
import {
  formatCurrency,
  parseInvestmentInputs,
  runCalculatorProfile,
} from "@/lib/investment";
import type { ProjectionResult } from "@/lib/investment/types";
import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import {
  evaluateComparisonRules,
  renderTemplate,
  type TemplateContext,
} from "@/lib/tool-engine/template/render";
import { buildInvestmentInputDefaults } from "@/tools/config/investment-shared";
import type { RelatedTool } from "@/types/tool";
import { cn } from "@/lib/utils";

interface ProjectionCalculatorEngineProps {
  config: ToolConfig;
  relatedTools: RelatedTool[];
  categoryName?: string;
}

function buildTemplateContext(
  config: ToolConfig,
  projection: ProjectionResult,
  inputs: Record<string, number | string | boolean>,
): TemplateContext {
  return {
    inputs,
    scores: {},
    calcs: {},
    constants: config.flow.type === "calculator" ? (config.flow.constants ?? {}) : {},
    answers: {},
    projection,
  };
}

export function ProjectionCalculatorEngine({
  config,
  relatedTools,
  categoryName,
}: ProjectionCalculatorEngineProps) {
  const flow = config.flow;

  const [values, setValues] = useState<Record<string, string>>(() =>
    flow.type === "calculator" ? buildInvestmentInputDefaults(flow.inputs) : {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projection, setProjection] = useState<ProjectionResult | null>(null);

  if (flow.type !== "calculator" || flow.engine !== "projection" || !flow.calculatorProfile) {
    return null;
  }

  const calculatorProfile = flow.calculatorProfile;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    try {
      const fieldIds = flow.inputs.map((field) => field.id);
      const parsed = parseInvestmentInputs(values, fieldIds);
      const result = runCalculatorProfile(calculatorProfile, parsed);
      setProjection(result);
      trackEvent({
        name: "tool_calculate",
        tool_slug: config.slug,
        mode: "calculator",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid input";
      setErrors({ _form: message });
      setProjection(null);
    }
  };

  const template = projection
    ? config.results.templates.find((t) => t.id === flow.resultTemplateId)
    : null;

  const parsedInputs: Record<string, number | string | boolean> = projection
    ? (() => {
        try {
          const fieldIds = flow.inputs.map((field) => field.id);
          const parsed = parseInvestmentInputs(values, fieldIds);
          return {
            starting_balance: parsed.starting_balance,
            target_amount: parsed.target_amount ?? 0,
            annual_return_rate: parsed.annual_return_rate,
            years: parsed.years,
            contribution_amount: parsed.contribution_amount,
            contribution_frequency: parsed.contribution_frequency,
            contribution_timing: parsed.contribution_timing,
            compounding_frequency: parsed.compounding_frequency,
            withdrawal_amount: parsed.withdrawal_amount ?? 0,
          } as Record<string, number | string | boolean>;
        } catch {
          return {} as Record<string, number | string | boolean>;
        }
      })()
    : {};

  const templateContext =
    projection && template
      ? buildTemplateContext(config, projection, parsedInputs)
      : null;

  const comparisons =
    template && templateContext
      ? evaluateComparisonRules(
          template.comparisonRules ?? [],
          templateContext,
          template.fallbackComparison,
        )
      : [];

  const chartData =
    projection?.yearlyRows.map((row) => ({
      label: `Y${row.year}`,
      balance: row.balance,
      contributions: row.cumulativeContributions,
    })) ?? [];

  return (
    <ToolTemplate
      path={config.seo.canonicalPath}
      toolSlug={config.slug}
      title={config.content.h1}
      description={config.content.intro}
      category={categoryName ?? config.content.eyebrow}
      relatedTools={relatedTools}
      onSubmit={handleSubmit}
      themeColor={config.theme?.accentColor}
      legalDisclaimer={config.legalDisclaimer}
      inputArea={
        <div className="space-y-6">
          {config.guidance.map((block) => (
            <Callout key={block.title} title={block.title}>
              <p className="text-neutral-700">{block.body}</p>
              {block.list && (
                <ul className="mt-2 list-inside list-disc space-y-1.5 text-neutral-700">
                  {block.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </Callout>
          ))}

          {flow.inputs.map((field) =>
            field.type === "select" ? (
              <Select
                key={field.id}
                label={field.label}
                name={field.id}
                hint={field.hint}
                options={field.options ?? []}
                value={values[field.id] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
                error={
                  errors[field.id] ??
                  (errors._form && !projection ? errors._form : undefined)
                }
                required={field.required}
              />
            ) : (
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
                  (errors._form && !projection ? errors._form : undefined)
                }
                required={field.required}
                autoComplete="off"
              />
            ),
          )}
        </div>
      }
      calculate={{ label: "Calculate" }}
      resultsEmpty={!projection}
      resultsEmptyMessage={config.results.emptyMessage}
      resultsArea={
        projection &&
        template &&
        templateContext && (
          <div className="space-y-8">
            {template.cards && (
              <div
                className={cn(
                  "grid gap-4",
                  template.cardColumns === 4
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : template.cardColumns === 3
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
              <p key={line} className="text-sm leading-relaxed text-neutral-600">
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

            {template.showChart && chartData.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                <h3 className="mb-4 text-sm font-semibold text-neutral-900">
                  {template.tableVariant === "withdrawal"
                    ? "Balance over time"
                    : "Growth over time"}
                </h3>
                <ProjectionChart
                  data={chartData}
                  showContributions={template.tableVariant !== "withdrawal"}
                />
              </div>
            )}

            {template.showTable && projection.yearlyRows.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold text-neutral-900">
                  Year-by-year breakdown
                </h3>
                <DataTable
                  caption={
                    template.tableVariant === "withdrawal"
                      ? "Year-by-year balance, withdrawals, and growth"
                      : "Year-by-year balance, contributions, and growth"
                  }
                  columns={
                    template.tableVariant === "withdrawal"
                      ? [
                          { key: "year", header: "Year" },
                          {
                            key: "balance",
                            header: "Balance",
                            align: "right",
                            format: (value) => formatCurrency(Number(value)),
                          },
                          {
                            key: "withdrawalsThisYear",
                            header: "Withdrawals",
                            align: "right",
                            format: (value) => formatCurrency(Number(value)),
                          },
                          {
                            key: "growthThisYear",
                            header: "Growth",
                            align: "right",
                            format: (value) => formatCurrency(Number(value)),
                          },
                          {
                            key: "cumulativeWithdrawals",
                            header: "Total withdrawn",
                            align: "right",
                            format: (value) => formatCurrency(Number(value)),
                          },
                        ]
                      : [
                          { key: "year", header: "Year" },
                          {
                            key: "balance",
                            header: "Balance",
                            align: "right",
                            format: (value) => formatCurrency(Number(value)),
                          },
                          {
                            key: "contributionsThisYear",
                            header: "Contributions",
                            align: "right",
                            format: (value) => formatCurrency(Number(value)),
                          },
                          {
                            key: "growthThisYear",
                            header: "Growth",
                            align: "right",
                            format: (value) => formatCurrency(Number(value)),
                          },
                          {
                            key: "cumulativeContributions",
                            header: "Total contributed",
                            align: "right",
                            format: (value) => formatCurrency(Number(value)),
                          },
                        ]
                  }
                  rows={projection.yearlyRows.map((row) => ({ ...row }))}
                />
              </div>
            )}
          </div>
        )
      }
      appCta={config.ctas.app}
      goalsCta={config.ctas.goals}
      faq={config.faq}
      newsletterTitle={config.ctas.newsletter?.title}
      newsletterDescription={config.ctas.newsletter?.description}
    />
  );
}
