"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Callout } from "@/components/ui/Callout";
import { InfoCard } from "@/components/ui/InfoCard";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { WeekCheckInStrip } from "@/components/ui/WeekCheckInStrip";
import {
  ToolAppDownload,
  ToolCalculateButton,
  ToolClusterHero,
  ToolContainer,
  ToolFormSection,
  ToolNewsletterSignup,
  ToolPageProse,
  ToolRelatedSection,
} from "@/components/tool";
import { getToolIconName } from "@/components/tool/ToolIcon";
import { trackEvent } from "@/lib/analytics/track-client";
import { RichText } from "@/lib/content/rich-text";
import {
  archiveAndStartWeek,
  buildWeekSummary,
  buildWeekVisual,
  consumeOneThingPrefill,
  createWeeklyPlan,
  formatDayMonth,
  formatWeekdayShort,
  getMondayOfWeek,
  getWeekEndDate,
  hasPendingTodayCheckIn,
  isCheckInDayActive,
  isDayCheckInEnabled,
  loadOneThingWeeklyStore,
  needsWeekReview,
  parsePrefillFromSearchParams,
  saveOneThingWeeklyStore,
  sortCheckInsTodayFirst,
  submitWeekReview,
  todayIsoDate,
  updateCheckIn,
} from "@/lib/one-thing-weekly";
import type {
  BlockerTag,
  CheckInStatus,
  OneThingWeeklyStore,
  WeekOutcome,
  WeeklyPlan,
} from "@/lib/one-thing-weekly";
import { BLOCKER_OPTIONS } from "@/lib/one-thing-weekly";
import { siteConfig } from "@/lib/site";
import {
  breadcrumbSchema,
  faqSchema,
  webApplicationSchema,
} from "@/lib/seo";
import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import { resolveToolTheme } from "@/lib/tools/resolve-tool-theme";
import type { RelatedTool } from "@/types/tool";
import { cn } from "@/lib/utils";

interface OneThingWeeklyEngineProps {
  config: ToolConfig;
  relatedTools: RelatedTool[];
  categoryName?: string;
}

interface EngineState {
  store: OneThingWeeklyStore;
  oneThingDraft: string;
  leadDominoDraft: string;
  weekStartDraft: string;
  excludeWeekendsDraft: boolean;
}

function getInitialState(): EngineState {
  const today = todayIsoDate();
  return {
    store: { activePlan: null, archivedWeeks: [] },
    oneThingDraft: "",
    leadDominoDraft: "",
    weekStartDraft: getMondayOfWeek(today),
    excludeWeekendsDraft: false,
  };
}

function getSavedState(): EngineState | null {
  const saved = loadOneThingWeeklyStore();
  if (!saved.activePlan && saved.archivedWeeks.length === 0) return null;

  const today = todayIsoDate();
  const plan = saved.activePlan;
  return {
    store: saved,
    oneThingDraft: plan?.oneThing ?? "",
    leadDominoDraft: plan?.leadDomino ?? "",
    weekStartDraft: plan?.weekStart ?? getMondayOfWeek(today),
    excludeWeekendsDraft: plan?.excludeWeekends ?? false,
  };
}

const serverSnapshot = getInitialState();
let clientSnapshotCache: EngineState | null = null;

function readPrefillDrafts(): Pick<EngineState, "oneThingDraft" | "leadDominoDraft"> {
  if (typeof window === "undefined") {
    return { oneThingDraft: "", leadDominoDraft: "" };
  }

  const fromUrl = parsePrefillFromSearchParams(new URLSearchParams(window.location.search));
  const fromStore = consumeOneThingPrefill();

  return {
    oneThingDraft: fromUrl.oneThing ?? fromStore?.oneThing ?? "",
    leadDominoDraft: fromUrl.leadDomino ?? fromStore?.leadDomino ?? "",
  };
}

function getClientSnapshot(): EngineState {
  if (clientSnapshotCache === null) {
    const saved = getSavedState() ?? getInitialState();
    if (saved.store.activePlan) {
      clientSnapshotCache = saved;
    } else {
      const prefill = readPrefillDrafts();
      clientSnapshotCache = {
        ...saved,
        oneThingDraft: prefill.oneThingDraft || saved.oneThingDraft,
        leadDominoDraft: prefill.leadDominoDraft || saved.leadDominoDraft,
      };
    }
  }
  return clientSnapshotCache;
}

function getServerSnapshot(): EngineState {
  return serverSnapshot;
}

const STATUS_OPTIONS: {
  value: Exclude<CheckInStatus, "pending">;
  label: string;
}[] = [
  { value: "yes", label: "Yes" },
  { value: "partial", label: "Partial" },
  { value: "skipped", label: "No" },
];

const REVIEW_OUTCOMES: { value: WeekOutcome; label: string }[] = [
  { value: "yes", label: "Yes — finished or on track" },
  { value: "partial", label: "Partial — meaningful progress" },
  { value: "no", label: "No — didn't move the needle" },
];

function statusButtonClass(
  status: Exclude<CheckInStatus, "pending">,
  active: boolean,
): string {
  if (!active) {
    return "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50";
  }
  if (status === "yes") return "border-emerald-600 bg-emerald-600 text-white";
  if (status === "partial") return "border-amber-500 bg-amber-500 text-white";
  return "border-neutral-500 bg-neutral-500 text-white";
}

function nextMondayAfter(isoDate: string): string {
  const date = new Date(isoDate + "T12:00:00");
  date.setDate(date.getDate() + 1);
  return getMondayOfWeek(date.toISOString().slice(0, 10));
}

export function OneThingWeeklyEngine({
  config,
  relatedTools,
  categoryName,
}: OneThingWeeklyEngineProps) {
  const persisted = useSyncExternalStore(
    () => () => {},
    getClientSnapshot,
    getServerSnapshot,
  );

  const [store, setStore] = useState<OneThingWeeklyStore>(persisted.store);
  const [oneThingDraft, setOneThingDraft] = useState(persisted.oneThingDraft);
  const [leadDominoDraft, setLeadDominoDraft] = useState(persisted.leadDominoDraft);
  const [weekStartDraft, setWeekStartDraft] = useState(persisted.weekStartDraft);
  const [excludeWeekendsDraft, setExcludeWeekendsDraft] = useState(
    persisted.excludeWeekendsDraft,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [blockerPromptDate, setBlockerPromptDate] = useState<string | null>(null);
  const [reviewOutcome, setReviewOutcome] = useState<WeekOutcome>("partial");
  const [reviewReflection, setReviewReflection] = useState("");

  const theme = resolveToolTheme(config);
  const iconName = getToolIconName(config);
  const today = todayIsoDate();
  const activePlan = store.activePlan;

  const summary = useMemo(
    () => (activePlan ? buildWeekSummary(activePlan, today) : null),
    [activePlan, today],
  );

  const weekVisual = useMemo(
    () => (activePlan ? buildWeekVisual(activePlan, today) : []),
    [activePlan, today],
  );

  const sortedCheckIns = useMemo(
    () =>
      activePlan
        ? sortCheckInsTodayFirst(activePlan.checkIns, today)
        : [],
    [activePlan, today],
  );

  const toolPath = config.seo.canonicalPath;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: config.content.h1, href: toolPath },
  ];

  const persistStore = (nextStore: OneThingWeeklyStore) => {
    setStore(nextStore);
    saveOneThingWeeklyStore(nextStore);
  };

  const buildPlanInput = () => ({
    oneThing: oneThingDraft,
    leadDomino: leadDominoDraft,
    weekStart: weekStartDraft,
    excludeWeekends: excludeWeekendsDraft,
  });

  const handleStartWeek = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      const input = buildPlanInput();
      const sameWeek =
        activePlan?.weekStart === input.weekStart &&
        activePlan.oneThing.trim() === input.oneThing.trim() &&
        (activePlan.leadDomino ?? "") === (input.leadDomino ?? "") &&
        activePlan.excludeWeekends === input.excludeWeekends;

      let nextStore: OneThingWeeklyStore;
      if (activePlan && !sameWeek) {
        nextStore = archiveAndStartWeek(store, input);
      } else if (activePlan && sameWeek) {
        nextStore = {
          ...store,
          activePlan: {
            ...activePlan,
            oneThing: input.oneThing.trim(),
            leadDomino: input.leadDomino?.trim() || undefined,
            excludeWeekends: input.excludeWeekends ?? false,
          },
        };
      } else {
        nextStore = {
          ...store,
          activePlan: createWeeklyPlan(input),
        };
      }

      persistStore(nextStore);
      trackEvent({
        name: "tool_calculate",
        tool_slug: config.slug,
        mode: "calculator",
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid input");
    }
  };

  const handleCheckIn = (
    date: string,
    status: Exclude<CheckInStatus, "pending">,
    blocker?: BlockerTag,
  ) => {
    if (!activePlan) return;

    try {
      const nextPlan = updateCheckIn(activePlan, date, status, blocker);
      persistStore({ ...store, activePlan: nextPlan });
      if (status === "partial" || status === "skipped") {
        setBlockerPromptDate(blocker ? null : date);
      } else {
        setBlockerPromptDate(null);
      }
      trackEvent({
        name: "one_thing_weekly_checkin",
        tool_slug: config.slug,
        status,
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid check-in");
    }
  };

  const handleSubmitReview = () => {
    if (!activePlan) return;
    const nextPlan = submitWeekReview(activePlan, reviewOutcome, reviewReflection);
    persistStore({ ...store, activePlan: nextPlan });
  };

  const handleStartNextWeek = () => {
    if (!activePlan) return;
    const nextStart = nextMondayAfter(getWeekEndDate(activePlan.weekStart));
    const keepOneThing =
      activePlan.review?.finishedOneThing !== "no" ? activePlan.oneThing : "";

    const nextStore = archiveAndStartWeek(store, {
      oneThing: keepOneThing || oneThingDraft,
      leadDomino: activePlan.leadDomino,
      weekStart: nextStart,
      excludeWeekends: activePlan.excludeWeekends,
    });

    persistStore(nextStore);
    setOneThingDraft(nextStore.activePlan?.oneThing ?? "");
    setLeadDominoDraft(nextStore.activePlan?.leadDomino ?? "");
    setWeekStartDraft(nextStore.activePlan?.weekStart ?? nextStart);
    setExcludeWeekendsDraft(nextStore.activePlan?.excludeWeekends ?? false);
    setReviewReflection("");
    setReviewOutcome("partial");
    setBlockerPromptDate(null);
  };

  const handleResetWeek = () => {
    persistStore({ activePlan: null, archivedWeeks: store.archivedWeeks });
    setOneThingDraft("");
    setLeadDominoDraft("");
    setWeekStartDraft(getMondayOfWeek(today));
    setExcludeWeekendsDraft(false);
    setFormError(null);
    setBlockerPromptDate(null);
  };

  const showTodayPrompt = activePlan && hasPendingTodayCheckIn(activePlan, today);

  const schemas = [
    webApplicationSchema({
      name: config.content.h1,
      description: config.content.intro,
      path: toolPath,
    }),
    breadcrumbSchema(breadcrumbItems.slice(0, -1)),
    faqSchema(config.faq),
  ].filter((schema): schema is NonNullable<typeof schema> => schema !== null);

  const resultsPanel = activePlan && summary ? (
    <div className="space-y-4">
      <WeekCheckInStrip days={weekVisual} />

      {showTodayPrompt && (
        <Callout variant="warning" title="Today&apos;s check-in">
          You haven&apos;t logged today yet — mark whether you protected time for your ONE Thing.
        </Callout>
      )}

      <div
        className={cn(
          "rounded-xl border px-4 py-4 sm:px-5",
          summary.scorePercent !== null && summary.scorePercent >= 80
            ? "border-emerald-200 bg-emerald-50"
            : summary.scorePercent !== null && summary.scorePercent >= 50
              ? "border-amber-200 bg-amber-50"
              : "border-sky-200 bg-sky-50",
        )}
      >
        <p className="text-sm font-semibold text-neutral-900">{summary.weekLabel}</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{summary.message}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-neutral-500">Protected</dt>
            <dd className="font-semibold text-emerald-700">{summary.yesCount}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Partial</dt>
            <dd className="font-semibold text-amber-700">{summary.partialCount}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Missed</dt>
            <dd className="font-semibold text-neutral-700">{summary.skippedCount}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Streak</dt>
            <dd className="font-semibold text-neutral-900">{summary.streakDays} days</dd>
          </div>
        </dl>
        {summary.scorePercent !== null && (
          <p className="mt-3 text-xs text-neutral-600">
            Week score: {summary.scorePercent}% across {summary.eligibleDays} active day
            {summary.eligibleDays === 1 ? "" : "s"} so far.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-neutral-900">This week&apos;s ONE Thing</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{activePlan.oneThing}</p>
        {activePlan.leadDomino && (
          <p className="mt-2 text-sm text-neutral-600">
            <span className="font-medium text-neutral-800">Lead domino:</span>{" "}
            {activePlan.leadDomino}
          </p>
        )}
      </div>

      {needsWeekReview(activePlan, today) && (
        <ToolFormSection>
          <h3 className="text-base font-semibold text-neutral-900">End-of-week review</h3>
          <p className="mt-1 mb-4 text-sm text-neutral-600">
            Close the loop before planning next week — what happened with your ONE Thing?
          </p>
          <div className="space-y-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-neutral-900">
                Did you finish your ONE Thing this week?
              </legend>
              <div className="space-y-2">
                {REVIEW_OUTCOMES.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700"
                  >
                    <input
                      type="radio"
                      name="review-outcome"
                      value={option.value}
                      checked={reviewOutcome === option.value}
                      onChange={() => setReviewOutcome(option.value)}
                      className="h-4 w-4"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="review-reflection" className="mb-1 block text-sm font-medium text-neutral-900">
                What blocked you or worked well? (optional)
              </label>
              <textarea
                id="review-reflection"
                rows={3}
                value={reviewReflection}
                onChange={(event) => setReviewReflection(event.target.value)}
                placeholder="Meetings on Tue/Thu, phone after lunch…"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              />
            </div>
            <ToolCalculateButton
              label="Save week review"
              type="button"
              onClick={handleSubmitReview}
            />
          </div>
        </ToolFormSection>
      )}

      {activePlan.review && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
          <h3 className="text-sm font-semibold text-emerald-950">Week reviewed</h3>
          {activePlan.review.reflection && (
            <p className="mt-2 text-sm text-emerald-900/90">{activePlan.review.reflection}</p>
          )}
          <button
            type="button"
            onClick={handleStartNextWeek}
            className="mt-4 inline-flex rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Start next week
          </button>
        </div>
      )}

      {store.archivedWeeks.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5">
          <h3 className="text-sm font-semibold text-neutral-900">Recent weeks</h3>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            {store.archivedWeeks.slice(0, 4).map((week: WeeklyPlan) => {
              const weekSummary = buildWeekSummary(week, getWeekEndDate(week.weekStart));
              return (
                <li key={week.id} className="flex items-start justify-between gap-3">
                  <span className="line-clamp-2">{week.oneThing}</span>
                  <span className="shrink-0 text-neutral-500">
                    {weekSummary.yesCount}/{weekSummary.eligibleDays} yes
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/80 p-6 text-sm text-neutral-600">
      {config.results.emptyMessage}
    </div>
  );

  const checkInPanel = activePlan ? (
    <ToolFormSection>
      <h3 className="text-base font-semibold text-neutral-900">Daily check-ins</h3>
      <p className="mt-1 mb-4 text-sm text-neutral-600">
        Today is listed first. Mark each active day you protected time for your ONE Thing.
      </p>
      <ul className="space-y-3">
        {sortedCheckIns.map((checkIn) => {
          const enabled =
            isDayCheckInEnabled(checkIn.date, today) &&
            isCheckInDayActive(activePlan, checkIn.date);
          const isToday = checkIn.date === today;
          const isOff = !isCheckInDayActive(activePlan, checkIn.date);

          if (isOff) {
            return (
              <li
                key={checkIn.date}
                className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 p-4 text-sm text-neutral-500"
              >
                {formatWeekdayShort(checkIn.date)} · Weekend off
              </li>
            );
          }

          return (
            <li
              key={checkIn.date}
              className={cn(
                "rounded-xl border p-4",
                isToday ? "border-neutral-900/20 bg-neutral-50" : "border-neutral-200 bg-white",
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatWeekdayShort(checkIn.date)}
                    {isToday ? " · Today" : ""}
                  </p>
                  <p className="text-xs text-neutral-500">{formatDayMonth(checkIn.date)}</p>
                </div>
                {checkIn.status !== "pending" && (
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Logged
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={!enabled}
                    onClick={() => handleCheckIn(checkIn.date, option.value, checkIn.blocker)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      statusButtonClass(option.value, checkIn.status === option.value),
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {(blockerPromptDate === checkIn.date ||
                ((checkIn.status === "partial" || checkIn.status === "skipped") &&
                  !checkIn.blocker)) && (
                <div className="mt-3">
                  <p className="mb-2 text-xs font-medium text-neutral-600">What got in the way?</p>
                  <div className="flex flex-wrap gap-2">
                    {BLOCKER_OPTIONS.map((blocker) => (
                      <button
                        key={blocker.value}
                        type="button"
                        onClick={() =>
                          handleCheckIn(checkIn.date, checkIn.status as "partial" | "skipped", blocker.value)
                        }
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                          checkIn.blocker === blocker.value
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
                        )}
                      >
                        {blocker.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </ToolFormSection>
  ) : null;

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
            <p
              className="mb-3 text-sm font-medium uppercase tracking-wider"
              style={{ color: theme.primary }}
            >
              {categoryName}
            </p>
          )}

          <ToolClusterHero theme={theme} icon={iconName} title={config.content.h1} />

          <header className="mb-8 space-y-4 lg:mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              {config.content.h1}
            </h1>
            <p className="text-lg leading-relaxed text-neutral-600">{config.content.intro}</p>
          </header>

          <ToolPageProse config={config} />

          <Callout variant="info" title={config.guidance[0]?.title ?? "How to use this tracker"}>
            {config.guidance[0]?.body ? (
              <RichText text={config.guidance[0].body} />
            ) : null}
          </Callout>

          <form onSubmit={handleStartWeek} noValidate className="mt-8 space-y-8">
            <div className="grid gap-8 lg:grid-cols-[34fr_66fr] lg:items-start">
              <div className="space-y-6">
                <ToolFormSection>
                  <h3 className="text-base font-semibold text-neutral-900">
                    Set this week&apos;s ONE Thing
                  </h3>
                  <p className="mt-1 mb-4 text-sm text-neutral-600">
                    From the Focusing Question or your weekly plan — name one priority, optional
                    first move, then check in daily.
                  </p>
                  <div className="space-y-4">
                    <Input
                      id="one-thing"
                      label="Your ONE Thing this week"
                      value={oneThingDraft}
                      onChange={(event) => setOneThingDraft(event.target.value)}
                      placeholder="Finish the Q3 launch outline"
                      required
                    />
                    <Input
                      id="lead-domino"
                      label="Lead domino (optional)"
                      value={leadDominoDraft}
                      onChange={(event) => setLeadDominoDraft(event.target.value)}
                      placeholder="Draft the opening section"
                    />
                    <Input
                      id="week-start"
                      type="date"
                      label="Week starting (Monday)"
                      value={weekStartDraft}
                      onChange={(event) =>
                        setWeekStartDraft(getMondayOfWeek(event.target.value))
                      }
                      required
                    />
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                      <input
                        type="checkbox"
                        checked={excludeWeekendsDraft}
                        onChange={(event) => setExcludeWeekendsDraft(event.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300"
                      />
                      I don&apos;t work weekends — exclude Sat/Sun from scoring
                    </label>
                    {formError && (
                      <p className="text-sm text-red-600" role="alert">
                        {formError}
                      </p>
                    )}
                    <ToolCalculateButton
                      label={activePlan ? "Update my week" : "Start my week"}
                      type="submit"
                    />
                    {activePlan && (
                      <button
                        type="button"
                        onClick={handleResetWeek}
                        className="text-sm font-medium text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline"
                      >
                        Clear current week
                      </button>
                    )}
                  </div>
                </ToolFormSection>

                {checkInPanel}
              </div>

              <div className="lg:sticky lg:top-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">Your week</h2>
                {resultsPanel}
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
                    <RichText text={item.answer} />
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
