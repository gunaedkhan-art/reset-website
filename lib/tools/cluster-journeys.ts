export interface ClusterJourneyStep {
  slug: string;
  title: string;
  description: string;
  repeatUse?: boolean;
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
};

export function getClusterJourney(hubSlug: string): ClusterJourney | undefined {
  return clusterJourneys[hubSlug];
}

export const REPEAT_USE_TOOL_SLUGS = new Set([
  "one-thing-weekly-check-in",
  "savings-path-tracker",
]);

export function isRepeatUseTool(slug: string): boolean {
  return REPEAT_USE_TOOL_SLUGS.has(slug);
}
