"use client";

import { useMemo, useState } from "react";
import { ToolTemplate } from "@/components/tool";
import { Callout } from "@/components/ui/Callout";
import { Input } from "@/components/ui/Input";
import { SavingsPathChart } from "@/components/ui/SavingsPathChart";
import { Select } from "@/components/ui/Select";
import { trackEvent } from "@/lib/analytics/track-client";
import {
  buildChartModel,
  parseCheckInInput,
  parseIncomeSourceInput,
  parseSavingsPathInput,
} from "@/lib/savings-path/calculate";
import {
  formatCurrency,
  todayIsoDate,
} from "@/lib/savings-path/format";
import {
  loadSavingsPathPlan,
  saveSavingsPathPlan,
} from "@/lib/savings-path/storage";
import type { IncomeSource, SavingsPathPlan } from "@/lib/savings-path/types";
import { SUPPORTED_CURRENCIES } from "@/lib/savings-path/types";
import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import type { RelatedTool } from "@/types/tool";
import { cn } from "@/lib/utils";

interface SavingsPathEngineProps {
  config: ToolConfig;
  relatedTools: RelatedTool[];
  categoryName?: string;
}

interface IncomeFormRow {
  id: string;
  amount: string;
  date: string;
  label: string;
}

function createIncomeRow(): IncomeFormRow {
  return {
    id: crypto.randomUUID(),
    amount: "",
    date: "",
    label: "",
  };
}

function getInitialState() {
  const today = todayIsoDate();
  const saved = typeof window !== "undefined" ? loadSavingsPathPlan() : null;

  if (saved) {
    return {
      plan: saved,
      targetAmount: String(saved.goal.targetAmount),
      targetDate: saved.goal.targetDate,
      startAmount: String(saved.goal.startAmount),
      startDate: saved.goal.startDate,
      currency: saved.goal.currency,
      incomeRows: saved.incomeSources.map((source) => ({
        id: source.id,
        amount: String(source.amount),
        date: source.date,
        label: source.label,
      })),
      checkInDate: today,
    };
  }

  return {
    plan: null as SavingsPathPlan | null,
    targetAmount: "10000",
    targetDate: addMonthsIso(today, 12),
    startAmount: "1000",
    startDate: today,
    currency: "USD",
    incomeRows: [] as IncomeFormRow[],
    checkInDate: today,
  };
}

export function SavingsPathEngine({
  config,
  relatedTools,
  categoryName,
}: SavingsPathEngineProps) {
  const initial = getInitialState();
  const [plan, setPlan] = useState<SavingsPathPlan | null>(initial.plan);
  const [formError, setFormError] = useState<string | null>(null);

  const [targetAmount, setTargetAmount] = useState(initial.targetAmount);
  const [targetDate, setTargetDate] = useState(initial.targetDate);
  const [startAmount, setStartAmount] = useState(initial.startAmount);
  const [startDate, setStartDate] = useState(initial.startDate);
  const [currency, setCurrency] = useState(initial.currency);
  const [incomeRows, setIncomeRows] = useState<IncomeFormRow[]>(initial.incomeRows);

  const [checkInAmount, setCheckInAmount] = useState("");
  const [checkInDate, setCheckInDate] = useState(initial.checkInDate);
  const [checkInError, setCheckInError] = useState<string | null>(null);

  const chartModel = useMemo(
    () => (plan ? buildChartModel(plan) : null),
    [plan],
  );

  const handleBuildPath = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      const { goal } = parseSavingsPathInput({
        targetAmount,
        targetDate,
        startAmount,
        startDate,
        currency,
      });

      const incomeSources: IncomeSource[] = incomeRows
        .filter((row) => row.amount.trim() || row.date.trim())
        .map((row) =>
          parseIncomeSourceInput(row.amount, row.date, row.label || "Income"),
        );

      const nextPlan: SavingsPathPlan = {
        goal,
        incomeSources,
        checkIns: plan?.checkIns ?? [],
      };

      setPlan(nextPlan);
      saveSavingsPathPlan(nextPlan);
      trackEvent({
        name: "tool_calculate",
        tool_slug: config.slug,
        mode: "calculator",
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid input");
      setPlan(null);
    }
  };

  const handleAddCheckIn = () => {
    if (!plan) return;
    setCheckInError(null);

    try {
      const checkIn = parseCheckInInput(checkInAmount, checkInDate);
      const withoutDate = plan.checkIns.filter((item) => item.date !== checkIn.date);
      const nextPlan: SavingsPathPlan = {
        ...plan,
        checkIns: [...withoutDate, checkIn].sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      };

      setPlan(nextPlan);
      saveSavingsPathPlan(nextPlan);
      setCheckInAmount("");
      trackEvent({
        name: "savings_path_checkin",
        tool_slug: config.slug,
      });
    } catch (error) {
      setCheckInError(error instanceof Error ? error.message : "Invalid check-in");
    }
  };

  const status = chartModel?.status;

  return (
    <ToolTemplate
      path={config.seo.canonicalPath}
      toolSlug={config.slug}
      title={config.content.h1}
      description={config.content.intro}
      category={categoryName ?? config.content.eyebrow}
      relatedTools={relatedTools}
      onSubmit={handleBuildPath}
      themeColor={config.theme?.accentColor}
      inputArea={
        <div className="space-y-8">
          {config.content.explainer && (
            <p className="text-sm leading-relaxed text-neutral-600">
              {config.content.explainer}
            </p>
          )}

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

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900">Your goal</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Target amount"
                name="target_amount"
                type="number"
                min={0}
                step={1}
                inputMode="decimal"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
              <Input
                label="Target date"
                name="target_date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
              />
              <Input
                label="Starting amount today"
                name="start_amount"
                type="number"
                min={0}
                step={1}
                inputMode="decimal"
                value={startAmount}
                onChange={(e) => setStartAmount(e.target.value)}
                required
              />
              <Input
                label="Start date"
                name="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Select
                label="Currency"
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={SUPPORTED_CURRENCIES.map((code) => ({
                  value: code,
                  label: code,
                }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-neutral-900">
                Income dates{" "}
                <span className="font-normal text-neutral-500">(optional)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIncomeRows((rows) => [...rows, createIncomeRow()])}
                className="text-sm font-medium text-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                + Add income
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Mark when money typically arrives — shown as floating icons on your chart.
            </p>

            {incomeRows.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-200 px-4 py-3 text-sm text-neutral-500">
                No income dates yet. Add one if paydays help you plan check-ins.
              </p>
            ) : (
              <ul className="space-y-4">
                {incomeRows.map((row) => (
                  <li
                    key={row.id}
                    className="grid gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 sm:grid-cols-2"
                  >
                    <Input
                      label="Amount"
                      type="number"
                      min={0}
                      step={1}
                      inputMode="decimal"
                      value={row.amount}
                      onChange={(e) =>
                        setIncomeRows((rows) =>
                          rows.map((item) =>
                            item.id === row.id
                              ? { ...item, amount: e.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <Input
                      label="Date"
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        setIncomeRows((rows) =>
                          rows.map((item) =>
                            item.id === row.id
                              ? { ...item, date: e.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <Input
                      label="Label"
                      type="text"
                      placeholder="e.g. Paycheck"
                      value={row.label}
                      onChange={(e) =>
                        setIncomeRows((rows) =>
                          rows.map((item) =>
                            item.id === row.id
                              ? { ...item, label: e.target.value }
                              : item,
                          ),
                        )
                      }
                      className="sm:col-span-2"
                    />
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={() =>
                          setIncomeRows((rows) => rows.filter((item) => item.id !== row.id))
                        }
                        className="text-sm text-neutral-600 hover:text-neutral-900"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {formError && (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          )}
        </div>
      }
      calculate={{ label: "Build my path" }}
      resultsEmpty={!plan || !chartModel}
      resultsEmptyMessage={config.results.emptyMessage}
      resultsArea={
        plan &&
        chartModel && (
          <div className="space-y-6">
            {plan.checkIns.length === 0 ? (
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 sm:px-5">
                <p className="text-sm font-semibold text-sky-950">This is day 1</p>
                <p className="mt-1 text-sm text-sky-900/90">
                  You have {formatCurrency(plan.goal.startAmount, plan.goal.currency)} out of{" "}
                  {formatCurrency(plan.goal.targetAmount, plan.goal.currency)} right now. Keep
                  updating in a timely manner to track your progress.
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 sm:px-5",
                  status?.onTrack
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50",
                )}
              >
                <p
                  className={cn(
                    "text-sm font-semibold",
                    status?.onTrack ? "text-emerald-900" : "text-amber-900",
                  )}
                >
                  {status?.onTrack ? "On track" : "Below target path"}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    status?.onTrack ? "text-emerald-800/90" : "text-amber-900/90",
                  )}
                >
                  {status?.onTrack
                    ? `You are ${formatCurrency(Math.abs(status.gap), plan.goal.currency, { precise: true })} above the line as of ${formatChartLabel(status.referenceDate)}.`
                    : `You are ${formatCurrency(Math.abs(status?.gap ?? 0), plan.goal.currency, { precise: true })} below the line as of ${formatChartLabel(status?.referenceDate ?? plan.goal.startDate)}.`}
                </p>
              </div>
            )}

            <SavingsPathChart model={chartModel} goal={plan.goal} />

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900">
                Log a balance update
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Add any amount on any date — your lighter progress line updates instantly.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Current amount"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="decimal"
                  value={checkInAmount}
                  onChange={(e) => setCheckInAmount(e.target.value)}
                />
                <Input
                  label="As of date"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>
              {checkInError && (
                <p className="mt-2 text-xs text-red-600" role="alert">
                  {checkInError}
                </p>
              )}
              <button
                type="button"
                onClick={handleAddCheckIn}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                Plot update
              </button>
            </div>

            <Callout variant="info" title="Saved on this device">
              Your path is stored in this browser only. Account saving is coming later — no
              signup required to use the tool today.
            </Callout>
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

function addMonthsIso(isoDate: string, months: number): string {
  const date = new Date(isoDate + "T12:00:00");
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

function formatChartLabel(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
