import { ENGINE_CONSTANTS } from "./constants";

export const shallowWorkAuditConfig = {
  schemaVersion: "1.0" as const,
  id: "shallow-work-audit",
  slug: "shallow-work-audit",
  status: "published" as const,

  seo: {
    title: "Shallow Work Audit",
    metaDescription:
      "Calculate how much of your workweek is shallow work — meetings, email, Slack, and admin — versus time left for deep work. Cal Newport–style audit in 60 seconds.",
    primaryKeyword: "shallow work audit",
    secondaryKeywords: [
      "shallow vs deep work",
      "how much shallow work",
      "deep work hours calculator",
      "drain the shallows",
      "shallow work calculator",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/shallow-work-audit",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["deep-work", "shallow-work", "productivity"],
    cluster: "deep-work",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Shallow Work Audit",
    intro:
      "Enter your meetings, messaging, and admin time — see what percentage of your workday is shallow versus deep.",
    icon: "chart",
    proseTitle: "About this audit",
    sections: [
      {
        id: "problem",
        heading: "You can't fix what you haven't measured",
        framework: "pas",
        body: "Most people guess at their shallow load and underestimate it by a third. Email bleeds into mornings, Slack fills gaps, and meetings multiply — until deep work only happens by accident.",
      },
      {
        id: "concept",
        heading: "Drain the shallows first",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) recommends auditing shallow work before adding more productivity hacks. In [Deep Work](https://calnewport.com/books/deep-work/), \"drain the shallows\" means batching comms, cutting optional meetings, and capping admin — not eliminating collaboration entirely.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "outcome",
        body: "Shallow vs deep hours per week, percentage of your workday that's reactive, and whether you have enough depth left for a real 90-minute block.",
        list: [
          "Meetings, email/Slack, and admin counted separately",
          "Annual shallow hours in full work-week equivalents",
          "Newport-style verdict on your current ratio",
        ],
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "meeting_hours_week",
        type: "number" as const,
        label: "Meeting hours per week",
        placeholder: "e.g. 12",
        hint: "All scheduled calls, standups, 1:1s, and syncs.",
        min: 0,
        max: 80,
        step: 0.5,
        required: true,
      },
      {
        id: "comms_hours_day",
        type: "number" as const,
        label: "Email & Slack hours per day",
        placeholder: "e.g. 2",
        hint: "Reading, replying, and checking — honest average.",
        min: 0,
        max: 12,
        step: 0.25,
        required: true,
      },
      {
        id: "admin_hours_day",
        type: "number" as const,
        label: "Admin & busywork hours per day",
        placeholder: "e.g. 1",
        hint: "Expenses, scheduling, status updates, routine tasks.",
        min: 0,
        max: 12,
        step: 0.25,
        required: true,
      },
      {
        id: "work_hours_day",
        type: "number" as const,
        label: "Total work hours per day",
        placeholder: "e.g. 8",
        hint: "Your typical paid work day — not including side projects.",
        min: 1,
        max: 16,
        step: 0.5,
        required: true,
      },
    ],
    constants: {
      WORK_DAYS_PER_WEEK: 5,
      WEEKS_PER_YEAR: ENGINE_CONSTANTS.WEEKS_PER_YEAR,
      WORK_HOURS_PER_WEEK: ENGINE_CONSTANTS.WORK_HOURS_PER_WEEK,
    },
    expressions: {
      meetingHoursDay: "inputs.meeting_hours_week / constants.WORK_DAYS_PER_WEEK",
      shallowHoursDay:
        "inputs.comms_hours_day + inputs.admin_hours_day + calcs.meetingHoursDay",
      deepHoursDay: "max(0, inputs.work_hours_day - calcs.shallowHoursDay)",
      shallowPercent: "(calcs.shallowHoursDay / inputs.work_hours_day) * 100",
      deepPercent: "(calcs.deepHoursDay / inputs.work_hours_day) * 100",
      deepHoursWeek: "calcs.deepHoursDay * constants.WORK_DAYS_PER_WEEK",
      shallowHoursWeek: "calcs.shallowHoursDay * constants.WORK_DAYS_PER_WEEK",
      shallowHoursYear: "calcs.shallowHoursWeek * constants.WEEKS_PER_YEAR",
      deepHoursYear: "calcs.deepHoursWeek * constants.WEEKS_PER_YEAR",
      shallowWorkWeeks: "calcs.shallowHoursYear / constants.WORK_HOURS_PER_WEEK",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your meeting, messaging, and admin hours to see your shallow vs deep split.",
    templates: [
      {
        id: "default",
        cardColumns: 3 as const,
        cards: [
          {
            title: "Shallow work per day",
            valueTemplate: "{{calcs.shallowHoursDay|decimal1}} hrs",
            descriptionTemplate: "{{calcs.shallowPercent|decimal1}}% of your workday",
          },
          {
            title: "Deep work per day",
            valueTemplate: "{{calcs.deepHoursDay|decimal1}} hrs",
            descriptionTemplate: "{{calcs.deepPercent|decimal1}}% left for focus",
          },
          {
            title: "Deep work per week",
            valueTemplate: "{{calcs.deepHoursWeek|decimal1}} hrs",
            descriptionTemplate: "At 5 workdays — your depth budget",
          },
        ],
        summaryTemplates: [
          "You spend {{calcs.shallowHoursYear|decimal1}} hours/year on shallow work — roughly {{calcs.shallowWorkWeeks|decimal1}} full work weeks.",
        ],
        comparisonTitle: "What Newport would call this",
        comparisonRules: [
          {
            when: "calcs.shallowPercent >= 70",
            textTemplate:
              "{{calcs.shallowPercent|decimal1}}% shallow — deep work is an exception, not a practice. Drain comms and meetings first.",
          },
          {
            when: "calcs.shallowPercent >= 50",
            textTemplate:
              "More than half your day is shallow — you're busy but not building. Batch email and cut one recurring meeting.",
          },
          {
            when: "calcs.deepHoursWeek >= 15",
            textTemplate:
              "{{calcs.deepHoursWeek|decimal1}} deep hours weekly is solid — protect them and push shallow work lower.",
          },
          {
            when: "calcs.deepHoursDay < 1",
            textTemplate:
              "Under 1 hour of deep work daily — no 90-minute block can survive without calendar surgery.",
          },
          {
            when: "true",
            textTemplate:
              "Newport suggests draining shallow work systematically — batch comms, say no to optional meetings, delegate admin.",
          },
        ],
        fallbackComparison:
          "Most knowledge workers underestimate shallow work by 30%. Track one honest week before trusting these numbers.",
      },
    ],
  },

  guidance: [
    {
      title: "Deep vs shallow work",
      body: "Shallow work is logistical, easy, and often urgent — email, meetings, admin. Deep work requires uninterrupted concentration and creates disproportionate value.",
      list: [
        "Shallow: status updates, most meetings, inbox triage",
        "Deep: writing, coding, strategy, learning hard material",
        "Switching between them has a hidden refocus cost",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Reclaim hours from shallow drift",
      description:
        "Reset blocks distracting apps during deep work windows — so the hours you audit as \"deep\" aren't lost to phone checks mid-block.",
    },
  },

  faq: [
    {
      question: "What's a healthy shallow-to-deep ratio?",
      answer:
        "There's no universal number, but if shallow work exceeds 50–60% of your day, finding 90-minute deep blocks becomes very hard. Aim to grow deep hours weekly.",
    },
    {
      question: "Are all meetings shallow work?",
      answer:
        "Most recurring syncs are shallow. Strategic planning or hard problem-solving with a whiteboard can be deep — but they're rare in typical calendars.",
    },
    {
      question: "How do I drain the shallows?",
      answer:
        "Batch email twice daily, decline optional meetings, automate admin, and protect morning deep blocks before shallow work starts.",
    },
  ],

  recommendations: [],
};
