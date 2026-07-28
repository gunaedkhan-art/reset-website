"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Callout } from "@/components/ui/Callout";
import { InfoCard } from "@/components/ui/InfoCard";
import { Input } from "@/components/ui/Input";
import { SavingsPathChart } from "@/components/ui/SavingsPathChart";
import { Section } from "@/components/ui/Section";
import { Select } from "@/components/ui/Select";
import {
  ToolAppDownload,
  ToolCalculateButton,
  ToolContainer,
  ToolFormSection,
  ToolNewsletterSignup,
  ToolRelatedSection,
} from "@/components/tool";
import { trackEvent } from "@/lib/analytics/track-client";
import { siteConfig } from "@/lib/site";
import {
  breadcrumbSchema,
  faqSchema,
  webApplicationSchema,
} from "@/lib/seo";
import {
  buildChartModel,
  parseCheckInInput,
  parseIncomeRows,
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
import type { SavingsPathPlan } from "@/lib/savings-path/types";
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

type MobileView = "chart" | "edit";

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

  return {
    plan: null as SavingsPathPlan | null,
    targetAmount: "10000",
    targetDate: addMonthsIso(today, 12),
    startAmount: "1000",
    startDate: today,
    currency: "USD",
    incomeRows: [] as IncomeFormRow[],
    checkInDate: today,
    mobileView: "edit" as MobileView,
  };
}

function getSavedState() {
  const saved = loadSavingsPathPlan();
  if (!saved) return null;

  const today = todayIsoDate();
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
    mobileView: "chart" as MobileView,
  };
}

type EngineState = ReturnType<typeof getInitialState>;

const serverSnapshot: EngineState = getInitialState();
let clientSnapshotCache: EngineState | null = null;

function getClientSnapshot(): EngineState {
  if (clientSnapshotCache === null) {
    clientSnapshotCache = getSavedState() ?? getInitialState();
  }

  return clientSnapshotCache;
}

function getServerSnapshot(): EngineState {
  return serverSnapshot;
}

export function SavingsPathEngine({
  config,
  relatedTools,
  categoryName,
}: SavingsPathEngineProps) {
  const persisted = useSyncExternalStore(
    () => () => {},
    getClientSnapshot,
    getServerSnapshot,
  );

  const [plan, setPlan] = useState<SavingsPathPlan | null>(persisted.plan);
  const [formError, setFormError] = useState<string | null>(null);
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [incomeSaved, setIncomeSaved] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>(persisted.mobileView);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const [targetAmount, setTargetAmount] = useState(persisted.targetAmount);
  const [targetDate, setTargetDate] = useState(persisted.targetDate);
  const [startAmount, setStartAmount] = useState(persisted.startAmount);
  const [startDate, setStartDate] = useState(persisted.startDate);
  const [currency, setCurrency] = useState(persisted.currency);
  const [incomeRows, setIncomeRows] = useState<IncomeFormRow[]>(persisted.incomeRows);

  const [checkInAmount, setCheckInAmount] = useState("");
  const [checkInDate, setCheckInDate] = useState(persisted.checkInDate);
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const [checkInSaved, setCheckInSaved] = useState(false);

  const toolPath = config.seo.canonicalPath;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: config.content.h1, href: toolPath },
  ];

  const chartModel = useMemo(
    () => (plan ? buildChartModel(plan) : null),
    [plan],
  );

  const status = chartModel?.status;

  const buildPlanFromForm = (existingCheckIns = plan?.checkIns ?? []) => {
    const { goal } = parseSavingsPathInput({
      targetAmount,
      targetDate,
      startAmount,
      startDate,
      currency,
    });

    const incomeSources = parseIncomeRows(incomeRows, goal);

    return {
      goal,
      incomeSources,
      checkIns: existingCheckIns,
    } satisfies SavingsPathPlan;
  };

  const handleBuildPath = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIncomeError(null);

    try {
      const nextPlan = buildPlanFromForm();
      setPlan(nextPlan);
      saveSavingsPathPlan(nextPlan);
      setIncomeSaved(true);
      setMobileView("chart");
      trackEvent({
        name: "tool_calculate",
        tool_slug: config.slug,
        mode: "calculator",
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid input");
    }
  };

  const handleSaveIncome = () => {
    if (!plan) {
      setIncomeError("Build your path first, then save income dates.");
      return;
    }

    setIncomeError(null);
    setIncomeSaved(false);

    try {
      const incomeSources = parseIncomeRows(incomeRows, plan.goal);
      const nextPlan: SavingsPathPlan = {
        ...plan,
        incomeSources,
      };

      setPlan(nextPlan);
      saveSavingsPathPlan(nextPlan);
      setIncomeSaved(true);
      setMobileView("chart");
    } catch (error) {
      setIncomeError(error instanceof Error ? error.message : "Invalid income");
    }
  };

  const handleAddCheckIn = () => {
    if (!plan) return;
    setCheckInError(null);
    setCheckInSaved(false);

    try {
      const checkIn = parseCheckInInput(checkInAmount, checkInDate, plan.goal);
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
      setCheckInSaved(true);
      setMobileView("chart");
      trackEvent({
        name: "savings_path_checkin",
        tool_slug: config.slug,
      });
    } catch (error) {
      setCheckInError(error instanceof Error ? error.message : "Invalid check-in");
    }
  };

  const handleCheckInFieldKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddCheckIn();
    }
  };

  const statusModule =
    plan && chartModel ? (
      plan.checkIns.length === 0 ? (
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
      )
    ) : (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500">
        {config.results.emptyMessage}
      </div>
    );

  const chartPanel = (
    <div className="space-y-5">
      {statusModule}
      {plan && chartModel ? (
        <SavingsPathChart model={chartModel} goal={plan.goal} />
      ) : (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/60">
          <p className="max-w-xs px-6 text-center text-sm text-neutral-500">
            Your target path chart appears here once you build your path.
          </p>
        </div>
      )}

      {plan && chartModel && (
        <>
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
                onChange={(e) => {
                  setCheckInSaved(false);
                  setCheckInAmount(e.target.value);
                }}
                onKeyDown={handleCheckInFieldKeyDown}
              />
              <Input
                label="As of date"
                type="date"
                min={plan.goal.startDate}
                max={plan.goal.targetDate}
                value={checkInDate}
                onChange={(e) => {
                  setCheckInSaved(false);
                  setCheckInDate(e.target.value);
                }}
                onKeyDown={handleCheckInFieldKeyDown}
              />
            </div>
            {checkInError && (
              <p className="mt-2 text-xs text-red-600" role="alert">
                {checkInError}
              </p>
            )}
            {checkInSaved && !checkInError && (
              <p className="mt-2 text-xs text-emerald-700">
                Balance update plotted on your chart.
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
        </>
      )}
    </div>
  );

  const editPanel = (
    <ToolFormSection className="h-full">
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900">Your goal</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
          <h3 className="text-sm font-semibold text-neutral-900">
            Income dates{" "}
            <span className="font-normal text-neutral-500">(optional)</span>
          </h3>
          <p className="text-xs text-neutral-500">
            Mark when money typically arrives — shown as floating icons on your chart.
            Save after adding or editing rows.
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
                  className="grid gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                >
                  <Input
                    label="Amount"
                    type="number"
                    min={0}
                    step={1}
                    inputMode="decimal"
                    value={row.amount}
                    onChange={(e) => {
                      setIncomeSaved(false);
                      setIncomeRows((rows) =>
                        rows.map((item) =>
                          item.id === row.id
                            ? { ...item, amount: e.target.value }
                            : item,
                        ),
                      );
                    }}
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={row.date}
                    onChange={(e) => {
                      setIncomeSaved(false);
                      setIncomeRows((rows) =>
                        rows.map((item) =>
                          item.id === row.id
                            ? { ...item, date: e.target.value }
                            : item,
                        ),
                      );
                    }}
                  />
                  <Input
                    label="Label"
                    type="text"
                    placeholder="e.g. Paycheck"
                    value={row.label}
                    onChange={(e) => {
                      setIncomeSaved(false);
                      setIncomeRows((rows) =>
                        rows.map((item) =>
                          item.id === row.id
                            ? { ...item, label: e.target.value }
                            : item,
                        ),
                      );
                    }}
                    className="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                  />
                  <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIncomeSaved(false);
                        setIncomeRows((rows) => rows.filter((item) => item.id !== row.id));
                      }}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setIncomeRows((rows) => [...rows, createIncomeRow()])}
            className="text-sm font-medium text-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            + Add income
          </button>

          {plan && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSaveIncome}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                Save income dates
              </button>
              {incomeSaved && !incomeError && (
                <p className="text-xs text-emerald-700">Income dates updated on your chart.</p>
              )}
            </div>
          )}

          {incomeError && (
            <p className="text-sm text-red-600" role="alert">
              {incomeError}
            </p>
          )}
        </div>

        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}

        <ToolCalculateButton label="Build my path" type="submit" />

        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setShowHowItWorks((open) => !open)}
            aria-expanded={showHowItWorks}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900 sm:px-5"
          >
            How it works
            <span
              aria-hidden="true"
              className={cn(
                "text-neutral-400 transition-transform duration-200",
                showHowItWorks && "rotate-180",
              )}
            >
              ▾
            </span>
          </button>

          {showHowItWorks && (
            <div className="space-y-4 border-t border-neutral-200 px-4 py-4 sm:px-5">
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
            </div>
          )}
        </div>
      </div>
    </ToolFormSection>
  );

  const schemas = [
    webApplicationSchema({
      name: config.content.h1,
      description: config.content.intro,
      path: toolPath,
    }),
    breadcrumbSchema(breadcrumbItems.slice(0, -1)),
    faqSchema(config.faq),
  ].filter((schema): schema is NonNullable<typeof schema> => schema !== null);

  return (
    <article>
      <JsonLd schema={schemas} />

      <Section spacing="md">
        <ToolContainer maxWidth="xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
              {breadcrumbItems.slice(0, -1).map((item, index) => (
                <li key={`${item.href}-${index}`} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  <Link
                    href={item.href}
                    className="rounded hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-neutral-900" aria-current="page">
                  {config.content.h1}
                </span>
              </li>
            </ol>
          </nav>

          {categoryName && (
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
              {categoryName}
            </p>
          )}

          <header className="mb-8 space-y-4 lg:mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              {config.content.h1}
            </h1>
            <p className="text-lg leading-relaxed text-neutral-600">{config.content.intro}</p>
          </header>

          <form id="savings-path-form" onSubmit={handleBuildPath} noValidate>
            <div className="hidden lg:grid lg:grid-cols-[34fr_66fr] lg:items-start lg:gap-8">
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
                {editPanel}
              </div>
              <div className="sticky top-6 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 shadow-sm sm:p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">Your chart</h2>
                {chartPanel}
              </div>
            </div>

            <div className="lg:hidden">
              <div
                className={cn(
                  mobileView === "chart" ? "block" : "hidden",
                  "pb-24",
                )}
                aria-hidden={mobileView !== "chart"}
              >
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-neutral-900">Your chart</h2>
                  {chartPanel}
                </div>
              </div>

              <div
                className={cn(
                  "fixed inset-0 z-40 bg-neutral-900/40 transition-opacity",
                  mobileView === "edit"
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0",
                )}
                onClick={() => setMobileView("chart")}
                aria-hidden="true"
              />

              <div
                className={cn(
                  "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
                  mobileView === "edit" ? "translate-x-0" : "translate-x-full",
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Edit savings path"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                  <h2 className="text-base font-semibold text-neutral-900">Edit path</h2>
                  <button
                    type="button"
                    onClick={() => setMobileView("chart")}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                  >
                    Done
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">{editPanel}</div>
              </div>

              <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 backdrop-blur">
                <div className="mx-auto grid max-w-md grid-cols-2 gap-1 p-2">
                  <button
                    type="button"
                    onClick={() => setMobileView("chart")}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      mobileView === "chart"
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100",
                    )}
                  >
                    Chart
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileView("edit")}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      mobileView === "edit"
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100",
                    )}
                  >
                    Edit path
                  </button>
                </div>
              </div>
            </div>
          </form>
        </ToolContainer>
      </Section>

      {siteConfig.features.showAppDownload && (
        <ToolAppDownload
          title={config.ctas.app.title}
          description={config.ctas.app.description}
          toolSlug={config.slug}
        />
      )}

      <ToolNewsletterSignup
        title={config.ctas.newsletter?.title}
        description={config.ctas.newsletter?.description}
        toolSlug={config.slug}
      />

      <Section spacing="sm" className="border-t border-neutral-100 bg-neutral-50/50">
        <ToolContainer maxWidth="xl">
          <ToolRelatedSection>
            {relatedTools.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {relatedTools.map((tool) => (
                  <li key={tool.slug}>
                    <InfoCard
                      title={tool.title}
                      description={tool.description}
                      href={tool.href}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">
                More tools in this category coming soon.
              </p>
            )}
          </ToolRelatedSection>
        </ToolContainer>
      </Section>

      {config.faq.length > 0 && (
        <Section spacing="sm">
          <ToolContainer maxWidth="xl">
            <h2 className="mb-6 text-xl font-semibold tracking-tight text-neutral-900">
              Frequently asked questions
            </h2>
            <dl className="space-y-4">
              {config.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
                >
                  <dt className="text-base font-semibold text-neutral-900">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </ToolContainer>
        </Section>
      )}
    </article>
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
