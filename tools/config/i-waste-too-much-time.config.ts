import { ENGINE_CONSTANTS } from "./constants";

export const iWasteTooMuchTimeConfig = {
  schemaVersion: "1.0" as const,
  id: "i-waste-too-much-time",
  slug: "i-waste-too-much-time",
  status: "published" as const,

  seo: {
    title: "I Waste Too Much Time",
    metaDescription:
      "Feel like you waste too much time? Calculate how many hours you lose per year to distraction — and see what you could reclaim.",
    primaryKeyword: "i waste too much time",
    secondaryKeywords: [
      "wasting time",
      "waste too much time",
      "time wasted calculator",
      "how much time do i waste",
      "stop wasting time",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/i-waste-too-much-time",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["time-waste", "productivity", "distraction"],
    cluster: "time-waste",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "I Waste Too Much Time",
    intro:
      "That vague guilt has a number. Estimate how much time you lose daily to distraction — and see what you'd get back in a year.",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "wasted_hours",
        type: "number" as const,
        label: "Hours wasted per day (estimate)",
        placeholder: "e.g. 2.5",
        hint: "Phone, scrolling, procrastination, TV, random tabs — honest average.",
        min: 0,
        max: 16,
        step: 0.25,
        required: true,
      },
    ],
    constants: {
      DAYS_PER_YEAR: ENGINE_CONSTANTS.DAYS_PER_YEAR,
      WORK_HOURS_PER_WEEK: ENGINE_CONSTANTS.WORK_HOURS_PER_WEEK,
      HOURLY_WAGE: ENGINE_CONSTANTS.ILLUSTRATIVE_HOURLY_WAGE,
    },
    expressions: {
      hoursPerYear: "inputs.wasted_hours * constants.DAYS_PER_YEAR",
      daysPerYear: "calcs.hoursPerYear / 24",
      workWeeksLost: "calcs.hoursPerYear / constants.WORK_HOURS_PER_WEEK",
      salaryCost: "calcs.hoursPerYear * constants.HOURLY_WAGE",
      halfReclaimed: "calcs.hoursPerYear / 2",
      booksCount: "floor(calcs.hoursPerYear / 5)",
      percentOfWaking: "(inputs.wasted_hours / 16) * 100",
      halfHourSavedYear: "0.5 * constants.DAYS_PER_YEAR",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage: "Enter your daily wasted hours to see the annual cost.",
    templates: [
      {
        id: "default",
        cardColumns: 3 as const,
        cards: [
          {
            title: "Hours lost per year",
            valueTemplate: "{{calcs.hoursPerYear|decimal1}}",
            descriptionTemplate: "{{inputs.wasted_hours}} hrs/day × 365",
          },
          {
            title: "Full days lost",
            valueTemplate: "{{calcs.daysPerYear|decimal1}}",
            descriptionTemplate: "24-hour days of wasted time",
          },
          {
            title: "Work weeks lost",
            valueTemplate: "{{calcs.workWeeksLost|decimal1}}",
            descriptionTemplate: "At 40 hours per week",
          },
        ],
        summaryTemplates: [
          "At $35/hr illustrative wage, that's ${{calcs.salaryCost|integer}}/year — and halving waste returns {{calcs.halfReclaimed|decimal1}} hours annually.",
        ],
        comparisonTitle: "What you could reclaim",
        comparisonRules: [
          {
            when: "inputs.wasted_hours >= 3",
            textTemplate:
              "{{inputs.wasted_hours}} hours/day wasted is roughly {{calcs.percentOfWaking|decimal1}}% of waking life — small cuts matter enormously.",
          },
          {
            when: "calcs.booksCount >= 20",
            textTemplate:
              "Enough time for {{calcs.booksCount}}+ books — or a new skill, side project, or real rest.",
          },
          {
            when: "calcs.workWeeksLost >= 4",
            textTemplate:
              "{{calcs.workWeeksLost|decimal1}} work weeks per year — reclaiming half is like gaining a month of life back.",
          },
          {
            when: "inputs.wasted_hours >= 1",
            textTemplate:
              "Cutting waste by 30 minutes daily saves {{calcs.halfHourSavedYear|decimal1}}+ hours per year.",
          },
          {
            when: "true",
            textTemplate:
              "Waste isn't moral failure — it's unprotected time. Limits and focus blocks beat guilt.",
          },
        ],
        fallbackComparison:
          "Track Screen Time for one week — most people underestimate waste by half.",
      },
    ],
  },

  guidance: [
    {
      title: "What counts as wasted time?",
      body: "Time you didn't choose and don't value afterward — compulsive scrolling, procrastination loops, passive TV, mindless browsing.",
      list: [
        "Intentional rest and hobbies don't count as waste",
        "Use your gut: \"Would I choose this again?\"",
        "Check phone Screen Time for a reality check",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Turn wasted hours into chosen time",
      description:
        "Reset blocks the default distractions that eat your day — so reclaimed time goes to what you actually picked.",
    },
  },

  faq: [
    {
      question: "How do I estimate wasted hours honestly?",
      answer:
        "Check Screen Time or Digital Wellbeing for one week. Add procrastination during work (guesstimate). Most people find 1.5–4 hours daily.",
    },
    {
      question: "Is all screen time wasted?",
      answer:
        "No. Learning, creative work, and connecting with people you care about aren't waste. This tool targets time you regret or don't remember.",
    },
    {
      question: "What's the first step to waste less?",
      answer:
        "Pick one leak — usually social feeds or morning phone — and add a hard 30-minute daily limit. One fix beats ten vague resolutions.",
    },
  ],

  recommendations: [],
};
