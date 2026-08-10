export interface ClusterJourneyStep {
  slug: string;
  title: string;
  description: string;
  repeatUse?: boolean;
  /** Cross-cluster or follow-on step — shown after the core path. */
  optional?: boolean;
}

export interface ClusterJourney {
  title: string;
  description: string;
  steps: ClusterJourneyStep[];
}

const clusterJourneys: Record<string, ClusterJourney> = {
  "one-thing": {
    title: "Recommended path",
    description:
      "Diagnose planning habits, pick one priority, block time, then track execution week over week.",
    steps: [
      {
        slug: "weekly-planning-score",
        title: "Score your planning habits",
        description: "Four questions — see if you're reactive, over-planning, or ready to level up.",
      },
      {
        slug: "the-focusing-question",
        title: "Pick your ONE Thing",
        description: "Gary Keller's Focusing Question for the right time horizon and domain.",
      },
      {
        slug: "goal-setting-to-the-now",
        title: "Connect goals to today",
        description: "Find the broken rung on the Someday → today ladder.",
      },
      {
        slug: "protect-your-one-thing-time-block",
        title: "Schedule your block",
        description: "See where protected time fits before the calendar fills up.",
      },
      {
        slug: "one-thing-weekly-check-in",
        title: "Track this week",
        description: "Daily yes / partial / missed check-ins with blocker tags and week review.",
        repeatUse: true,
      },
      {
        slug: "four-thieves-productivity-quiz",
        title: "When focus keeps slipping",
        description: "Diagnose which thief — can't say no, chaos, health, or environment.",
      },
    ],
  },
  "deep-work": {
    title: "Recommended path",
    description:
      "Classify your work, choose a depth philosophy, protect blocks, and close the day cleanly.",
    steps: [
      {
        slug: "deep-or-shallow-work-quiz",
        title: "Classify deep vs shallow",
        description: "See what to protect, batch, delegate, or eliminate.",
      },
      {
        slug: "how-to-do-deep-work",
        title: "Find your blocker",
        description: "Personalized plan when depth keeps slipping away.",
      },
      {
        slug: "deep-work-schedule-quiz",
        title: "Pick a schedule philosophy",
        description: "Monastic, bimodal, rhythmic, or journalistic — match your life.",
      },
      {
        slug: "shutdown-ritual-builder",
        title: "Close the workday",
        description: "End-of-day ritual so tomorrow's block starts clean.",
      },
    ],
  },
  money: {
    title: "Recommended path",
    description: "Set a target, project growth, then log check-ins on a visual savings path.",
    steps: [
      {
        slug: "savings-goal-calculator",
        title: "Size your goal",
        description: "How much to save and by when — with required monthly contribution.",
      },
      {
        slug: "investment-growth-calculator",
        title: "Project growth",
        description: "See compound growth with contributions over time.",
      },
      {
        slug: "savings-path-tracker",
        title: "Track your path",
        description: "Repeat-use chart — log balance check-ins against your target line.",
        repeatUse: true,
      },
    ],
  },
  procrastination: {
    title: "Recommended path",
    description:
      "Name why you delay, see what it costs, get a matched plan, then break the loop with one small start.",
    steps: [
      {
        slug: "why-am-i-procrastinating",
        title: "Diagnose the real reason",
        description: "Four questions — fear, overwhelm, fatigue, boredom, or unclear next step.",
      },
      {
        slug: "procrastination-cost-calculator",
        title: "Quantify the delay",
        description: "See hours and money lost to putting important work off.",
      },
      {
        slug: "how-to-stop-procrastinating",
        title: "Get a matched rescue plan",
        description: "Five questions → personalized steps for your trigger, not generic advice.",
      },
      {
        slug: "give-me-one-small-task",
        title: "Break the freeze",
        description: "One tiny task when the whole project feels too heavy to start.",
      },
      {
        slug: "i-keep-procrastinating",
        title: "Break the chronic loop",
        description: "When delay repeats week after week — name the pattern and interrupt it.",
      },
    ],
  },
  "phone-and-focus": {
    title: "Recommended path",
    description:
      "Measure what distractions cost, work through checking and scrolling, rescue focus mid-day — then optionally quantify meetings and task-switching.",
    steps: [
      {
        slug: "notification-cost-calculator",
        title: "Cost of every ping",
        description: "Interruptions per year, recovery hours, and illustrative earnings impact.",
      },
      {
        slug: "screen-time-cost-calculator",
        title: "Annual screen time cost",
        description: "Hours on your phone translated into work-days and focus lost.",
      },
      {
        slug: "how-to-stop-checking-your-phone",
        title: "Break the checking habit",
        description: "Matched plan for compulsive phone checks between tasks.",
      },
      {
        slug: "how-to-stop-doomscrolling",
        title: "Escape scroll loops",
        description: "Diagnose your scroll trigger and swap in a concrete replacement.",
      },
      {
        slug: "help-me-focus-now",
        title: "Focus rescue right now",
        description: "Stuck mid-day? One concrete focus step in under a minute.",
      },
      {
        slug: "context-switch-cost-calculator",
        title: "Cost of task-switching",
        description:
          "Optional — tab hops and refocus time add up. See daily and annual hours lost to context switches.",
        optional: true,
      },
      {
        slug: "meeting-cost-calculator",
        title: "Cost of your meeting load",
        description:
          "Optional — when the calendar fragments your day. Hours and salary spent in meetings each year.",
        optional: true,
      },
    ],
  },
};

export function getClusterJourney(hubSlug: string): ClusterJourney | undefined {
  return clusterJourneys[hubSlug];
}

export const REPEAT_USE_TOOL_SLUGS = new Set([
  "one-thing-weekly-check-in",
  "savings-path-tracker",
  "rule-of-100-tracker",
]);

export function isRepeatUseTool(slug: string): boolean {
  return REPEAT_USE_TOOL_SLUGS.has(slug);
}
