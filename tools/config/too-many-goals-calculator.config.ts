import { ENGINE_CONSTANTS } from "./constants";

export const tooManyGoalsCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "too-many-goals-calculator",
  slug: "too-many-goals-calculator",
  status: "published" as const,

  seo: {
    title: "Too Many Goals Calculator",
    metaDescription:
      "How many goals is too many? Enter your active goals and available focus hours — see goal dilution, Keller's go-small math, and why you need ONE Thing per horizon.",
    primaryKeyword: "too many goals",
    secondaryKeywords: [
      "goal dilution",
      "how many goals should I have",
      "too many priorities",
      "one goal at a time",
      "going small going big",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/too-many-goals-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["one-thing", "goals", "priorities"],
    cluster: "one-thing",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Too Many Goals Calculator",
    intro:
      "Enter your active goals and focus hours — see goal dilution and why Keller says you must go small to go big.",
    icon: "calculator",
    proseTitle: "About goal dilution",
    sections: [
      {
        id: "problem",
        heading: "Simultaneous goals, fractional progress",
        framework: "pas",
        body: "Five goals feel responsible — until each gets twenty percent of your best effort and none move. Spread too thin, you go small on everything instead of big on one thing.",
      },
      {
        id: "concept",
        heading: "Keller's economic reality",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) argues you can go small or go big — not both at once. In [The ONE Thing](https://www.the1thing.com/), simultaneous priorities mean diluted dominoes and sequential success never starts.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "outcome",
        body: "Hours per goal at your current load, dilution percentage, and how many goals your available focus time can actually support.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "active_goals",
        type: "integer" as const,
        label: "Active goals you're pursuing now",
        placeholder: "e.g. 5",
        hint: "Count real commitments — not wishes. Work, health, side projects, etc.",
        min: 1,
        max: 20,
        required: true,
        integer: true,
      },
      {
        id: "focus_hours_week",
        type: "number" as const,
        label: "Protected focus hours per week",
        placeholder: "e.g. 10",
        hint: "Time you actually protect for important work — not total work hours.",
        min: 1,
        max: 60,
        step: 0.5,
        required: true,
      },
    ],
    constants: {
      IDEAL_GOALS: 1,
      WEEKS_PER_YEAR: ENGINE_CONSTANTS.WEEKS_PER_YEAR,
    },
    expressions: {
      hoursPerGoalWeek: "inputs.focus_hours_week / inputs.active_goals",
      hoursPerGoalDay: "calcs.hoursPerGoalWeek / 5",
      dilutionPercent: "(1 / inputs.active_goals) * 100",
      focusIfOneGoal: "inputs.focus_hours_week",
      lostHoursPerGoal: "inputs.focus_hours_week - calcs.hoursPerGoalWeek",
      yearlyHoursPerGoal: "calcs.hoursPerGoalWeek * constants.WEEKS_PER_YEAR",
      yearlyHoursIfOne: "inputs.focus_hours_week * constants.WEEKS_PER_YEAR",
      isDiluted: "inputs.active_goals > constants.IDEAL_GOALS",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage: "Enter your active goals and focus hours to see goal dilution.",
    templates: [
      {
        id: "default",
        cardColumns: 3 as const,
        cards: [
          {
            title: "Hours per goal / week",
            valueTemplate: "{{calcs.hoursPerGoalWeek|decimal1}} hrs",
            descriptionTemplate: "{{inputs.focus_hours_week}} hrs split across {{inputs.active_goals}} goals",
          },
          {
            title: "Focus share per goal",
            valueTemplate: "{{calcs.dilutionPercent|decimal1}}%",
            descriptionTemplate: "Each goal gets an equal slice — Keller says go small",
          },
          {
            title: "If ONE goal only",
            valueTemplate: "{{calcs.focusIfOneGoal|decimal1}} hrs/wk",
            descriptionTemplate: "Same time, undivided — going big on one",
          },
        ],
        summaryTemplates: [
          "At {{inputs.active_goals}} goals, each gets {{calcs.yearlyHoursPerGoal|decimal1}} focus hours/year — vs {{calcs.yearlyHoursIfOne|decimal1}} if you picked one.",
        ],
        comparisonTitle: "Keller's economic reality",
        comparisonRules: [
          {
            when: "inputs.active_goals >= 5",
            textTemplate:
              "{{inputs.active_goals}} active goals — you're going very small on each. Extraordinary results need sequential focus, not simultaneous.",
          },
          {
            when: "inputs.active_goals >= 3",
            textTemplate:
              "Three or more goals at once means {{calcs.hoursPerGoalWeek|decimal1}} hrs/week each — hard to build mastery or momentum on any.",
          },
          {
            when: "calcs.hoursPerGoalDay < 0.5",
            textTemplate:
              "Under 30 minutes per goal daily — these aren't goals, they're wishes with calendar guilt.",
          },
          {
            when: "inputs.active_goals == 1",
            textTemplate:
              "One active goal — you're aligned with Keller's ONE Thing. Protect these hours fiercely.",
          },
          {
            when: "true",
            textTemplate:
              "Priority was singular for a reason — pick one goal per horizon, defer the rest visibly.",
          },
        ],
        fallbackComparison:
          "Use the Focusing Question to pick which goal survives — the others wait in a \"someday\" list.",
      },
    ],
  },

  guidance: [
    {
      title: "Go small or go big",
      body: "From The ONE Thing — you can achieve extraordinary results in many areas, but not at the same time. Multitasking goals means going small on all of them.",
      list: [
        "ONE Thing per domain per time horizon",
        "Other goals aren't deleted — they're sequenced",
        "Success is sequential, not simultaneous",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Stop splitting focus across apps",
      description:
        "Reset blocks distractions during your single priority block — undivided attention is how you go big on one goal.",
    },
  },

  faq: [
    {
      question: "How many goals should I have?",
      answer:
        "Keller argues for ONE Thing per time horizon per life area — not five equal priorities. Other goals wait their turn in the sequence.",
    },
    {
      question: "Does this mean I can only care about one thing in life?",
      answer:
        "No — you can have ONE Thing for work this quarter and ONE for health. The calculator shows cost when you pursue many active goals in the same slice of time.",
    },
    {
      question: "What do I do with extra goals?",
      answer:
        "Move them to a \"later\" list. Use Goal Setting to the Now to sequence them — dominoes, not simultaneous pushes.",
    },
  ],

  recommendations: [],
};
