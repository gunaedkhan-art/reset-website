import type { DecisionTreeState } from "@/lib/tool-engine/modes/decision-tree";
import type { ResultTemplate } from "@/lib/tool-engine/schema/tool-config";
import {
  renderTemplate,
  type TemplateContext,
} from "@/lib/tool-engine/template/render";

const GOAL_SETTING_WEEKLY_RESULTS = new Set([
  "weekly",
  "daily",
  "connected",
]);

const FOCUSING_WEEKLY_RESULTS = new Set(["work_week"]);

export interface WeeklyTrackerSuggestions {
  oneThing: string;
  leadDomino: string;
}

/** Whether to show the weekly check-in CTA after a decision-tree result. */
export function shouldOfferWeeklyTracker(
  toolSlug: string,
  state: DecisionTreeState,
): boolean {
  if (!state.complete || !state.resultTemplateId) return false;

  if (toolSlug === "whats-my-lead-domino") return true;

  if (toolSlug === "the-focusing-question") {
    return (
      state.answers.q_horizon === "week" ||
      FOCUSING_WEEKLY_RESULTS.has(state.resultTemplateId)
    );
  }

  if (toolSlug === "goal-setting-to-the-now") {
    return (
      state.answers.q_break === "week" ||
      state.answers.q_break === "today" ||
      GOAL_SETTING_WEEKLY_RESULTS.has(state.resultTemplateId)
    );
  }

  return false;
}

/** Pre-fill copy for the Track this week panel from result cards. */
export function getWeeklyTrackerSuggestions(
  toolSlug: string,
  resultTemplate: ResultTemplate | null | undefined,
  templateContext: TemplateContext,
): WeeklyTrackerSuggestions {
  if (!resultTemplate?.cards?.length) {
    return { oneThing: "", leadDomino: "" };
  }

  const cards = resultTemplate.cards;
  const render = (template: string) => renderTemplate(template, templateContext);

  const findCard = (pattern: RegExp) =>
    cards.find((card) => pattern.test(card.title));

  if (toolSlug === "whats-my-lead-domino") {
    const actionCard = findCard(/ask|example/i);
    const leadDomino = actionCard?.descriptionTemplate
      ? render(actionCard.descriptionTemplate)
      : actionCard?.valueTemplate
        ? render(actionCard.valueTemplate)
        : "";
    return { oneThing: "", leadDomino };
  }

  if (toolSlug === "the-focusing-question") {
    const weekCard = findCard(/this week|weekly/i);
    const exampleCard = findCard(/example/i);
    return {
      oneThing: exampleCard?.valueTemplate
        ? render(exampleCard.valueTemplate)
        : weekCard?.valueTemplate
          ? render(weekCard.valueTemplate)
          : "",
      leadDomino: exampleCard?.descriptionTemplate
        ? render(exampleCard.descriptionTemplate)
        : "",
    };
  }

  if (toolSlug === "goal-setting-to-the-now") {
    const fixCard = findCard(/fix/i);
    return {
      oneThing: "",
      leadDomino: fixCard?.descriptionTemplate
        ? render(fixCard.descriptionTemplate)
        : fixCard?.valueTemplate
          ? render(fixCard.valueTemplate)
          : "",
    };
  }

  const oneThingCard = findCard(/one thing|this week/i) ?? cards[0];
  const leadCard = findCard(/fix|lead|ask|example|next step/i);

  return {
    oneThing: oneThingCard?.valueTemplate
      ? render(oneThingCard.valueTemplate)
      : "",
    leadDomino: leadCard?.descriptionTemplate
      ? render(leadCard.descriptionTemplate)
      : leadCard?.valueTemplate
        ? render(leadCard.valueTemplate)
        : "",
  };
}
