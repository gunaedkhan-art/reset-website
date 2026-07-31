import { ENGINE_CONSTANTS } from "./constants";

export const meetingCostCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "meeting-cost-calculator",
  slug: "meeting-cost-calculator",
  status: "published" as const,

  seo: {
    title: "Meeting Cost Calculator",
    metaDescription:
      "Calculate the true cost of your meetings — hours spent per year, salary cost, and how much deep work time meetings consume.",
    primaryKeyword: "meeting cost calculator",
    secondaryKeywords: [
      "cost of meetings",
      "meeting time calculator",
      "too many meetings",
      "meeting productivity",
      "work meeting hours",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/meeting-cost-calculator",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["meetings", "time-management", "workplace"],
    cluster: "meeting-cost",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Meeting Cost Calculator",
    intro:
      "See how much time and money your meeting load costs each year — and how many full work weeks disappear into calendars.",
    icon: "calendar",
    proseTitle: "About this calculator",
    sections: [
      {
        id: "problem",
        heading: "Death by calendar",
        framework: "pas",
        body: "Back-to-back meetings fragment the day. You finish \"busy\" but can't point to focused output — because the calendar owns your attention before you do.",
      },
      {
        id: "concept",
        heading: "Meetings are often shallow work",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) distinguishes shallow work — logistical, reactive tasks — from deep work that creates new value. Most meetings fall in the shallow bucket; the cost is what they displace.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "aida",
        body: "Annual meeting hours, equivalent full work weeks, illustrative salary cost, and how many two-hour deep work blocks your calendar consumes.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "meetings_per_week",
        type: "integer" as const,
        label: "Meetings per week",
        placeholder: "e.g. 12",
        hint: "Include recurring standups, 1:1s, and ad-hoc calls.",
        min: 0,
        max: 100,
        required: true,
        integer: true,
      },
      {
        id: "minutes_per_meeting",
        type: "integer" as const,
        label: "Average meeting length (minutes)",
        placeholder: "e.g. 45",
        min: 5,
        max: 480,
        required: true,
        integer: true,
      },
    ],
    constants: {
      WEEKS_PER_YEAR: ENGINE_CONSTANTS.WEEKS_PER_YEAR,
      WORK_HOURS_PER_WEEK: ENGINE_CONSTANTS.WORK_HOURS_PER_WEEK,
      HOURLY_WAGE: ENGINE_CONSTANTS.ILLUSTRATIVE_HOURLY_WAGE,
    },
    expressions: {
      hoursPerWeek:
        "(inputs.meetings_per_week * inputs.minutes_per_meeting) / 60",
      hoursPerYear: "calcs.hoursPerWeek * constants.WEEKS_PER_YEAR",
      workWeeksPerYear: "calcs.hoursPerYear / constants.WORK_HOURS_PER_WEEK",
      salaryCost: "calcs.hoursPerYear * constants.HOURLY_WAGE",
      percentOfWorkYear:
        "(calcs.hoursPerYear / (constants.WORK_HOURS_PER_WEEK * constants.WEEKS_PER_YEAR)) * 100",
      deepWorkBlocks: "floor(calcs.hoursPerYear / 2)",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your weekly meeting count and average length to see the annual cost.",
    templates: [
      {
        id: "default",
        cardColumns: 3 as const,
        cards: [
          {
            title: "Meeting hours per year",
            valueTemplate: "{{calcs.hoursPerYear|decimal1}}",
            descriptionTemplate:
              "{{calcs.hoursPerWeek|decimal1}} hrs/week × 52 weeks",
          },
          {
            title: "Full work weeks",
            valueTemplate: "{{calcs.workWeeksPerYear|decimal1}}",
            descriptionTemplate: "At a 40-hour work week",
          },
          {
            title: "Illustrative salary cost",
            valueTemplate: "${{calcs.salaryCost|integer}}",
            descriptionTemplate: "At $35/hr — scale to your own rate",
          },
        ],
        comparisonTitle: "What those meetings cost",
        comparisonRules: [
          {
            when: "calcs.percentOfWorkYear >= 50",
            textTemplate:
              "Meetings consume {{calcs.percentOfWorkYear|decimal1}}% of a full work year — more than half your paid time is scheduled, not chosen.",
          },
          {
            when: "calcs.percentOfWorkYear >= 30",
            textTemplate:
              "Roughly {{calcs.percentOfWorkYear|decimal1}}% of your work year sits in meetings — deep work has to fight for scraps.",
          },
          {
            when: "calcs.deepWorkBlocks >= 10",
            textTemplate:
              "That's {{calcs.deepWorkBlocks}} two-hour deep work blocks per year — time you never get for focused output.",
          },
          {
            when: "inputs.meetings_per_week >= 15",
            textTemplate:
              "{{inputs.meetings_per_week}} meetings weekly means context-switching all day — recovery time isn't counted here.",
          },
          {
            when: "true",
            textTemplate:
              "Cancel or shorten one recurring meeting and you reclaim {{calcs.hoursPerWeek|decimal1}}+ hours every week.",
          },
        ],
        fallbackComparison:
          "Even a few hours of meetings daily compounds into weeks of lost focus time each year.",
      },
    ],
  },

  guidance: [
    {
      title: "What counts as a meeting?",
      body: "Any scheduled call, standup, review, or sync — including video, phone, and in-person. Don't count async Slack unless it's a live huddle.",
    },
  ],

  ctas: {
    app: {
      title: "Protect focus between meetings",
      description:
        "Reset blocks distractions in the gaps between calls so you actually recover — instead of losing the hour after every meeting to your phone.",
    },
  },

  faq: [
    {
      question: "Does this include prep and follow-up time?",
      answer:
        "No — only scheduled meeting duration. Real cost is higher when you add notes, slack threads, and mental recovery between back-to-back calls.",
    },
    {
      question: "Where does the $35/hr figure come from?",
      answer:
        "It's an illustrative US median-ish rate for salary cost math. Multiply lost hours by your own hourly equivalent for a personal estimate.",
    },
    {
      question: "How many meetings is too many?",
      answer:
        "There's no universal number — but if meetings exceed 50% of work hours or you can't find 90-minute focus blocks, your calendar is likely the bottleneck.",
    },
  ],

  recommendations: [],
};
