"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Callout } from "@/components/ui/Callout";
import { InfoCard } from "@/components/ui/InfoCard";
import { Input } from "@/components/ui/Input";
import { RuleOf100FocusMode } from "@/components/ui/RuleOf100FocusMode";
import { RuleOf100Gauge } from "@/components/ui/RuleOf100Gauge";
import { RuleOf100HistoryChart } from "@/components/ui/RuleOf100HistoryChart";
import { Section } from "@/components/ui/Section";
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
  addTimerSeconds,
  archiveChallenge,
  buildDayHistoryVisual,
  buildTodaySummary,
  createChallenge,
  getCompletionPercent,
  getDayScoreBand,
  getTodayCount,
  loadRuleOf100Store,
  resetDay,
  saveRuleOf100Store,
  setDayCount,
  todayIsoDate,
  updateChallengeSettings,
} from "@/lib/rule-of-100";
import type { RuleOf100Challenge, RuleOf100Store } from "@/lib/rule-of-100";
import { DEFAULT_DAILY_TARGET, MAX_DAILY_TARGET, MIN_DAILY_TARGET } from "@/lib/rule-of-100";
import { formatDayMonth, formatTimerDuration } from "@/lib/rule-of-100/format";
import { TRACKERS_UPDATED_EVENT } from "@/lib/trackers/events";
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

interface RuleOf100EngineProps {
  config: ToolConfig;
  relatedTools: RelatedTool[];
  categoryName?: string;
}

function buildWorkingSummary(
  count: number,
  target: number,
): {
  count: number;
  target: number;
  percent: number;
  band: ReturnType<typeof getDayScoreBand>;
} {
  return {
    count,
    target,
    percent: getCompletionPercent(count, target),
    band: getDayScoreBand(count, target),
  };
}

const emptyStore: RuleOf100Store = {
  activeChallenge: null,
  archivedChallenges: [],
};

function subscribeToStore(onStoreChange: () => void) {
  window.addEventListener(TRACKERS_UPDATED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(TRACKERS_UPDATED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function RuleOf100Engine({
  config,
  relatedTools,
  categoryName,
}: RuleOf100EngineProps) {
  const store = useSyncExternalStore(
    subscribeToStore,
    loadRuleOf100Store,
    () => emptyStore,
  );
  const [taskOverride, setTaskOverride] = useState<{
    name?: string;
    target?: string;
  } | null>(null);
  const [sessionDelta, setSessionDelta] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [manualCount, setManualCount] = useState("");
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const [countSavedMessage, setCountSavedMessage] = useState<string | null>(null);

  const today = todayIsoDate();
  const challenge = store.activeChallenge;
  const taskNameDraft = taskOverride?.name ?? challenge?.taskName ?? "";
  const dailyTargetDraft =
    taskOverride?.target ??
    (challenge ? String(challenge.dailyTarget) : String(DEFAULT_DAILY_TARGET));
  const savedCount = challenge ? getTodayCount(challenge, today) : 0;
  const workingCount = savedCount + sessionDelta;
  const hasUnsavedCount = sessionDelta !== 0;
  const summary = useMemo(
    () => (challenge ? buildTodaySummary(challenge, today) : null),
    [challenge, today],
  );
  const workingSummary = useMemo(
    () => (challenge ? buildWorkingSummary(workingCount, challenge.dailyTarget) : null),
    [challenge, workingCount],
  );
  const history = useMemo(
    () => (challenge ? buildDayHistoryVisual(challenge, today, 14) : []),
    [challenge, today],
  );

  const persistStore = (
    updater: RuleOf100Store | ((previous: RuleOf100Store) => RuleOf100Store),
  ) => {
    const previous = loadRuleOf100Store();
    const next = typeof updater === "function" ? updater(previous) : updater;
    saveRuleOf100Store(next);
  };

  const persistChallenge = (nextChallenge: RuleOf100Challenge) => {
    persistStore((previous) => ({
      ...previous,
      activeChallenge: nextChallenge,
    }));
  };

  useEffect(() => {
    if (!timerRunning) return;

    const interval = window.setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const handleStartOrUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      const target = Number(dailyTargetDraft);
      if (challenge) {
        const updated = updateChallengeSettings(challenge, {
          taskName: taskNameDraft,
          dailyTarget: target,
        });
        persistChallenge(updated);
        setTaskOverride(null);
        return;
      }

      const created = createChallenge({
        taskName: taskNameDraft,
        dailyTarget: target,
        startDate: today,
      });
      persistStore({
        ...store,
        activeChallenge: created,
      });
      setTaskOverride(null);
      setSessionDelta(0);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid input");
    }
  };

  const handleIncrement = (delta: number) => {
    if (!challenge) return;
    setCountSavedMessage(null);
    setSessionDelta((previous) => previous + delta);
    trackEvent({
      name: "rule_of_100_rep_logged",
      tool_slug: config.slug,
      delta: String(delta),
    });
  };

  const handleSaveDailyCount = () => {
    if (!challenge) return;
    setFormError(null);

    try {
      let nextChallenge = challenge;
      if (sessionSeconds > 0) {
        nextChallenge = addTimerSeconds(nextChallenge, today, sessionSeconds);
        setSessionSeconds(0);
      }
      nextChallenge = setDayCount(nextChallenge, today, workingCount);
      persistChallenge(nextChallenge);
      setSessionDelta(0);
      setCountSavedMessage("Today's count saved on this device.");
      trackEvent({
        name: "rule_of_100_day_saved",
        tool_slug: config.slug,
        count: String(workingCount),
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not save today's count");
    }
  };

  const openFocusMode = () => {
    setFocusModeOpen(true);
    trackEvent({
      name: "rule_of_100_focus_mode_open",
      tool_slug: config.slug,
    });
  };

  const closeFocusMode = () => {
    setFocusModeOpen(false);
  };

  const handleManualSet = () => {
    if (!challenge) return;
    setFormError(null);
    setCountSavedMessage(null);

    try {
      const count = Number(manualCount);
      if (!Number.isFinite(count)) {
        throw new Error("Count must be a number.");
      }
      setSessionDelta(Math.max(0, Math.round(count)) - savedCount);
      setManualCount("");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid count");
    }
  };

  const handleResetToday = () => {
    if (!challenge) return;
    persistChallenge(resetDay(challenge, today));
    setSessionDelta(0);
    setCountSavedMessage(null);
    setSessionSeconds(0);
    setTimerRunning(false);
  };

  const handleArchive = () => {
    if (!challenge) return;
    persistStore(archiveChallenge(store, challenge));
    setTaskOverride(null);
    setSessionDelta(0);
    setCountSavedMessage(null);
    setSessionSeconds(0);
    setTimerRunning(false);
  };

  const flushTimer = () => {
    if (!challenge || sessionSeconds <= 0) return;
    persistChallenge(addTimerSeconds(challenge, today, sessionSeconds));
    setSessionSeconds(0);
  };

  const handleToggleTimer = () => {
    if (timerRunning) {
      flushTimer();
      setTimerRunning(false);
      return;
    }
    setTimerRunning(true);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setSessionSeconds(0);
  };

  const totalTimerSeconds = (summary?.timerSeconds ?? 0) + (timerRunning ? sessionSeconds : 0);
  const theme = resolveToolTheme(config);
  const iconName = getToolIconName(config);
  const toolPath = config.seo.canonicalPath;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: config.content.h1, href: toolPath },
  ];

  const schemas = [
    webApplicationSchema({
      name: config.content.h1,
      description: config.content.intro,
      path: toolPath,
    }),
    breadcrumbSchema(breadcrumbItems.slice(0, -1)),
    faqSchema(config.faq),
  ].filter((schema): schema is NonNullable<typeof schema> => schema !== null);

  const counterPanel = challenge && summary && workingSummary && (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Today · {formatDayMonth(today)}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-neutral-900">{challenge.taskName}</h3>
          </div>
          {summary.streakDays > 0 && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              {summary.streakDays}-day streak
            </span>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Current session count
          </p>
          <p className="mt-2 text-5xl font-semibold tabular-nums text-neutral-900">
            {workingCount}
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Saved today: {savedCount} / {challenge.dailyTarget}
          </p>
        </div>

        {hasUnsavedCount && (
          <p className="mt-4 text-sm text-amber-800">
            You have unsaved reps. Save before leaving this page to keep today&apos;s count.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSaveDailyCount}
            className={cn(
              "inline-flex h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:w-auto",
              hasUnsavedCount
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
            )}
          >
            Save daily count
          </button>
          <button
            type="button"
            onClick={openFocusMode}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Focus mode
          </button>
          {[1, 5, 10].map((delta) => (
            <button
              key={delta}
              type="button"
              onClick={() => handleIncrement(delta)}
              className="inline-flex h-12 min-w-[4.5rem] flex-1 items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              +{delta}
            </button>
          ))}
        </div>

        {countSavedMessage && (
          <p className="mt-4 text-sm text-emerald-700" role="status">
            {countSavedMessage}
          </p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            label="Set session count"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={manualCount}
            onChange={(event) => setManualCount(event.target.value)}
            placeholder={`Session count: ${workingCount}`}
          />
          <button
            type="button"
            onClick={handleManualSet}
            className="self-end inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Update session
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Focus timer</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Track time on your reps — saved to today&apos;s line.
            </p>
          </div>
          <span className="text-2xl font-semibold tabular-nums text-neutral-900">
            {formatTimerDuration(totalTimerSeconds)}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleToggleTimer}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
              timerRunning
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-neutral-900 text-white hover:bg-neutral-800",
            )}
          >
            {timerRunning ? "Pause & save" : "Start timer"}
          </button>
          <button
            type="button"
            onClick={handleResetTimer}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Reset session
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleResetToday}
          className="text-sm font-medium text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline"
        >
          Reset today&apos;s count
        </button>
        <button
          type="button"
          onClick={handleArchive}
          className="text-sm font-medium text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline"
        >
          Archive task & start fresh
        </button>
      </div>
    </div>
  );

  const resultsPanel = challenge && summary ? (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <RuleOf100Gauge
          count={summary.count}
          target={summary.target}
          percent={summary.percent}
          band={summary.band}
        />
        <p className="mt-4 text-center text-sm leading-relaxed text-neutral-600">
          {summary.message}
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-neutral-900">Daily history</h3>
        <p className="mt-1 text-xs text-neutral-500">Last 14 days — one bar per day.</p>
        <RuleOf100HistoryChart days={history} className="mt-5" />
      </div>
    </div>
  ) : (
    <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500">
      {config.results.emptyMessage}
    </div>
  );

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

          {config.guidance[0] && (
            <Callout variant="info" title={config.guidance[0].title}>
              <RichText text={config.guidance[0].body} />
            </Callout>
          )}

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <form onSubmit={handleStartOrUpdate} noValidate className="space-y-8">
              <ToolFormSection>
                <h3 className="text-base font-semibold text-neutral-900">
                  {challenge ? "Task settings" : "Start your Rule of 100"}
                </h3>
                <p className="mt-1 mb-4 text-sm text-neutral-600">
                  {challenge
                    ? "Rename your task or change the daily target."
                    : "Name the lead measure you will repeat every day."}
                </p>
                <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
                  <Input
                    label="Task name"
                    name="taskName"
                    value={taskNameDraft}
                    onChange={(event) =>
                      setTaskOverride((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Message prospects, Record content minutes"
                    required
                  />
                  <Input
                    label="Daily target"
                    name="dailyTarget"
                    type="number"
                    min={MIN_DAILY_TARGET}
                    max={MAX_DAILY_TARGET}
                    step={1}
                    inputMode="numeric"
                    hint={`${MIN_DAILY_TARGET}–${MAX_DAILY_TARGET}`}
                    value={dailyTargetDraft}
                    onChange={(event) =>
                      setTaskOverride((previous) => ({
                        ...previous,
                        target: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                {formError && (
                  <p className="text-sm text-red-600" role="alert">
                    {formError}
                  </p>
                )}
                <ToolCalculateButton
                  label={challenge ? "Save task settings" : "Start tracking"}
                  type="submit"
                />
                </div>
              </ToolFormSection>

              {counterPanel}
            </form>

            <div className="lg:sticky lg:top-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">Your progress</h2>
              {resultsPanel}
            </div>
          </div>
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

      {challenge && workingSummary && (
        <RuleOf100FocusMode
          open={focusModeOpen}
          onClose={closeFocusMode}
          taskName={challenge.taskName}
          count={workingSummary.count}
          target={workingSummary.target}
          percent={workingSummary.percent}
          band={workingSummary.band}
          onIncrement={() => handleIncrement(1)}
        />
      )}
    </article>
  );
}
