import { ENGINE_CONSTANTS } from "./constants";

export const fixedScheduleProductivityCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "fixed-schedule-productivity-calculator",
  slug: "fixed-schedule-productivity-calculator",
  status: "published" as const,

  seo: {
    title: "Fixed Schedule Productivity Calculator",
    metaDescription:
      "Cal Newport's fixed-schedule productivity: pick your end time, enter your shallow load — see how many deep work hours fit and what must get cut to leave on time.",
    primaryKeyword: "fixed schedule productivity",
    secondaryKeywords: [
      "fixed schedule work",
      "work fixed hours",
      "leave work on time",
      "deep work hours calculator",
      "cal newport fixed schedule",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/fixed-schedule-productivity-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["deep-work", "scheduling", "boundaries"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Fixed Schedule Productivity Calculator",
    intro:
      "Fix when work ends, then see how many deep work hours fit inside — and what shallow load must shrink to leave on time.",
    icon: "calculator",
    proseTitle: "About fixed-schedule productivity",
    sections: [
      {
        id: "problem",
        heading: "When work expands to fill all hours",
        framework: "pas",
        body: "Without a hard stop, shallow work creeps into evenings and deep work gets \"whatever's left.\" The calendar grows; boundaries dissolve; burnout follows even when output doesn't improve.",
      },
      {
        id: "concept",
        heading: "Fix the finish line first",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) practices fixed-schedule productivity: choose when work ends, then reverse-engineer what fits. Depth becomes a budget line item — not a reward for finishing everything else.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "outcome",
        body: "Your deep work hour budget given your day length and shallow load — plus what must get cut, batched, or delegated to honor a fixed end time.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "work_hours_day",
        type: "number" as const,
        label: "Total work hours per day",
        placeholder: "e.g. 8",
        hint: "Your fixed schedule cap — when you commit to stopping.",
        min: 4,
        max: 14,
        step: 0.5,
        required: true,
      },
      {
        id: "meeting_hours_day",
        type: "number" as const,
        label: "Meeting hours per day",
        placeholder: "e.g. 2.5",
        hint: "Average scheduled calls and syncs.",
        min: 0,
        max: 10,
        step: 0.25,
        required: true,
      },
      {
        id: "shallow_hours_day",
        type: "number" as const,
        label: "Email, Slack & admin hours per day",
        placeholder: "e.g. 2",
        hint: "Reactive shallow work — batched or scattered.",
        min: 0,
        max: 10,
        step: 0.25,
        required: true,
      },
      {
        id: "target_deep_hours_day",
        type: "number" as const,
        label: "Deep work hours you want daily",
        placeholder: "e.g. 2",
        hint: "Your goal — uninterrupted focus on hard tasks.",
        min: 0,
        max: 8,
        step: 0.25,
        required: true,
      },
    ],
    constants: {
      WORK_DAYS_PER_WEEK: 5,
      WEEKS_PER_YEAR: ENGINE_CONSTANTS.WEEKS_PER_YEAR,
    },
    expressions: {
      claimedHoursDay:
        "inputs.meeting_hours_day + inputs.shallow_hours_day + inputs.target_deep_hours_day",
      slackHoursDay: "inputs.work_hours_day - calcs.claimedHoursDay",
      overcommittedHours: "max(0, calcs.claimedHoursDay - inputs.work_hours_day)",
      maxDeepHoursDay: "max(0, inputs.work_hours_day - inputs.meeting_hours_day - inputs.shallow_hours_day)",
      deepGap: "inputs.target_deep_hours_day - calcs.maxDeepHoursDay",
      deepPercent: "(inputs.target_deep_hours_day / inputs.work_hours_day) * 100",
      weeklyDeepHours: "inputs.target_deep_hours_day * constants.WORK_DAYS_PER_WEEK",
      yearlyDeepHours: "calcs.weeklyDeepHours * constants.WEEKS_PER_YEAR",
      shallowToCut: "max(0, calcs.overcommittedHours)",
      fitsSchedule: "calcs.claimedHoursDay <= inputs.work_hours_day",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your fixed schedule and workload to see if your deep work goal fits.",
    templates: [
      {
        id: "default",
        cardColumns: 3 as const,
        cards: [
          {
            title: "Max deep hours possible",
            valueTemplate: "{{calcs.maxDeepHoursDay|decimal1}} hrs",
            descriptionTemplate: "Inside your fixed {{inputs.work_hours_day}}-hr day",
          },
          {
            title: "Your deep target",
            valueTemplate: "{{inputs.target_deep_hours_day|decimal1}} hrs",
            descriptionTemplate: "{{calcs.deepPercent|decimal1}}% of workday",
          },
          {
            title: "Schedule slack",
            valueTemplate: "{{calcs.slackHoursDay|decimal1}} hrs",
            descriptionTemplate: "Buffer after meetings, shallow, and deep",
          },
        ],
        summaryTemplates: [
          "Fixed schedule: {{calcs.weeklyDeepHours|decimal1}} deep hrs/week → {{calcs.yearlyDeepHours|decimal1}} hrs/year if you hit target daily.",
        ],
        comparisonTitle: "Newport's fixed-schedule verdict",
        comparisonRules: [
          {
            when: "calcs.overcommittedHours > 0",
            textTemplate:
              "Overcommitted by {{calcs.overcommittedHours|decimal1}} hrs/day — cut {{calcs.shallowToCut|decimal1}} hrs of shallow or meetings to leave on time with your deep goal.",
          },
          {
            when: "calcs.deepGap > 0",
            textTemplate:
              "Your {{inputs.target_deep_hours_day}}-hr deep target exceeds capacity by {{calcs.deepGap|decimal1}} hrs — lower target or shrink shallow work.",
          },
          {
            when: "calcs.maxDeepHoursDay >= 2 && calcs.overcommittedHours <= 0",
            textTemplate:
              "{{calcs.maxDeepHoursDay|decimal1}} deep hours fit your fixed day — block them first thing before shallow work expands.",
          },
          {
            when: "inputs.meeting_hours_day >= inputs.work_hours_day * 0.5",
            textTemplate:
              "Meetings eat half your fixed day — deep work needs calendar surgery, not longer hours.",
          },
          {
            when: "true",
            textTemplate:
              "Fixed schedule means the end time is non-negotiable — what doesn't fit gets cut or deferred, not stolen from evening.",
          },
        ],
        fallbackComparison:
          "Run the shallow work audit — most people underestimate shallow hours blocking fixed schedules.",
      },
    ],
  },

  guidance: [
    {
      title: "Fixed-schedule productivity",
      body: "Cal Newport's approach: choose when work ends, then work backward — deep work and shallow work must fit inside, or something gets eliminated.",
      list: [
        "End time is fixed — overtime is a planning failure",
        "Deep blocks scheduled first, not leftover scraps",
        "Shrinking shallow work funds depth within the cap",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Protect deep hours inside your fixed day",
      description:
        "Reset blocks distractions during scheduled deep work — so fixed-schedule hours aren't lost to phone drift.",
    },
  },

  faq: [
    {
      question: "What is fixed-schedule productivity?",
      answer:
        "[Cal Newport](https://calnewport.com/)'s method: commit to when your workday ends, then fit deep work, meetings, and shallow tasks inside that cap — forcing tradeoffs instead of endless evenings. See [Deep Work](https://calnewport.com/books/deep-work/) for the fixed-schedule philosophy.",
    },
    {
      question: "What if my schedule doesn't fit?",
      answer:
        "Cut shallow work (batch email), decline meetings, or lower deep target temporarily — don't extend the day. Fixed means fixed.",
    },
    {
      question: "How is this different from the shallow work audit?",
      answer:
        "The [Shallow Work Audit](/shallow-work-audit) shows shallow vs deep ratio. This calculator tests whether your desired deep hours fit a fixed end time — planning backward from the cap.",
    },
  ],

  recommendations: [],
};
